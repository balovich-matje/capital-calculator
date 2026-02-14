const API_BASE_URL = 'http://localhost:3001/api';

export const fetchPathways = async ({ capital, years, country }) => {
    const params = new URLSearchParams({
        capital: String(capital),
        years: String(years),
        country
    });

    const response = await fetch(`${API_BASE_URL}/pathways?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch pathways: ${response.status}`);
    }

    return response.json();
};

export const fetchCompanyPriceHistory = async ({ ticker, startDate, endDate }) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    const query = params.toString();
    const url = `${API_BASE_URL}/companies/${encodeURIComponent(ticker)}/prices${query ? `?${query}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch company prices: ${response.status}`);
    }

    return response.json();
};

export const fetchInflationByCountry = async ({ country, startYear, endYear }) => {
    const params = new URLSearchParams();
    if (startYear) params.set('startYear', String(startYear));
    if (endYear) params.set('endYear', String(endYear));

    const query = params.toString();
    const url = `${API_BASE_URL}/inflation/${encodeURIComponent(country)}${query ? `?${query}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch inflation: ${response.status}`);
    }

    return response.json();
};
