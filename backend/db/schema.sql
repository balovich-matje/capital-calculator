CREATE TABLE IF NOT EXISTS countries (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  ticker VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  exchange VARCHAR(64),
  country_id BIGINT REFERENCES countries(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_prices (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  price_date DATE NOT NULL,
  open_price NUMERIC(14, 4),
  high_price NUMERIC(14, 4),
  low_price NUMERIC(14, 4),
  close_price NUMERIC(14, 4) NOT NULL,
  volume BIGINT,
  source VARCHAR(64) NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, price_date)
);

CREATE TABLE IF NOT EXISTS inflation_rates (
  id BIGSERIAL PRIMARY KEY,
  country_id BIGINT NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  year INT NOT NULL,
  inflation_pct NUMERIC(6, 3) NOT NULL,
  source VARCHAR(64) NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country_id, year)
);

CREATE TABLE IF NOT EXISTS indexes (
  id BIGSERIAL PRIMARY KEY,
  symbol VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  country_id BIGINT REFERENCES countries(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS index_returns (
  id BIGSERIAL PRIMARY KEY,
  index_id BIGINT NOT NULL REFERENCES indexes(id) ON DELETE CASCADE,
  year INT NOT NULL,
  annual_return_pct NUMERIC(7, 3) NOT NULL,
  source VARCHAR(64) NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (index_id, year)
);

CREATE TABLE IF NOT EXISTS metals (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metal_prices (
  id BIGSERIAL PRIMARY KEY,
  metal_id BIGINT NOT NULL REFERENCES metals(id) ON DELETE CASCADE,
  price_date DATE NOT NULL,
  price_per_ounce_usd NUMERIC(14, 4) NOT NULL,
  source VARCHAR(64) NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (metal_id, price_date)
);

CREATE INDEX IF NOT EXISTS idx_company_prices_company_date
  ON company_prices(company_id, price_date DESC);

CREATE INDEX IF NOT EXISTS idx_inflation_rates_country_year
  ON inflation_rates(country_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_index_returns_index_year
  ON index_returns(index_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_metal_prices_metal_date
  ON metal_prices(metal_id, price_date DESC);
