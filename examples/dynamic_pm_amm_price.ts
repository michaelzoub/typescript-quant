import {
  dynamicPmAmmPrice,
  dynamicPmAmmInvariant,
  effectiveLiquidity,
} from "../functions/amm/dynamic_pm_amm_invariant";

function example() {
  // Parameters for a prediction market
  const L = 100; // Liquidity parameter
  const T = 1.0; // Expiration at t=1 (e.g., 1 year or normalized)

  console.log("=== Dynamic pm-AMM Price Examples ===\n");

  // Example 1: Equal reserves (50/50 market)
  console.log("--- Equal reserves (x=100, y=100) ---");
  let x = 100;
  let y = 100;
  let t = 0;
  let price = dynamicPmAmmPrice(x, y, L, T, t);
  console.log(`Reserves: x=${x}, y=${y}`);
  console.log(`Time to expiry: ${T - t}`);
  console.log(`Implied price (P(YES)): ${(price * 100).toFixed(2)}%`);
  console.log(
    `Invariant value: ${dynamicPmAmmInvariant(x, y, L, T, t).toFixed(6)}\n`,
  );

  // Example 2: More YES tokens sold (bullish sentiment)
  console.log("--- Bullish market (x=80, y=120) ---");
  x = 80;
  y = 120;
  t = 0;
  price = dynamicPmAmmPrice(x, y, L, T, t);
  console.log(`Reserves: x=${x}, y=${y}`);
  console.log(`Time to expiry: ${T - t}`);
  console.log(`Implied price (P(YES)): ${(price * 100).toFixed(2)}%`);
  console.log(
    `Invariant value: ${dynamicPmAmmInvariant(x, y, L, T, t).toFixed(6)}\n`,
  );

  // Example 3: More NO tokens sold (bearish sentiment)
  console.log("--- Bearish market (x=120, y=80) ---");
  x = 120;
  y = 80;
  t = 0;
  price = dynamicPmAmmPrice(x, y, L, T, t);
  console.log(`Reserves: x=${x}, y=${y}`);
  console.log(`Time to expiry: ${T - t}`);
  console.log(`Implied price (P(YES)): ${(price * 100).toFixed(2)}%`);
  console.log(
    `Invariant value: ${dynamicPmAmmInvariant(x, y, L, T, t).toFixed(6)}\n`,
  );

  // Example 4: Price sensitivity as expiration approaches
  console.log("--- Price sensitivity near expiration ---");
  x = 90;
  y = 110;
  const times = [0, 0.25, 0.5, 0.75, 0.9, 0.99];
  console.log(`Fixed reserves: x=${x}, y=${y}, L=${L}`);
  console.log("\nTime(t)  | Time-to-Expiry | Eff. Liquidity | Price");
  console.log("-".repeat(55));
  for (const currentTime of times) {
    const p = dynamicPmAmmPrice(x, y, L, T, currentTime);
    const effLiq = effectiveLiquidity(L, T, currentTime);
    console.log(
      `${currentTime.toFixed(2).padStart(7)} | ${(T - currentTime).toFixed(2).padStart(14)} | ${effLiq.toFixed(2).padStart(14)} | ${(p * 100).toFixed(2)}%`,
    );
  }
}

example();
