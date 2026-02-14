import { mountCalculatorPage } from './frontend/pages/calculatorPage.js';
import { fetchInflationByCountry } from './frontend/services/apiClient.js';
import { getInitialLanguage, setLanguage, t, getLocale } from './frontend/i18n/translate.js';

const countryUiToApi = {
    us: 'usa',
    de: 'germany',
    ru: 'russia'
};

const countryUiToCurrency = {
    us: 'USD',
    de: 'EUR',
    ru: 'RUB'
};

const THEME_KEY = 'capital-calculator-theme';

const getInitialTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
};

const applyLanguage = ({ lang, countryInput }) => {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        node.textContent = t(lang, key);
    });

    const countryOptions = countryInput.querySelectorAll('option[data-country]');
    countryOptions.forEach((option) => {
        option.textContent = t(lang, option.dataset.country);
    });
};

const updateAmountCurrency = ({ countryInput, amountCurrencySpan }) => {
    const currency = countryUiToCurrency[countryInput.value] || 'USD';
    amountCurrencySpan.textContent = currency;
};

const renderInflation = ({ countryCode, inflationRows, lang }) => {
    const average = inflationRows.length
        ? inflationRows.reduce((sum, row) => sum + Number(row.inflationPct), 0) / inflationRows.length
        : 0;

    const usdEl = document.querySelector('.inflation-usd');
    const eurEl = document.querySelector('.inflation-eur');
    const rubEl = document.querySelector('.inflation-rub');

    const rows = {
        us: '--',
        de: '--',
        ru: '--'
    };

    rows[countryCode] = `${average.toFixed(2)}%`;

    usdEl.textContent = `USD: ${rows.us}`;
    eurEl.textContent = `EUR: ${rows.de}`;
    rubEl.textContent = `RUB: ${rows.ru}`;

    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeToggle.textContent = currentTheme === 'dark' ? t(lang, 'switchToLight') : t(lang, 'switchToDark');
};

const loadCountryInflation = async ({ countryCode, lang }) => {
    const apiCountry = countryUiToApi[countryCode] || 'usa';
    const response = await fetchInflationByCountry({ country: apiCountry });
    renderInflation({ countryCode, inflationRows: response.inflation || [], lang });
};

const getPathwayLabels = (lang) => ({
    annualRate: t(lang, 'annualRate'),
    totalReturn: t(lang, 'totalReturn'),
    inflationAdjusted: t(lang, 'inflationAdjusted'),
    history: t(lang, 'history'),
    low: t(lang, 'low'),
    medium: t(lang, 'medium'),
    high: t(lang, 'high'),
    'bank-deposit': t(lang, 'bank-deposit'),
    'index-funds': t(lang, 'index-funds'),
    'individual-stocks': t(lang, 'individual-stocks'),
    crypto: t(lang, 'crypto'),
    'precious-metals': t(lang, 'precious-metals'),
    loading: t(lang, 'loading'),
    inputError: t(lang, 'inputError'),
    requestError: t(lang, 'requestError')
});

const init = () => {
    const form = document.getElementById('capital-form');
    const countryInput = document.getElementById('country');
    const amountCurrencySpan = document.querySelector('.amount-currency');
    const pathwaysContainer = document.getElementById('api-pathways');
    const languageSelect = document.getElementById('language-select');
    const themeToggle = document.getElementById('theme-toggle');

    if (!form || !countryInput || !amountCurrencySpan || !pathwaysContainer || !languageSelect || !themeToggle) {
        return;
    }

    let activeLanguage = getInitialLanguage();
    let activeTheme = getInitialTheme();

    languageSelect.value = activeLanguage;
    setTheme(activeTheme);
    applyLanguage({ lang: activeLanguage, countryInput });
    updateAmountCurrency({ countryInput, amountCurrencySpan });

    mountCalculatorPage({
        form,
        container: pathwaysContainer,
        resolveCountry: (uiCountryCode) => countryUiToApi[uiCountryCode] || 'usa',
        getLabels: () => getPathwayLabels(activeLanguage),
        getLocale: () => getLocale(activeLanguage),
        onSuccess: async () => {
            try {
                await loadCountryInflation({ countryCode: countryInput.value, lang: activeLanguage });
            } catch (_error) {
                renderInflation({ countryCode: countryInput.value, inflationRows: [], lang: activeLanguage });
            }
        }
    });

    languageSelect.addEventListener('change', async (event) => {
        activeLanguage = event.target.value;
        setLanguage(activeLanguage);
        applyLanguage({ lang: activeLanguage, countryInput });

        try {
            await loadCountryInflation({ countryCode: countryInput.value, lang: activeLanguage });
        } catch (_error) {
            renderInflation({ countryCode: countryInput.value, inflationRows: [], lang: activeLanguage });
        }

        form.requestSubmit();
    });

    countryInput.addEventListener('change', async () => {
        updateAmountCurrency({ countryInput, amountCurrencySpan });

        try {
            await loadCountryInflation({ countryCode: countryInput.value, lang: activeLanguage });
        } catch (_error) {
            renderInflation({ countryCode: countryInput.value, inflationRows: [], lang: activeLanguage });
        }
    });

    themeToggle.addEventListener('click', () => {
        activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(activeTheme);
        themeToggle.textContent = activeTheme === 'dark'
            ? t(activeLanguage, 'switchToLight')
            : t(activeLanguage, 'switchToDark');
    });

    form.requestSubmit();
};

init();
