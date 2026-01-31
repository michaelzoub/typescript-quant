# typescript-quant

Quantitative finance utilities for crypto trading, built in TypeScript.

## Installation

\`\`\`bash
npm install mathjs
\`\`\`

## Features

### Price Movement Probabilities (GBM)

Calculate probabilities of price movements using Geometric Brownian Motion.

\`\`\`typescript
import { probPriceBelowInMinutes, probPriceAboveInMinutes } from './gbm';

// P(BTC ≤ $95k in next 60 minutes)
const probBelow = probPriceBelowInMinutes(
  100000,  // current price
  95000,   // target price
  60,      // minutes
  0.60,    // 60% annual volatility
  0.05     // 5% annual drift (optional)
);

// P(BTC ≥ $105k in next 60 minutes)
const probAbove = probPriceAboveInMinutes(
  100000,
  105000,
  60,
  0.60
);
\`\`\`

**Parameters:**
- \`currentPrice\`: Current asset price
- \`targetPrice\`: Price threshold
- \`minutes\`: Time horizon in minutes
- \`annualVol\`: Annualized volatility (0.60 = 60%)
- \`annualDrift\`: Expected annual log return (optional, default 0)

**Returns:** Probability from 0 to 1

## License

MIT

