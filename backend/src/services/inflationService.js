import { runQuery } from '../db/client.js';

const countryFallback = {
    usa: [
        { year: 2021, inflationPct: 4.7 },
        { year: 2022, inflationPct: 8.0 },
        { year: 2023, inflationPct: 4.1 }
    ],
    germany: [
        { year: 2021, inflationPct: 3.1 },
        { year: 2022, inflationPct: 6.9 },
        { year: 2023, inflationPct: 5.9 }
    ],
    russia: [
        { year: 2021, inflationPct: 8.4 },
        { year: 2022, inflationPct: 13.8 },
        { year: 2023, inflationPct: 5.9 }
    ]
};

export const getInflationByCountry = async ({ countryCode, startYear, endYear }) => {
    const normalizedCountry = countryCode.toLowerCase();

    if (!process.env.DATABASE_URL) {
        const values = (countryFallback[normalizedCountry] || []).filter((item) => {
            if (startYear && item.year < startYear) return false;
            if (endYear && item.year > endYear) return false;
            return true;
        });

        return {
            countryCode: normalizedCountry,
            inflation: values,
            source: 'stub'
        };
    }

    const query = `
    SELECT i.year, i.inflation_pct
    FROM inflation_rates i
    JOIN countries c ON c.id = i.country_id
    WHERE c.code = $1
      AND ($2::int IS NULL OR i.year >= $2::int)
      AND ($3::int IS NULL OR i.year <= $3::int)
    ORDER BY i.year ASC
  `;

    const result = await runQuery(query, [normalizedCountry, startYear || null, endYear || null]);

    return {
        countryCode: normalizedCountry,
        inflation: result.rows.map((row) => ({
            year: Number(row.year),
            inflationPct: Number(row.inflation_pct)
        })),
        source: 'database'
    };
};

export const getAverageInflation = (values) => {
    if (!values.length) return 0;

    const total = values.reduce((sum, item) => sum + Number(item.inflationPct), 0);
    return total / values.length;
};
