import {
  probPriceBelowInMinutes,
  probPriceAboveInMinutes,
  probPriceGBM,
} from "../functions/geometric_brownian_motion_shortterm_probability";

function example() {
  const current = 2304;
  const target = 2500;
  const minutes = 1400;
  const vol = 0.54; // 60% annualized (30D)

  console.log("=== Original parameters ===");
  console.log(
    `Current: $${current}, Target: $${target}, Time: ${minutes} min, Vol: ${vol * 100}%`,
  );

  // Show why results are extreme
  const MINUTES_PER_YEAR = 365 * 24 * 60;
  const timeInYears = minutes / MINUTES_PER_YEAR;
  const sigmaT = vol * Math.sqrt(timeInYears);
  const logMove = Math.log(target / current);
  console.log(`\nσ√T = ${(sigmaT * 100).toFixed(4)}% (30-min std dev)`);
  console.log(`Required log move = ${(logMove * 100).toFixed(4)}%`);
  console.log(
    `Z-score = ${(logMove / sigmaT).toFixed(2)} standard deviations\n`,
  );

  console.log("=== probPriceAboveInMinutes ===");
  const probAbove = probPriceAboveInMinutes(current, target, minutes, vol, 0);
  console.log(
    `Probability ≥ $${target} in ${minutes} min: ${(probAbove * 100).toFixed(6)}%`,
  );

  console.log("\n=== probPriceBelowInMinutes ===");
  const probBelow = probPriceBelowInMinutes(current, target, minutes, vol, 0);
  console.log(
    `Probability ≤ $${target} in ${minutes} min: ${(probBelow * 100).toFixed(6)}%`,
  );

  console.log("\n=== probPriceGBM (raw) ===");
  const probGBM = probPriceGBM(current, target, timeInYears, vol, 0);
  console.log(`P(S_T ≤ $${target}) = ${(probGBM * 100).toFixed(6)}%`);
}

example();
