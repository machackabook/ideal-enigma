# AE.SL6.DUALTRACE.4P — paired inverse verification

**Status:** contract and pure verification utilities; no scheduler or production runtime is claimed.

## Four-lane arrangement

| Lane | Pair | Role | Order | Opposing lane |
|---:|---|---|---|---:|
| 1 | A | Automation | `1234` | 2 |
| 2 | A | Shadow | `4321` | 1 |
| 3 | B | Automation | `4321` | 4 |
| 4 | B | Shadow | `1234` | 3 |

Each lane owns its execution cursor and retains both its original source ticket and the opposing ticket. Polarity is explicit (`+1` or `-1`) and is never inferred from order or erased with an absolute-value operation. A mismatch in one pair does not rewrite the other pair.

Fractional checkpoints, midpoint comparison, and whole-cycle closure are separate observations. The graph is a view of verified kernel state, not the source of truth. A reversed schedule is not automatically an inverse: the operators and reverse composition must be mathematically defined.

## Inverse verification

The unbound module accepts an injected target, inverse, forward operator, and equality relation. It checks:

\[
F(F^{-1}(Y))=Y
\]

A separate function checks:

\[
F^{-1}(F(X))=X
\]

A passing sample proves only that the supplied identity holds for the tested input(s). Pair receipts derive their verified flag from matching source/reconstruction fingerprints and a residual no greater than the declared tolerance. Universal invertibility requires a proof over the declared domains and codomains. The verifier preserves a rejected receipt when an operator throws or reconstruction mismatches; it never manufactures a successful inverse.

## Code boundaries

- `src/cryptic/unbound-inverse.mjs` — generic right/left inverse checks.
- `src/cryptic/dualtrace.mjs` — four-lane metadata contracts and validation.
- `tests/dualtrace.test.mjs` — finite-domain modular example, failure cases, lane metadata and explicit polarity.

These files do not schedule workloads, control hardware, access CMOS, reserve storage, or assert a measured 0.1 ms execution interval. Such capabilities require a separate authorized runtime/provider and measured receipts.
