import { probPriceBelowInMinutes } from "../functions/geometric_brownian_motion_shortterm_probability";

function example() {
  const current = 2403;
  const target = 2400;
  const minutes = 240; // 4 hours
  const vol = 0.6; // 60% annualized (30D)
  // const vol = 0.55;          // or 55% (90D/200D)

  const prob = probPriceBelowInMinutes(current, target, minutes, vol, 0);
  console.log(
    `Probability ≤ $${target} in ${minutes} min: ${(prob * 100).toFixed(2)}%`,
  );

  // With bullish drift (almost no difference in 4h)
  const probWithDrift = probPriceBelowInMinutes(
    current,
    target,
    minutes,
    vol,
    1.228,
  );
  console.log(`With μ=122.8%: ${(probWithDrift * 100).toFixed(2)}%`);
}

example();
