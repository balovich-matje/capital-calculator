import { runQuery } from '../backend/src/db/client.js';
import { ensureCountry } from './lib/dbUpserts.js';
import { fetchJson, withRetry } from './lib/http.js';

const countries = [
    { code: 'usa', iso2: 'US', name: 'United States', currencyCode: 'USD' },
    { code: 'germany', iso2: 'DE', name: 'Germany', currencyCode: 'EUR' },
    { code: 'russia', iso2: 'RU', name: 'Russia', currencyCode: 'RUB' }
];

const fetchWorldBankInflation = async (iso2) => {
    const url = `https://api.worldbank.org/v2/country/${iso2}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=80`;
    const data = await withRetry(() => fetchJson(url), { retries: 2, delayMs: 1000 });

    if (!Array.isArray(data) || !Array.isArray(data[1])) {
        return [];
    }

    return data[1]
        .filter((item) => item && item.value !== null)
        .map((item) => ({
            year: Number(item.date),
            inflationPct: Number(item.value)
        }))
        .filter((item) => Number.isFinite(item.year) && Number.isFinite(item.inflationPct))
        .sort((a, b) => a.year - b.year);
};

const upsertInflation = async ({ countryId, values, source }) => {
    for (const row of values) {
        await runQuery(
            `
        INSERT INTO inflation_rates (country_id, year, inflation_pct, source)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (country_id, year)
        DO UPDATE SET
          inflation_pct = EXCLUDED.inflation_pct,
          source = EXCLUDED.source,
          updated_at = NOW()
      `,
            [countryId, row.year, row.inflationPct, source]
        );
    }
};

export const updateInflation = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required for updateInflation');
    }

    for (const country of countries) {
        const countryId = await ensureCountry({
            code: country.code,
            name: country.name,
            currencyCode: country.currencyCode
        });

        const inflationSeries = await fetchWorldBankInflation(country.iso2);
        await upsertInflation({ countryId, values: inflationSeries, source: 'world-bank' });

        console.log(`Updated ${inflationSeries.length} annual inflation rows for ${country.code}`);
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    updateInflation()
        .then(() => {
            console.log('Inflation update complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Inflation update failed:', error.message);
            process.exit(1);
        });
}
