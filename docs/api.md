# Capital Calculator API (Skeleton)

Base URL: `http://localhost:3001`

## Health

### GET `/health`
Returns service status.

## Pathways

### GET `/api/pathways?capital=10000&years=10&country=usa`
Returns all investment pathways with risk, annual rate, total return, inflation-adjusted return, and yearly projection.

Response shape:

```json
{
  "input": { "country": "usa", "years": 10, "capital": 10000 },
  "inflationSource": "database",
  "pathways": [
    {
      "id": "bank-deposit",
      "name": "Bank deposit",
      "riskLevel": "low",
      "annualReturnRatePct": 3.5,
      "totalReturn": { "finalValue": 14106.84, "profit": 4106.84 },
      "inflationAdjustedReturn": { "finalValue": 11498.12, "adjustmentDelta": -2608.72 },
      "yearlyReturns": []
    }
  ]
}
```

## Company prices

### GET `/api/companies/:ticker/prices?startDate=2023-01-01&endDate=2024-12-31`
Returns historical daily close prices for a company ticker.

## Inflation

### GET `/api/inflation/:country?startYear=2015&endYear=2024`
Returns annual inflation series per country (`usa`, `germany`, `russia`).

## Index returns

### GET `/api/indexes/:symbol/returns?startYear=2018&endYear=2024`
Returns annual index return history.

## Metal prices

### GET `/api/metals/:metalCode/prices?startDate=2020-01-01&endDate=2024-12-31`
Returns metal price history (USD per ounce).

## Notes

- Endpoints return stub data when `DATABASE_URL` is missing.
- Update scripts populate PostgreSQL using idempotent upserts.
- Input validation is minimal skeleton-level and can be expanded with schema validation middleware.
