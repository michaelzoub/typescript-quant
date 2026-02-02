import { erf } from "mathjs";

/**
 * Standard normal CDF (Φ)
 * @param x - Input value
 * @returns Cumulative probability P(Z ≤ x)
 */
function standardNormalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

/**
 * Standard normal PDF (φ)
 * @param x - Input value
 * @returns Probability density at x
 */
function standardNormalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Dynamic pm-AMM Invariant
 *
 * Derived from Gaussian score dynamics, this invariant ensures constant expected LVR
 * (as a fraction of portfolio value) over the remaining time to expiration.
 *
 * The invariant equation:
 *   (y - x)Φ((y - x)/(L√(T-t))) + L√(T-t)φ((y - x)/(L√(T-t))) - y = 0
 *
 * Where:
 * - x: Reserve of token X (e.g., YES tokens)
 * - y: Reserve of token Y (e.g., NO tokens)
 * - L: Liquidity parameter (controls market depth)
 * - T: Expiration time
 * - t: Current time
 * - Φ: Standard normal CDF
 * - φ: Standard normal PDF
 *
 * @param x - Reserve of token X
 * @param y - Reserve of token Y
 * @param L - Liquidity parameter
 * @param T - Expiration time
 * @param t - Current time
 * @returns Invariant value (should equal 0 when reserves are balanced)
 */
export function dynamicPmAmmInvariant(
  x: number,
  y: number,
  L: number,
  T: number,
  t: number,
): number {
  const timeToExpiry = T - t;

  if (timeToExpiry <= 0) {
    return y - x - y; // Returns -x, forcing settlement
  }

  if (L <= 0) {
    throw new Error("Liquidity parameter L must be positive");
  }

  const sqrtTimeToExpiry = Math.sqrt(timeToExpiry);
  const scaledDiff = (y - x) / (L * sqrtTimeToExpiry);

  const term1 = (y - x) * standardNormalCDF(scaledDiff);
  const term2 = L * sqrtTimeToExpiry * standardNormalPDF(scaledDiff);
  const term3 = y;

  return term1 + term2 - term3;
}

/**
 * Check if reserves satisfy the dynamic pm-AMM invariant
 * @param x - Reserve of token X
 * @param y - Reserve of token Y
 * @param L - Liquidity parameter
 * @param T - Expiration time
 * @param t - Current time
 * @param tolerance - Numerical tolerance for equality check (default 1e-10)
 * @returns True if invariant is satisfied (equals zero within tolerance)
 */
export function checkDynamicPmAmmInvariant(
  x: number,
  y: number,
  L: number,
  T: number,
  t: number,
  tolerance: number = 1e-10,
): boolean {
  const invariantValue = dynamicPmAmmInvariant(x, y, L, T, t);
  return Math.abs(invariantValue) < tolerance;
}

/**
 * Compute implied price from reserves in dynamic pm-AMM
 *
 * The marginal price for token X is derived from the ratio of partial derivatives.
 * For pm-AMM, the price of X (probability of YES) is approximately:
 *   P(X) = Φ((y - x)/(L√(T-t)))
 *
 * @param x - Reserve of token X
 * @param y - Reserve of token Y
 * @param L - Liquidity parameter
 * @param T - Expiration time
 * @param t - Current time
 * @returns Implied probability/price of token X (0 to 1)
 */
export function dynamicPmAmmPrice(
  x: number,
  y: number,
  L: number,
  T: number,
  t: number,
): number {
  const timeToExpiry = T - t;

  if (timeToExpiry <= 0) {
    return y > x ? 1 : 0;
  }

  if (L <= 0) {
    throw new Error("Liquidity parameter L must be positive");
  }

  const sqrtTimeToExpiry = Math.sqrt(timeToExpiry);
  const scaledDiff = (y - x) / (L * sqrtTimeToExpiry);

  return standardNormalCDF(scaledDiff);
}

/**
 * Compute effective liquidity at current time
 *
 * The dynamic pm-AMM reduces liquidity as expiration approaches
 * to maintain constant expected LVR. Effective liquidity is L√(T-t).
 *
 * @param L - Base liquidity parameter
 * @param T - Expiration time
 * @param t - Current time
 * @returns Effective liquidity (approaches 0 as t → T)
 */
export function effectiveLiquidity(L: number, T: number, t: number): number {
  const timeToExpiry = T - t;

  if (timeToExpiry <= 0) {
    return 0;
  }

  return L * Math.sqrt(timeToExpiry);
}
