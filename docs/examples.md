# Code Examples

## Fetch company price history

```js
import { fetchCompanyPriceHistory } from '../frontend/services/apiClient.js';

const data = await fetchCompanyPriceHistory({
  ticker: 'AAPL',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

console.log(data.prices);
```

## Fetch inflation data per country

```js
import { fetchInflationByCountry } from '../frontend/services/apiClient.js';

const inflation = await fetchInflationByCountry({
  country: 'germany',
  startYear: 2018,
  endYear: 2024
});

console.log(inflation.inflation);
```

## Calculate returns (CAGR, yearly, inflation-adjusted)

```js
import {
  calculateCAGR,
  calculateYearlyReturns,
  calculateCompoundReturn,
  calculateInflationAdjustedReturn
} from '../shared/calculations.js';

const startingCapital = 10000;
const annualRate = 0.08;
const years = 10;

const compound = calculateCompoundReturn({
  startingCapital,
  annualRate,
  years,
  periodsPerYear: 1
});

const cagr = calculateCAGR({
  initialValue: startingCapital,
  finalValue: compound.finalValue,
  years
});

const yearly = calculateYearlyReturns({
  startingCapital,
  annualRate,
  years
});

const real = calculateInflationAdjustedReturn({
  nominalFinalValue: compound.finalValue,
  annualInflationRate: 0.03,
  years
});

console.log({ cagr, yearly, nominal: compound, inflationAdjusted: real });
```

## Asynchronous update flow

```js
import { runAllUpdates } from '../scripts/runAllUpdates.js';

await runAllUpdates();
```

CLI usage:

```bash
npm run update:companies
npm run update:inflation
npm run update:indexes
npm run update:metals
npm run update:all
```
