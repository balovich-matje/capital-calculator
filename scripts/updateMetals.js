import { runQuery } from '../backend/src/db/client.js';
import { ensureMetal } from './lib/dbUpserts.js';

const metalSeed = [
    {
        code: 'gold',
        name: 'Gold',
        prices: {
            '2021-12-31': 1828.6,
            '2022-12-30': 1814.1,
            '2023-12-29': 2062.2,
            '2024-12-31': 2120.4
        }
    },
    {
        code: 'silver',
        name: 'Silver',
        prices: {
            '2021-12-31': 23.3,
            '2022-12-30': 24.0,
            '2023-12-29': 23.8,
            '2024-12-31': 27.1
        }
    },
    {
        code: 'platinum',
        name: 'Platinum',
        prices: {
            '2021-12-31': 965.2,
            '2022-12-30': 1072.4,
            '2023-12-29': 1012.6,
            '2024-12-31': 1093.8
        }
    }
];

const upsertMetalPrices = async ({ metalId, prices, source }) => {
    for (const [date, price] of Object.entries(prices)) {
        await runQuery(
            `
        INSERT INTO metal_prices (metal_id, price_date, price_per_ounce_usd, source)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (metal_id, price_date)
        DO UPDATE SET
          price_per_ounce_usd = EXCLUDED.price_per_ounce_usd,
          source = EXCLUDED.source
      `,
            [metalId, date, Number(price), source]
        );
    }
};

export const updateMetals = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required for updateMetals');
    }

    for (const metal of metalSeed) {
        const metalId = await ensureMetal({ code: metal.code, name: metal.name });
        await upsertMetalPrices({ metalId, prices: metal.prices, source: 'seed-manual' });
        console.log(`Updated metal prices for ${metal.code}`);
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    updateMetals()
        .then(() => {
            console.log('Metals update complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Metals update failed:', error.message);
            process.exit(1);
        });
}
