/**
 * Algorithm-independent inverse verification.
 * The caller supplies both operators and an equality relation appropriate to Y.
 * This verifies a supplied round trip; it does not prove universal bijectivity.
 */

/**
 * @template X, Y
 * @typedef {Object} InverseReceipt
 * @property {boolean} accepted
 * @property {Y} target
 * @property {X | undefined} reconstructed
 * @property {Y | undefined} forwardResult
 * @property {string} reason
 */

/**
 * Verify F(F^-1(Y)) = Y for one supplied target.
 * @template X, Y
 * @param {Y} target
 * @param {(target: Y) => X} inverse
 * @param {(value: X) => Y} forward
 * @param {(actual: Y, expected: Y) => boolean} equals
 * @returns {InverseReceipt<X, Y>}
 */
export function verifyUnboundInverse(target, inverse, forward, equals) {
  if (typeof inverse !== 'function' || typeof forward !== 'function' || typeof equals !== 'function') {
    throw new TypeError('inverse_forward_and_equals_must_be_functions');
  }
  try {
    const reconstructed = inverse(target);
    const forwardResult = forward(reconstructed);
    const accepted = Boolean(equals(forwardResult, target));
    return {
      accepted,
      target,
      reconstructed,
      forwardResult,
      reason: accepted ? 'F(F^-1(Y)) == Y' : 'forward_reconstruction_mismatch'
    };
  } catch (error) {
    return {
      accepted: false,
      target,
      reconstructed: undefined,
      forwardResult: undefined,
      reason: `verification_error:${error instanceof Error ? error.name : 'UnknownError'}`
    };
  }
}

/**
 * Verify F^-1(F(X)) = X for one supplied source value.
 * @template X, Y
 * @param {X} source
 * @param {(value: X) => Y} forward
 * @param {(target: Y) => X} inverse
 * @param {(actual: X, expected: X) => boolean} equals
 */
export function verifyLeftInverse(source, forward, inverse, equals) {
  if (typeof inverse !== 'function' || typeof forward !== 'function' || typeof equals !== 'function') {
    throw new TypeError('inverse_forward_and_equals_must_be_functions');
  }
  try {
    const target = forward(source);
    const reconstructed = inverse(target);
    const accepted = Boolean(equals(reconstructed, source));
    return {
      accepted,
      source,
      target,
      reconstructed,
      reason: accepted ? 'F^-1(F(X)) == X' : 'left_inverse_reconstruction_mismatch'
    };
  } catch (error) {
    return {
      accepted: false,
      source,
      target: undefined,
      reconstructed: undefined,
      reason: `verification_error:${error instanceof Error ? error.name : 'UnknownError'}`
    };
  }
}
