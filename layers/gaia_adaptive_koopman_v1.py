#!/usr/bin/env python3
"""GAIA Adaptive Koopman v1.0: verifiable numerical EDMD with bounded BLAS control.

Analytic source uses the exact Fourier curve provided by the user. For external
streams: one JSON object/line with either {"state": [numbers...]},
or {"x": number, "y": number, "theta": optional number}.
The Bun relation triple format must be converted to meaningful numerical states
before it can be used for Koopman system identification.
"""
from __future__ import annotations

import argparse
from collections import deque
from contextlib import contextmanager
from itertools import combinations_with_replacement
import hashlib
import io
import json
import math
import os
from pathlib import Path
import shutil
import sys
import time
import uuid

import numpy as np
from scipy import special
from threadpoolctl import ThreadpoolController, threadpool_info, threadpool_limits

VERSION = "GAIA-NEXUS-ADAM-KOOPMAN-1.0"


def analytic_state(theta):
    """Fourier curve supplied by user, with an observable phase clock."""
    t = np.asarray(theta, dtype=float)
    x = np.cos(t) + .5*np.cos(2*t) + .5*np.cos(4*t) + .375*np.cos(8*t)
    y = 2*np.sin(t) - np.sin(2*t) + np.sin(4*t) - .75*np.sin(8*t)
    return np.stack((x, y, np.cos(t), np.sin(t)), axis=-1)


def phase_integral(t, velocity):
    """Continuous phase from v(t), not the generally incorrect t*v(t)."""
    t = np.asarray(t, float)
    v = np.asarray(velocity, float)
    if len(t) < 2 or len(t) != len(v) or np.any(np.diff(t) <= 0):
        raise ValueError("phase clock requires equal-sized, strictly increasing time samples")
    return np.r_[0., np.cumsum((v[1:] + v[:-1]) * .5 * np.diff(t))]


def source_rows(args):
    if args.source == 'analytic':
        # Genuine integration of v(t)=v0+sensor_delta(t), using constant memory.
        total=args.cycles*2*math.pi
        tprev=0.0
        vprev=args.base_speed
        phase=args.phase_offset
        for i in range(args.samples):
            t=i*total/(args.samples-1)
            v=args.base_speed+args.sensor_amplitude*math.sin(args.sensor_frequency*t)
            if i:
                phase += .5*(vprev+v)*(t-tprev)
            yield analytic_state(phase)
            tprev,vprev=t,v
        return
    source = sys.stdin if args.source == '-' else open(args.source, 'r', encoding='utf-8')
    with source if source is not sys.stdin else _nullcontext(source):
        for n, raw in enumerate(source, 1):
            if not raw.strip():
                continue
            try:
                record = json.loads(raw)
                if 'state' in record:
                    state = np.asarray(record['state'], dtype=float)
                elif all(k in record for k in ('x', 'y')):
                    state = np.asarray([record['x'], record['y']], dtype=float)
                    if 'theta' in record:
                        state = np.r_[state, np.cos(float(record['theta'])), np.sin(float(record['theta']))]
                else:
                    raise ValueError("need numeric 'state' or 'x' and 'y' fields")
                if state.ndim != 1 or state.size < 2 or state.size > 16 or not np.isfinite(state).all():
                    raise ValueError('state must contain 2..16 finite numeric values')
                yield state
            except (ValueError, TypeError, KeyError) as e:
                raise ValueError(f'input JSONL line {n}: {e}') from e


@contextmanager
def _nullcontext(obj):
    yield obj


def windows(source, window, hop):
    """Bounded-memory overlapping windows; genuine stream backpressure."""
    it = iter(source)
    buf = deque(maxlen=window + 1)
    for _ in range(window + 1):
        try:
            buf.append(next(it))
        except StopIteration:
            break
    idx = 0
    while len(buf) >= max(65, int(0.8 * (window + 1))):
        rows = np.asarray(list(buf), dtype=float)
        if rows.ndim != 2 or not np.isfinite(rows).all():
            raise ValueError('inconsistent state dimensions or non-finite input')
        yield idx, rows
        idx += 1
        for _ in range(min(hop, len(buf))):
            buf.popleft()
        for _ in range(hop):
            try:
                buf.append(next(it))
            except StopIteration:
                break
        if len(buf) <= 1:
            break


def lift(z, *, degree=3, harmonics=3, cheb=3, transcendental=True):
    """Stable dictionary: constant, states, polynomial, Fourier, Chebyshev, specials."""
    z = np.asarray(z, float)
    n, d = z.shape
    cols = [np.ones(n)] + [z[:,i] for i in range(d)]
    for deg in range(2, degree+1):
        for inds in combinations_with_replacement(range(d),deg):
            cols.append(np.prod(z[:, inds],axis=1))
    for i in range(d):
        for k in range(1,harmonics+1):
            cols.extend((np.sin(k*math.pi*z[:,i]),np.cos(k*math.pi*z[:,i])))
        for k in range(2,cheb+1):
            v = np.clip(z[:,i],-1,1)
            cols.extend((special.eval_chebyt(k,v),special.eval_chebyu(k,v)))
    if transcendental and d >= 2:
        a,b=z[:,0],z[:,1]
        r=np.hypot(a,b)
        cols.extend((special.erf(a),special.erfc(b),special.gamma(1.5+a*b),
                     special.j0(r),special.j1(r),special.k0(r+.1),
                     np.exp(-r*r),np.sin(np.cosh(np.clip(a*b,-3,3))),
                     np.cos(np.sinh(np.clip(a-b,-3,3))),
                     np.tanh(a)/np.cosh(b),np.log1p(np.abs(a*b))))
    mat = np.column_stack(cols)
    if not np.isfinite(mat).all():
        raise ArithmeticError('non-finite dictionary; reduce input range or disable transcendentals')
    return mat


def fit_basis(data):
    """Scale based only on chronological training observations."""
    center = np.mean(data,axis=0)
    scale = np.maximum(np.std(data,axis=0),1e-6)
    return center, scale


def tune_threads(mat, maximum):
    """Benchmark BLAS on an actual lifted data matrix, never a fictitious workload."""
    maximum=max(1,min(maximum,os.cpu_count() or 1))
    trials={}
    candidates=sorted({1,min(2,maximum),min(4,maximum), maximum})
    for count in candidates:
        measurements=[]
        with threadpool_limits(limits=count,user_api='blas'):
            for _ in range(2):
                start=time.perf_counter()
                gram=mat.T @ mat
                _=np.linalg.eigvalsh(gram)
                measurements.append(time.perf_counter()-start)
        trials[str(count)] = round(min(measurements),6)
    fastest=min(trials.values())
    # Avoid overfitting noisy sub-millisecond benchmarks: prefer fewer threads.
    best=min(int(k) for k,v in trials.items() if v <= fastest * 1.05)
    return best,trials


def flexiblas_opt_in(name):
    """Switch only an already-loaded FlexiBLAS, without guessing capabilities."""
    if name is None:
        return {'status':'not_requested'}
    ctrl=ThreadpoolController()
    matches=ctrl.select(internal_api='flexiblas').lib_controllers
    if not matches:
        raise RuntimeError('FlexiBLAS is not loaded: NumPy may use ordinary OpenBLAS/MKL.')
    f=matches[0]
    if name not in (f.available_backends or []):
        raise RuntimeError(f'FlexiBLAS backend {name!r} unavailable; available: {f.available_backends}')
    f.switch_backend(name)
    return {'status':'switched','backend':f.current_backend}


def koopman_window(rows, rank_limit, energy, ridge, thread_count):
    x, y = rows[:-1],rows[1:]
    n=len(x)
    train_end=max(32,int(.70*n))
    valid_end=max(train_end+8,int(.85*n))
    if n-valid_end<8:
        raise ValueError('insufficient pairs for chronological validation/test')
    center,scale=fit_basis(x[:train_end])
    with threadpool_limits(limits=thread_count,user_api='blas'):
        a=lift((x-center)/scale)
        b=lift((y-center)/scale)
        # Fit purely chronological training data. No validation/test leakage.
        start=time.perf_counter()
        u,s,vt=np.linalg.svd(a[:train_end],full_matrices=False)
        spectrum=np.cumsum(s*s)/max(np.sum(s*s),np.finfo(float).tiny)
        # Energy rank: smallest r with cumulative energy >= threshold.
        base_rank=int(np.searchsorted(spectrum,energy)+1)
        max_rank=max(1,min(rank_limit,len(s)))
        ranks=sorted({max(1,min(max_rank,r)) for r in [base_rank//2,base_rank,min(max_rank,base_rank*2),max_rank]})
        lambda_candidates=sorted({float(ridge), float(ridge*100.)})
        ub=u.T @ b[:train_end]
        vb=vt.T
        selections=[]
        best=None
        for r in ranks:
            for lam in lambda_candidates:
                coeff=(s[:r]/(s[:r]*s[:r]+lam))[:,None]*ub[:r]
                k=vb[:,:r] @ coeff
                val=((a[train_end:valid_end] @ k)[:,1:x.shape[1]+1])*scale+center
                val_rmse=float(np.sqrt(np.mean((val-y[train_end:valid_end])**2)))
                # Modest complexity penalty to prefer efficient equal-accuracy fits.
                score=val_rmse+0.00001*r
                selections.append({'rank':r,'ridge':lam,'validation_rmse':val_rmse})
                if best is None or score<best[0]:
                    best=(score,k,r,lam,val_rmse)
        elapsed=time.perf_counter()-start
        _,k,r,lam,val_rmse=best
        pred=((a[valid_end:]@k)[:,1:x.shape[1]+1])*scale+center
        truth=y[valid_end:]
        test_rmse=float(np.sqrt(np.mean((pred-truth)**2)))
        persistence_rmse=float(np.sqrt(np.mean((x[valid_end:]-truth)**2)))
        validation_persistence_rmse=float(np.sqrt(np.mean((x[train_end:valid_end]-y[train_end:valid_end])**2)))
        # True held-out model check; don't label success just because SVD ran.
        finite=bool(np.isfinite(pred).all() and np.isfinite(k).all())
        if not finite:
            raise ArithmeticError('non-finite Koopman result')
        curve_distance=np.linalg.norm(np.diff(rows[:,:2],axis=0),axis=1)
        integral_arc=float(np.sum(curve_distance))
        residual=truth-pred
        out={
            'version':VERSION,'samples':int(len(rows)),'basis_dimension':int(a.shape[1]),
            'chosen_rank':r,'energy_threshold':energy,'ridge':lam,
            'validation_rmse':round(val_rmse,9),
            'validation_persistence_rmse':round(validation_persistence_rmse,9),
            'test_rmse':round(test_rmse,9),
            'persistence_test_rmse':round(persistence_rmse,9),
            'beats_persistence':bool(test_rmse<persistence_rmse),
            'max_abs_test_error':round(float(np.abs(residual).max()),9),
            'mean_abs_test_error':round(float(np.abs(residual).mean()),9),
            'fit_seconds':round(elapsed,6),'threads':int(thread_count),
            'path_arc_length':round(integral_arc,9),
            'sha256_input_window':hashlib.sha256(np.ascontiguousarray(rows).tobytes()).hexdigest(),
            'proof':{'chronological_split':[train_end, valid_end, n],
                     'all_finite':finite,'heldout_evaluated':True},
        }
        return out


@contextmanager
def output_stream(path, azure_container):
    if azure_container:
        from azure.storage.blob import BlobServiceClient
        from smart_open import open as smart_open
        conn=os.environ.get('AZURE_STORAGE_CONNECTION_STRING')
        if not conn:
            raise RuntimeError('AZURE_STORAGE_CONNECTION_STRING must be set for Azure output')
        # Unique object per run prevents overwrites. Container must preexist.
        name=f'gaia/koopman/{time.strftime("%Y%m%dT%H%M%SZ",time.gmtime())}-{uuid.uuid4().hex}.jsonl'
        uri=f'azure://{azure_container}/{name}'
        client=BlobServiceClient.from_connection_string(conn)
        transport={'client':client,'blob_kwargs':{'metadata':{'engine':'gaia_koopman_v1'}}}
        with smart_open(uri,'wb',transport_params=transport,compression='disable') as out:
            print(json.dumps({'azure_destination':uri}),file=sys.stderr)
            yield out
    elif path:
        with open(path,'xb') as out:
            yield out
    else:
        yield sys.stdout.buffer


def main():
    p=argparse.ArgumentParser(description=VERSION)
    p.add_argument('--source',default='analytic',help='analytic, - (stdin JSONL), or local JSONL path')
    p.add_argument('--samples',type=int,default=1025)
    p.add_argument('--cycles',type=float,default=4.0)
    p.add_argument('--base-speed',type=float,default=1.0)
    p.add_argument('--sensor-amplitude',type=float,default=0.0)
    p.add_argument('--sensor-frequency',type=float,default=1.0)
    p.add_argument('--phase-offset',type=float,default=0.0)
    p.add_argument('--window',type=int,default=257)
    p.add_argument('--hop',type=int,default=128)
    p.add_argument('--rank-limit',type=int,default=65)
    p.add_argument('--energy',type=float,default=.999)
    p.add_argument('--ridge',type=float,default=1e-6)
    p.add_argument('--threads',default='auto',help='auto or positive integer')
    p.add_argument('--max-threads',type=int,default=4)
    p.add_argument('--flexiblas-backend',default=None)
    p.add_argument('--retune-every',type=int,default=4,help='0 disables periodic BLAS auto-retuning')
    p.add_argument('--output',default=None,help='local new file; defaults stdout')
    p.add_argument('--azure-container',default=None,help='send to an existing private Azure container')
    p.add_argument('--self-export',default=None,help='copy unmodified program source to a file')
    args=p.parse_args()
    if args.self_export:
        shutil.copyfile(Path(__file__),Path(args.self_export))
        print('source export copied',file=sys.stderr)
        return
    if args.output and args.azure_container:
        p.error('choose exactly one of --output and --azure-container')
    if not all(math.isfinite(v) for v in (args.cycles,args.base_speed,args.sensor_amplitude,args.sensor_frequency,args.phase_offset,args.energy,args.ridge)) or args.samples<65 or args.window<65 or args.hop<1 or args.hop>args.window or not 0<args.energy<=1 or args.rank_limit<1 or args.ridge<=0 or args.max_threads<1 or args.retune_every<0:
        p.error('invalid samples/window/hop/energy/rank/ridge/max-threads')
    backend=flexiblas_opt_in(args.flexiblas_backend)
    rows=windows(source_rows(args),args.window,args.hop)
    first=next(rows,None)
    if first is None:
        raise ValueError('need at least 65 source observations')
    _,sample=first
    center,scale=fit_basis(sample[:max(32,int(.7*len(sample)))])
    pilot=lift((sample-center)/scale)
    if args.threads=='auto':
        count,times=tune_threads(pilot,max(1,args.max_threads))
    else:
        count=int(args.threads)
        if count<1:raise ValueError('--threads must be positive')
        times={}
    meta={'version':VERSION,'event':'environment','blas_libraries':threadpool_info(),
          'flexiblas':backend,'bench_seconds_by_threads':times,'selected_threads':count,
          'source':args.source, 'window':args.window, 'hop':args.hop}
    with output_stream(args.output,args.azure_container) as out:
        def write(ob):
            out.write((json.dumps(ob,allow_nan=False,separators=(',',':'))+'\n').encode())
        write(meta)
        good=0; total=0
        adaptive_energy=args.energy
        adaptive_ridge=args.ridge
        import itertools
        for index,data in itertools.chain([first],rows):
            if args.threads=='auto' and args.retune_every and index and index % args.retune_every == 0:
                c,s=fit_basis(data[:max(32,int(.7*len(data)))])
                count,times=tune_threads(lift((data-c)/s),args.max_threads)
                write({'version':VERSION,'event':'thread_retune','window_index':index,
                       'selected_threads':count,'bench_seconds_by_threads':times})
            result=koopman_window(data,args.rank_limit,adaptive_energy,adaptive_ridge,count)
            result['event']='koopman_window';result['window_index']=index
            # Feedback uses validation only, preserving the test split as held-out proof.
            if result['validation_rmse'] >= result['validation_persistence_rmse']:
                adaptive_energy=max(.90,adaptive_energy-.02)
                adaptive_ridge=min(1e-2,adaptive_ridge*10)
                action='compress_and_regularize'
            else:
                adaptive_energy=min(.99999,adaptive_energy+.0001)
                adaptive_ridge=max(1e-9,adaptive_ridge*.9)
                action='increase_fidelity'
            result['feedback']={'action_for_next_window':action,
                                'next_energy':round(adaptive_energy,7),
                                'next_ridge':adaptive_ridge}
            write(result)
            good+=int(result['beats_persistence']);total+=1
        write({'version':VERSION,'event':'summary','windows':total,
               'windows_beating_persistence':good,
               'status':'numerically_verified' if total else 'no_data',
               'note':'Deployment, cloud upload, and target-hardware throughput require separate verification'})
        out.flush()
    print(f'{VERSION}: {total} windows evaluated; {good} better than persistence',file=sys.stderr)


if __name__=='__main__':
    try:
        main()
    except (Exception,KeyboardInterrupt) as e:
        print(f'{VERSION}: FAILED: {type(e).__name__}: {e}',file=sys.stderr)
        sys.exit(1)
