const startingCapitalInput = document.getElementById('amount');
const timePeriodInput = document.getElementById('time-period');
const countryInput = document.getElementById('country');
const amountCurrencySpan = document.querySelector('.amount-currency');
const form = document.getElementById('capital-form');

const resultDiv = document.getElementById('result');
const inflationUsdDiv = document.querySelector('.inflation-usd');
const inflationEurDiv = document.querySelector('.inflation-eur');
const inflationRubDiv = document.querySelector('.inflation-rub');

// 2015-2025 inflation data
const usdInflation = {
    2015: 0.7,
    2016: 2.1,
    2017: 2.1,
    2018: 1.9,
    2019: 2.3,
    2020: 1.4,
    2021: 7.0,
    2022: 6.5,
    2023: 3.4,
    2024: 2.9,
    2025: 2.7
}
const eurInflation = {
    2015: 0.2,
    2016: 1.1,
    2017: 1.4,
    2018: 1.5,
    2019: 1.3,
    2020: -0.3,
    2021: 5.0,
    2022: 9.2,
    2023: 2.9,
    2024: 2.4,
    2025: 1.9
}
const rubInflation = {
    2015: 12.9,
    2016: 5.4,
    2017: 2.5,
    2018: 4.3,
    2019: 3.0,
    2020: 4.9,
    2021: 8.4,
    2022: 11.9,
    2023: 7.4,
    2024: 9.5,
    2025: 5.6
}

const inflationRates = {};
const calculateAverage = (obj) => Object.values(obj).slice(-10).reduce((a, b) => a + b, 0) / 10;

inflationRates['USD'] = calculateAverage(usdInflation);
inflationRates['EUR'] = calculateAverage(eurInflation);
inflationRates['RUB'] = calculateAverage(rubInflation);

inflationEurDiv.textContent = `EUR: ${inflationRates['EUR'].toFixed(2)}%`;
inflationUsdDiv.textContent = `USD: ${inflationRates['USD'].toFixed(2)}%`;
inflationRubDiv.textContent = `RUB: ${inflationRates['RUB'].toFixed(2)}%`;

// 2015-2025 interest rates data
const usaInterestRates = {
    2015: 1.0,
    2016: 1.05,
    2017: 1.25,
    2018: 1.85,
    2019: 2.1,
    2020: 0.75,
    2021: 0.5,
    2022: 1.5,
    2023: 4.25,
    2024: 4.75,
    2025: 4.50
}
const germanyInterestRates = {
    2015: 0.35,
    2016: 0.25,
    2017: 0.18,
    2018: 0.15,
    2019: 0.1,
    2020: 0.02,
    2021: -0.07,
    2022: 0.35,
    2023: 1.95,
    2024: 2.15,
    2025: 1.81
}
const russiaInterestRates = {
    2015: 10.2,
    2016: 8.4,
    2017: 7.2,
    2018: 6.1,
    2019: 5.3,
    2020: 4.4,
    2021: 4.5,
    2022: 10.5,
    2023: 11.2,
    2024: 16.5,
    2025: 15.45
}
const interestRates = {};
interestRates['USD'] = calculateAverage(usaInterestRates);
interestRates['EUR'] = calculateAverage(germanyInterestRates);
interestRates['RUB'] = calculateAverage(russiaInterestRates);

const countryToCurrency = {
    us: 'USD',
    de: 'EUR',
    ru: 'RUB'
};

const updateAmountCurrency = () => {
    const currency = countryToCurrency[countryInput.value] || 'USD';
    amountCurrencySpan.textContent = currency;
};

countryInput.addEventListener('change', updateAmountCurrency);
updateAmountCurrency();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const startingCapital = parseFloat(startingCapitalInput.value);
    const timePeriod = parseInt(timePeriodInput.value);
    const country = countryInput.value;

    const currency = countryToCurrency[country] || 'USD';

    const inflationRate = inflationRates[currency] / 100;
    const interestRate = interestRates[currency] / 100;

    // Simple compound interest formula adjusted for inflation
    const finalValue = startingCapital * Math.pow((1 + interestRate - inflationRate), timePeriod);

    resultDiv.textContent = `Final value after ${timePeriod} years: ${finalValue.toFixed(2)} ${currency}`;
});