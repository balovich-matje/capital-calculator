import { runQuery } from '../backend/src/db/client.js';
import { ensureCountry, ensureIndex } from './lib/dbUpserts.js';

const indexSeed = [
    {
        symbol: 'SPX',
        name: 'S&P 500',
        country: { code: 'usa', name: 'United States', currencyCode: 'USD' },
        returns: {
            2019: 28.9,
            2020: 16.3,
            2021: 26.9,
            2022: -19.4,
            2023: 24.2
        }
    },
    {
        symbol: 'DAX',
        name: 'DAX 40',
        country: { code: 'germany', name: 'Germany', currencyCode: 'EUR' },
        returns: {
            2019: 25.5,
            2020: 3.5,
            2021: 15.8,
            2022: -12.3,
            2023: 20.3
        }
    }
];

const upsertIndexReturns = async ({ indexId, returns, source }) => {
    const years = Object.keys(returns);

    for (const year of years) {
        await runQuery(
            `
        INSERT INTO index_returns (index_id, year, annual_return_pct, source)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (index_id, year)
        DO UPDATE SET
          annual_return_pct = EXCLUDED.annual_return_pct,
          source = EXCLUDED.source,
          updated_at = NOW()
      `,
            [indexId, Number(year), Number(returns[year]), source]
        );
    }
};

export const updateIndexes = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required for updateIndexes');
    }

    for (const item of indexSeed) {
        const countryId = await ensureCountry(item.country);
        const indexId = await ensureIndex({ symbol: item.symbol, name: item.name, countryId });

        await upsertIndexReturns({
            indexId,
            returns: item.returns,
            source: 'seed-manual'
        });

        console.log(`Updated index returns for ${item.symbol}`);
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    updateIndexes()
        .then(() => {
            console.log('Index update complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Index update failed:', error.message);
            process.exit(1);
        });
}
