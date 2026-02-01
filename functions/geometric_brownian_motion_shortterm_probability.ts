import { erf } from "mathjs";

/**
 * Core GBM probability calculation
 * @param currentPrice - Current price (S₀)
 * @param targetPrice - Target price threshold
 * @param timeInYears - Time horizon in years
 * @param annualVol - Annualized volatility (e.g. 0.60 for 60%)
 * @param annualDrift - Annualized expected log return (μ)
 * @returns Probability (0 to 1)
 */
export function probPriceGBM(
  currentPrice: number,
  targetPrice: number,
  timeInYears: number,
  annualVol: number,
  annualDrift: number = 0,
): number {
  if (timeInYears <= 0) return targetPrice >= currentPrice ? 1 : 0;
  if (annualVol <= 0) return targetPrice >= currentPrice ? 1 : 0;

  const driftAdjustment =
    (annualDrift - 0.5 * annualVol * annualVol) * timeInYears;
  const logMoneyness = Math.log(targetPrice / currentPrice);
  const numerator = logMoneyness - driftAdjustment;
  const denominator = annualVol * Math.sqrt(timeInYears);

  if (denominator === 0) {
    return targetPrice >= currentPrice ? 1 : 0;
  }

  const d = numerator / denominator;
  const cdf = (x: number): number => 0.5 * (1 + erf(x / Math.sqrt(2)));

  return cdf(d);
}

/**
 * P(price ≤ target) in minutes
 */
export function probPriceBelowInMinutes(
  currentPrice: number,
  targetPrice: number,
  minutes: number,
  annualVol: number,
  annualDrift: number = 0,
): number {
  const MINUTES_PER_YEAR = 365 * 24 * 60;
  return probPriceGBM(
    currentPrice,
    targetPrice,
    minutes / MINUTES_PER_YEAR,
    annualVol,
    annualDrift,
  );
}

/**
 * P(price ≥ target) in minutes
 */
export function probPriceAboveInMinutes(
  currentPrice: number,
  targetPrice: number,
  minutes: number,
  annualVol: number,
  annualDrift: number = 0,
): number {
  const MINUTES_PER_YEAR = 365 * 24 * 60;
  return (
    1 -
    probPriceGBM(
      currentPrice,
      targetPrice,
      minutes / MINUTES_PER_YEAR,
      annualVol,
      annualDrift,
    )
  );
}
