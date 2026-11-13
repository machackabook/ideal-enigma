import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyLeftInverse, verifyUnboundInverse } from '../src/cryptic/unbound-inverse.mjs';
import { LANE_LAYOUT, validateExecutionTicket, validatePairedLaneState, buildPairVerification } from '../src/cryptic/dualtrace.mjs';

const mod17 = value => ((value % 17) + 17) % 17;
const forward = x => mod17(3 * x + 2);
const inverse = y => mod17(6 * (y - 2));
const eq = (a, b) => a === b;

test('unbound inverse verifies right and left inverse identities over the finite domain', () => {
  for (let x = 0; x < 17; x++) {
    const y = forward(x);
    assert.equal(verifyUnboundInverse(y, inverse, forward, eq).accepted, true);
    assert.equal(verifyLeftInverse(x, forward, inverse, eq).accepted, true);
  }
});

test('unbound inverse rejects a wrong inverse and preserves mismatch reason', () => {
  const receipt = verifyUnboundInverse(forward(7), y => y, forward, eq);
  assert.equal(receipt.accepted, false);
  assert.equal(receipt.reason, 'forward_reconstruction_mismatch');
});

test('unbound inverse reports thrown operator errors without claiming success', () => {
  const receipt = verifyUnboundInverse(5, () => { throw new Error('no inverse'); }, forward, eq);
  assert.equal(receipt.accepted, false);
  assert.match(receipt.reason, /^verification_error:Error$/);
});

test('four lane layout preserves the two opposing pairs and explicit orders', () => {
  assert.deepEqual(LANE_LAYOUT[1], { pairId: 'A', role: 'automation', order: '1234', opposingLane: 2 });
  assert.deepEqual(LANE_LAYOUT[2], { pairId: 'A', role: 'shadow', order: '4321', opposingLane: 1 });
  assert.deepEqual(LANE_LAYOUT[3], { pairId: 'B', role: 'automation', order: '4321', opposingLane: 4 });
  assert.deepEqual(LANE_LAYOUT[4], { pairId: 'B', role: 'shadow', order: '1234', opposingLane: 3 });
});

test('paired lane state retains negative polarity and original opposing tickets', () => {
  const fp = 'a'.repeat(64);
  const sourceTicket = { ticketId: 't1', sourceSequenceId: 'seq-1', sourceLane: 1, opposingLane: 2, originalOrder: '1234', originalPosition: 0, polarity: -1, operatorSetVersion: '1.0.0', stateFingerprint: fp };
  const opposingTicket = { ...sourceTicket, ticketId: 't2', sourceLane: 2, opposingLane: 1, originalOrder: '4321' };
  const state = { laneId: 1, pairId: 'A', role: 'automation', order: '1234', executionCursor: 0, fractionalCursor: 0, wholeCycle: 0, sourceTicket, opposingTicket, polarity: -1, inverseVersion: 1, reconstructionError: 0 };
  assert.equal(validateExecutionTicket(sourceTicket).valid, true);
  assert.equal(validatePairedLaneState(state).valid, true);
  assert.equal(state.polarity, -1);
});

test('lane validator rejects mismatched pair metadata and missing polarity', () => {
  const fp = 'b'.repeat(64);
  const ticket = { ticketId: 't', sourceSequenceId: 'seq', sourceLane: 1, opposingLane: 2, originalOrder: '1234', originalPosition: 0, polarity: 1, operatorSetVersion: '1.0.0', stateFingerprint: fp };
  const state = { laneId: 1, pairId: 'B', role: 'automation', order: '1234', executionCursor: 0, fractionalCursor: 0, wholeCycle: 0, sourceTicket: ticket, opposingTicket: { ...ticket, sourceLane: 2, opposingLane: 1, originalOrder: '4321' }, polarity: 1, inverseVersion: 0, reconstructionError: 0 };
  assert.equal(validatePairedLaneState(state).reason, 'lane_layout_mismatch');
  assert.equal(validatePairedLaneState({ ...state, pairId: 'A', polarity: undefined }).reason, 'explicit_polarity_required');
});

test('pair verification derives acceptance from fingerprints and residual tolerance', () => {
  const receipt = buildPairVerification({ pairId: 'A', sourceSequenceId: 'seq-1', sourceFingerprint: 'C'.repeat(64), reconstructedFingerprint: 'c'.repeat(64), maximumResidual: 0, tolerance: 0.01, fractionalCheckpoint: 0.5, wholeCycle: 1 });
  assert.equal(receipt.sourceFingerprint, 'c'.repeat(64));
  assert.equal(receipt.verified, true);
  const mismatch = buildPairVerification({ pairId: 'A', sourceSequenceId: 'seq-2', sourceFingerprint: 'a'.repeat(64), reconstructedFingerprint: 'b'.repeat(64), maximumResidual: 0, tolerance: 0.01, fractionalCheckpoint: 0.5, wholeCycle: 1 });
  assert.equal(mismatch.verified, false);
  assert.throws(() => buildPairVerification({ pairId: 'C', sourceSequenceId: 'seq', sourceFingerprint: 'a'.repeat(64), reconstructedFingerprint: 'b'.repeat(64), maximumResidual: 0, tolerance: 0.01, fractionalCheckpoint: 0.5, wholeCycle: 0 }));
});
