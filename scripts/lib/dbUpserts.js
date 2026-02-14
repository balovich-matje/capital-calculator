import { runQuery } from '../../backend/src/db/client.js';

export const ensureCountry = async ({ code, name, currencyCode }) => {
    const result = await runQuery(
        `
      INSERT INTO countries (code, name, currency_code)
      VALUES ($1, $2, $3)
      ON CONFLICT (code)
      DO UPDATE SET name = EXCLUDED.name, currency_code = EXCLUDED.currency_code
      RETURNING id
    `,
        [code, name, currencyCode]
    );

    return result.rows[0].id;
};

export const ensureCompany = async ({ ticker, name, exchange, countryId }) => {
    const result = await runQuery(
        `
      INSERT INTO companies (ticker, name, exchange, country_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (ticker)
      DO UPDATE SET
        name = EXCLUDED.name,
        exchange = EXCLUDED.exchange,
        country_id = EXCLUDED.country_id,
        updated_at = NOW()
      RETURNING id
    `,
        [ticker, name, exchange, countryId]
    );

    return result.rows[0].id;
};

export const ensureIndex = async ({ symbol, name, countryId }) => {
    const result = await runQuery(
        `
      INSERT INTO indexes (symbol, name, country_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (symbol)
      DO UPDATE SET name = EXCLUDED.name, country_id = EXCLUDED.country_id
      RETURNING id
    `,
        [symbol, name, countryId]
    );

    return result.rows[0].id;
};

export const ensureMetal = async ({ code, name }) => {
    const result = await runQuery(
        `
      INSERT INTO metals (code, name)
      VALUES ($1, $2)
      ON CONFLICT (code)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `,
        [code, name]
    );

    return result.rows[0].id;
};
