# Capital Calculator

Portfolio calculator with country-specific pathways and backend market/reference data support.

## Full app folder structure

```text
capital-calculator/
├── backend/
│   ├── db/
│   │   └── schema.sql
│   └── src/
│       ├── db/
│       │   └── client.js
│       ├── routes/
│       │   ├── inflationRoutes.js
│       │   ├── indexesRoutes.js
│       │   ├── metalsRoutes.js
│       │   ├── pathwaysRoutes.js
│       │   └── pricesRoutes.js
│       ├── services/
│       │   ├── inflationService.js
│       │   ├── marketDataService.js
│       │   └── pathwayService.js
│       └── server.js
├── docs/
│   ├── api.md
│   └── examples.md
├── frontend/
│   ├── components/
│   │   ├── PathwayCard.js
│   │   └── PathwayList.js
│   ├── pages/
│   │   └── calculatorPage.js
│   └── services/
│       └── apiClient.js
├── scripts/
│   ├── lib/
│   │   ├── dbUpserts.js
│   │   └── http.js
│   ├── runAllUpdates.js
│   ├── updateCompanyPrices.js
│   ├── updateIndexes.js
│   ├── updateInflation.js
│   └── updateMetals.js
├── shared/
│   └── calculations.js
├── data.js
├── index.html
├── script.js
├── styles.css
├── package.json
└── .env.example
```

## What is implemented

- Backend API endpoint skeletons:
	- `GET /health`
	- `GET /api/pathways?capital=&years=&country=`
	- `GET /api/companies/:ticker/prices`
	- `GET /api/inflation/:country`
	- `GET /api/indexes/:symbol/returns`
	- `GET /api/metals/:metalCode/prices`
- PostgreSQL schema for countries, companies, inflation, indexes, metals, and time-series tables.
- Core calculator functions:
	- CAGR
	- Yearly returns
	- Compound return
	- Inflation-adjusted return
- Async update scripts with idempotent upserts.
- Example vanilla frontend components for pathway cards and API integration.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Create schema in PostgreSQL:

```bash
psql "$DATABASE_URL" -f backend/db/schema.sql
```

4. Start API:

```bash
npm run dev
```

## Data update scripts

```bash
npm run update:companies
npm run update:inflation
npm run update:indexes
npm run update:metals
npm run update:all
```

## Additional docs

- API contracts: `docs/api.md`
- Usage examples: `docs/examples.md`