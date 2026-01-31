import { erf } from "mathjs";

/**
 * Calculates the approximate probability that the asset price is at or below
 * a target price after exactly `minutes` have passed, under Geometric Brownian Motion.
 *
 * @param currentPrice - Current price (S₀)
 * @param targetPrice - The price threshold we're interested in (barrier)
 * @param minutes - Time horizon in minutes (1 to 1440 max recommended)
 * @param annualVol - Annualized volatility (e.g. 0.60 for 60%)
 * @param annualDrift - Annualized expected log return (μ). Use 0 for neutral/short-term.
 *                       Very high values like 1.228 have almost no effect in <24h.
 * @returns Probability (0 to 1) that price ≤ targetPrice at time t
 */
export function probPriceBelowInMinutes(
  currentPrice: number,
  targetPrice: number,
  minutes: number,
  annualVol: number,
  annualDrift: number = 0,
): number {
  if (minutes <= 0) return targetPrice >= currentPrice ? 1 : 0;
  if (annualVol <= 0) return targetPrice >= currentPrice ? 1 : 0;

  const MINUTES_PER_YEAR = 365 * 24 * 60;

  const time = minutes / MINUTES_PER_YEAR;

  const driftAdjustment = annualDrift - 0.5 * Math.sqrt(annualVol) * time;

  const logMoneyness = Math.log(targetPrice / currentPrice);

  const numerator = logMoneyness - driftAdjustment;
  const denominator = annualVol * Math.sqrt(time);

  if (denominator === 0) {
    return targetPrice >= currentPrice ? 1 : 0;
  }

  const d = numerator / denominator;

  const cdf = (x: number): number => 0.5 * (1 + erf(x / Math.sqrt(2)));

  return cdf(d);
}
