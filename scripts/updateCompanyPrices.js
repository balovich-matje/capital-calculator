import { runQuery } from '../backend/src/db/client.js';
import { ensureCompany, ensureCountry } from './lib/dbUpserts.js';
import { fetchText, withRetry } from './lib/http.js';

const companies = [
    { ticker: 'AAPL', stooqSymbol: 'aapl.us', name: 'Apple Inc.', exchange: 'NASDAQ', countryCode: 'usa' },
    { ticker: 'MSFT', stooqSymbol: 'msft.us', name: 'Microsoft Corp.', exchange: 'NASDAQ', countryCode: 'usa' },
    { ticker: 'SIE.DE', stooqSymbol: 'sie.de', name: 'Siemens AG', exchange: 'XETRA', countryCode: 'germany' }
];

const countryMeta = {
    usa: { name: 'United States', currencyCode: 'USD' },
    germany: { name: 'Germany', currencyCode: 'EUR' },
    russia: { name: 'Russia', currencyCode: 'RUB' }
};

const parseStooqCsv = (csvText) => {
    const lines = csvText.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    return lines.slice(1).map((line) => {
        const [date, open, high, low, close, volume] = line.split(',');
        return {
            date,
            open: Number(open),
            high: Number(high),
            low: Number(low),
            close: Number(close),
            volume: Number(volume)
        };
    }).filter((row) => row.date && Number.isFinite(row.close));
};

const upsertCompanyPrices = async ({ companyId, prices, source }) => {
    for (const row of prices) {
        await runQuery(
            `
        INSERT INTO company_prices (
          company_id, price_date, open_price, high_price, low_price, close_price, volume, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (company_id, price_date)
        DO UPDATE SET
          open_price = EXCLUDED.open_price,
          high_price = EXCLUDED.high_price,
          low_price = EXCLUDED.low_price,
          close_price = EXCLUDED.close_price,
          volume = EXCLUDED.volume,
          source = EXCLUDED.source
      `,
            [companyId, row.date, row.open, row.high, row.low, row.close, row.volume, source]
        );
    }
};

export const updateCompanyPrices = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required for updateCompanyPrices');
    }

    for (const company of companies) {
        const countryInfo = countryMeta[company.countryCode];
        const countryId = await ensureCountry({
            code: company.countryCode,
            name: countryInfo.name,
            currencyCode: countryInfo.currencyCode
        });

        const companyId = await ensureCompany({
            ticker: company.ticker,
            name: company.name,
            exchange: company.exchange,
            countryId
        });

        const csv = await withRetry(
            () => fetchText(`https://stooq.com/q/d/l/?s=${company.stooqSymbol}&i=d`),
            { retries: 2, delayMs: 750 }
        );

        const allRows = parseStooqCsv(csv);
        const recentRows = allRows.slice(-365 * 5);
        await upsertCompanyPrices({ companyId, prices: recentRows, source: 'stooq' });

        console.log(`Updated ${recentRows.length} daily rows for ${company.ticker}`);
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    updateCompanyPrices()
        .then(() => {
            console.log('Company price update complete');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Company price update failed:', error.message);
            process.exit(1);
        });
}
