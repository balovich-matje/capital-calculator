import { runQuery } from '../db/client.js';

export const getCompanyPriceHistory = async ({ ticker, startDate, endDate }) => {
    if (!process.env.DATABASE_URL) {
        return {
            ticker,
            prices: [],
            source: 'stub',
            message: 'Set DATABASE_URL to query real company price history.'
        };
    }

    const query = `
    SELECT cp.price_date, cp.close_price
    FROM company_prices cp
    JOIN companies c ON c.id = cp.company_id
    WHERE c.ticker = $1
      AND ($2::date IS NULL OR cp.price_date >= $2::date)
      AND ($3::date IS NULL OR cp.price_date <= $3::date)
    ORDER BY cp.price_date ASC
  `;

    const result = await runQuery(query, [ticker.toUpperCase(), startDate || null, endDate || null]);

    return {
        ticker: ticker.toUpperCase(),
        prices: result.rows.map((row) => ({
            date: row.price_date,
            close: Number(row.close_price)
        })),
        source: 'database'
    };
};

export const getIndexReturnHistory = async ({ symbol, startYear, endYear }) => {
    if (!process.env.DATABASE_URL) {
        return {
            symbol,
            returns: [],
            source: 'stub',
            message: 'Set DATABASE_URL to query real index return history.'
        };
    }

    const query = `
    SELECT ir.year, ir.annual_return_pct
    FROM index_returns ir
    JOIN indexes i ON i.id = ir.index_id
    WHERE i.symbol = $1
      AND ($2::int IS NULL OR ir.year >= $2::int)
      AND ($3::int IS NULL OR ir.year <= $3::int)
    ORDER BY ir.year ASC
  `;

    const result = await runQuery(query, [symbol.toUpperCase(), startYear || null, endYear || null]);

    return {
        symbol: symbol.toUpperCase(),
        returns: result.rows.map((row) => ({
            year: Number(row.year),
            annualReturnPct: Number(row.annual_return_pct)
        })),
        source: 'database'
    };
};

export const getMetalPriceHistory = async ({ metalCode, startDate, endDate }) => {
    if (!process.env.DATABASE_URL) {
        return {
            metalCode,
            prices: [],
            source: 'stub',
            message: 'Set DATABASE_URL to query real metal price history.'
        };
    }

    const query = `
    SELECT mp.price_date, mp.price_per_ounce_usd
    FROM metal_prices mp
    JOIN metals m ON m.id = mp.metal_id
    WHERE m.code = $1
      AND ($2::date IS NULL OR mp.price_date >= $2::date)
      AND ($3::date IS NULL OR mp.price_date <= $3::date)
    ORDER BY mp.price_date ASC
  `;

    const result = await runQuery(query, [metalCode.toLowerCase(), startDate || null, endDate || null]);

    return {
        metalCode: metalCode.toLowerCase(),
        prices: result.rows.map((row) => ({
            date: row.price_date,
            pricePerOunceUsd: Number(row.price_per_ounce_usd)
        })),
        source: 'database'
    };
};
