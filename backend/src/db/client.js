import pg from 'pg';

const { Pool } = pg;

let pool;

export const getDbPool = () => {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        });
    }

    return pool;
};

export const runQuery = async (text, params = []) => {
    const db = getDbPool();
    return db.query(text, params);
};
