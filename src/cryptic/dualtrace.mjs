/**
 * AE.SL6.DUALTRACE.4P — contracts and pair-local validation.
 * This module validates lane metadata; it does not schedule or execute workloads.
 */

export const LANE_LAYOUT = Object.freeze({
  1: Object.freeze({ pairId: 'A', role: 'automation', order: '1234', opposingLane: 2 }),
  2: Object.freeze({ pairId: 'A', role: 'shadow', order: '4321', opposingLane: 1 }),
  3: Object.freeze({ pairId: 'B', role: 'automation', order: '4321', opposingLane: 4 }),
  4: Object.freeze({ pairId: 'B', role: 'shadow', order: '1234', opposingLane: 3 })
});

export function validateExecutionTicket(ticket) {
  if (!ticket || typeof ticket !== 'object') return { valid: false, reason: 'ticket_required' };
  if (typeof ticket.ticketId !== 'string' || !ticket.ticketId.trim()) return { valid: false, reason: 'ticket_id_required' };
  if (typeof ticket.sourceSequenceId !== 'string' || !ticket.sourceSequenceId.trim()) return { valid: false, reason: 'source_sequence_id_required' };
  if (![1, 2, 3, 4].includes(ticket.sourceLane) || ![1, 2, 3, 4].includes(ticket.opposingLane)) return { valid: false, reason: 'invalid_lane_id' };
  if (LANE_LAYOUT[ticket.sourceLane].opposingLane !== ticket.opposingLane) return { valid: false, reason: 'opposing_lane_mismatch' };
  if (!['1234', '4321'].includes(ticket.originalOrder)) return { valid: false, reason: 'invalid_sequence_order' };
  if (!Number.isInteger(ticket.originalPosition) || ticket.originalPosition < 0) return { valid: false, reason: 'invalid_original_position' };
  if (ticket.polarity !== 1 && ticket.polarity !== -1) return { valid: false, reason: 'explicit_polarity_required' };
  if (typeof ticket.operatorSetVersion !== 'string' || !ticket.operatorSetVersion.trim()) return { valid: false, reason: 'operator_set_version_required' };
  if (typeof ticket.stateFingerprint !== 'string' || !/^[a-f0-9]{64}$/i.test(ticket.stateFingerprint)) return { valid: false, reason: 'invalid_state_fingerprint' };
  return { valid: true, reason: 'ticket_valid' };
}

export function validatePairedLaneState(state) {
  if (!state || typeof state !== 'object') return { valid: false, reason: 'lane_state_required' };
  const layout = LANE_LAYOUT[state.laneId];
  if (!layout) return { valid: false, reason: 'invalid_lane_id' };
  if (state.pairId !== layout.pairId || state.role !== layout.role || state.order !== layout.order) {
    return { valid: false, reason: 'lane_layout_mismatch' };
  }
  if (state.polarity !== 1 && state.polarity !== -1) return { valid: false, reason: 'explicit_polarity_required' };
  for (const field of ['executionCursor', 'fractionalCursor', 'wholeCycle', 'inverseVersion']) {
    if (!Number.isInteger(state[field]) || state[field] < 0) return { valid: false, reason: `invalid_${field}` };
  }
  if (typeof state.reconstructionError !== 'number' || !Number.isFinite(state.reconstructionError) || state.reconstructionError < 0) {
    return { valid: false, reason: 'invalid_reconstruction_error' };
  }
  const source = validateExecutionTicket(state.sourceTicket);
  if (!source.valid) return { valid: false, reason: `source_${source.reason}` };
  const opposing = validateExecutionTicket(state.opposingTicket);
  if (!opposing.valid) return { valid: false, reason: `opposing_${opposing.reason}` };
  if (state.sourceTicket.sourceLane !== state.laneId || state.sourceTicket.opposingLane !== layout.opposingLane) {
    return { valid: false, reason: 'source_ticket_lane_mismatch' };
  }
  if (state.sourceTicket.originalOrder !== layout.order || state.sourceTicket.polarity !== state.polarity) {
    return { valid: false, reason: 'source_ticket_execution_metadata_mismatch' };
  }
  if (state.opposingTicket.sourceLane !== layout.opposingLane || state.opposingTicket.opposingLane !== state.laneId) {
    return { valid: false, reason: 'opposing_ticket_lane_mismatch' };
  }
  if (state.opposingTicket.originalOrder !== LANE_LAYOUT[layout.opposingLane].order) {
    return { valid: false, reason: 'opposing_ticket_order_mismatch' };
  }
  if (state.sourceTicket.sourceSequenceId !== state.opposingTicket.sourceSequenceId) {
    return { valid: false, reason: 'source_sequence_mismatch' };
  }
  return { valid: true, reason: 'paired_lane_state_valid' };
}

export function buildPairVerification({ pairId, sourceSequenceId, sourceFingerprint, reconstructedFingerprint, maximumResidual, tolerance, fractionalCheckpoint, wholeCycle }) {
  if (!['A', 'B'].includes(pairId)) throw new TypeError('invalid_pair_id');
  if (typeof sourceSequenceId !== 'string' || !sourceSequenceId.trim()) throw new TypeError('source_sequence_id_required');
  for (const [name, value] of [['sourceFingerprint', sourceFingerprint], ['reconstructedFingerprint', reconstructedFingerprint]]) {
    if (typeof value !== 'string' || !/^[a-f0-9]{64}$/i.test(value)) throw new TypeError(`invalid_${name}`);
  }
  if (typeof maximumResidual !== 'number' || !Number.isFinite(maximumResidual) || maximumResidual < 0) throw new TypeError('invalid_maximum_residual');
  if (typeof tolerance !== 'number' || !Number.isFinite(tolerance) || tolerance < 0) throw new TypeError('invalid_tolerance');
  if (!Number.isFinite(fractionalCheckpoint) || fractionalCheckpoint < 0 || fractionalCheckpoint > 1) throw new TypeError('invalid_fractional_checkpoint');
  if (!Number.isInteger(wholeCycle) || wholeCycle < 0) throw new TypeError('invalid_whole_cycle');
  const source = sourceFingerprint.toLowerCase();
  const reconstructed = reconstructedFingerprint.toLowerCase();
  const verified = source === reconstructed && maximumResidual <= tolerance;
  return Object.freeze({ pairId, sourceSequenceId, sourceFingerprint: source, reconstructedFingerprint: reconstructed, maximumResidual, tolerance, verified, fractionalCheckpoint, wholeCycle });
}
