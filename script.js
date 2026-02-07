import {
    usdInflation,
    eurInflation,
    rubInflation,
    usaInterestRates,
    germanyInterestRates,
    russiaInterestRates,
    goldGrowthRates,
    silverGrowthRates,
    platinumGrowthRates
} from './data.js';

const startingCapitalInput = document.getElementById('amount');
const timePeriodInput = document.getElementById('time-period');
const countryInput = document.getElementById('country');
const capitalizationPeriodInput = document.getElementById('capitalization-period');
const amountCurrencySpan = document.querySelector('.amount-currency');
const form = document.getElementById('capital-form');

const resultDiv = document.getElementById('result');
const inflationUsdDiv = document.querySelector('.inflation-usd');
const inflationEurDiv = document.querySelector('.inflation-eur');
const inflationRubDiv = document.querySelector('.inflation-rub');

// Bank deposit pathway elements
const bankDepositCard = document.querySelector('.pathways > div');
const bankDepositAnnualRate = bankDepositCard.querySelector('.pathway-capitalization');
const bankDepositCapitalization = bankDepositCard.querySelector('.pathway-capitalization-per-period');
const bankDepositProfit = bankDepositCard.querySelector('.pathway-profit');

const inflationRates = {};
const calculateAverage = (obj) => Object.values(obj).slice(-10).reduce((a, b) => a + b, 0) / 10;

inflationRates['USD'] = calculateAverage(usdInflation);
inflationRates['EUR'] = calculateAverage(eurInflation);
inflationRates['RUB'] = calculateAverage(rubInflation);

inflationEurDiv.textContent = `EUR: ${inflationRates['EUR'].toFixed(2)}%`;
inflationUsdDiv.textContent = `USD: ${inflationRates['USD'].toFixed(2)}%`;
inflationRubDiv.textContent = `RUB: ${inflationRates['RUB'].toFixed(2)}%`;

const interestRates = {};
interestRates['USD'] = calculateAverage(usaInterestRates);
interestRates['EUR'] = calculateAverage(germanyInterestRates);
interestRates['RUB'] = calculateAverage(russiaInterestRates);

const metalGrowthAverages = {
    gold: calculateAverage(goldGrowthRates),
    silver: calculateAverage(silverGrowthRates),
    platinum: calculateAverage(platinumGrowthRates)
};

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

// Update risk bar colors based on fill percentage
const updateRiskBarColors = () => {
    const riskIndicators = document.querySelectorAll('.risk-indicator');
    riskIndicators.forEach(indicator => {
        const width = parseFloat(indicator.style.width);
        let color;

        if (width <= 33) {
            color = '#22c55e'; // green
        } else if (width <= 66) {
            color = '#eab308'; // yellow
        } else {
            color = '#ef4444'; // red
        }

        indicator.style.backgroundColor = color;
    });
};

updateRiskBarColors();

const parseNumberWithPlaceholder = (input) => {
    const rawValue = input.value.trim();
    if (rawValue) {
        return parseFloat(rawValue.replace(/,/g, ''));
    }

    const rawPlaceholder = (input.placeholder || '').trim();
    return rawPlaceholder ? parseFloat(rawPlaceholder.replace(/,/g, '')) : 0;
};

const updateMetalsData = () => {
    const startingCapital = parseNumberWithPlaceholder(startingCapitalInput);
    const timePeriod = parseNumberWithPlaceholder(timePeriodInput);
    const currency = countryToCurrency[countryInput.value] || 'USD';

    const metalCards = document.querySelectorAll('.metal-card');
    metalCards.forEach(card => {
        const metalType = card.dataset.metal;
        const averageLine = card.querySelector('.pathway-capitalization');
        const profitLine = card.querySelector('.pathway-profit');
        const averageRate = metalGrowthAverages[metalType];

        if (!averageRate || startingCapital <= 0 || timePeriod <= 0) {
            averageLine.textContent = 'Average annual growth: --';
            profitLine.textContent = 'Total estimated profit: --';
            return;
        }

        averageLine.textContent = `Average annual growth: ${averageRate.toFixed(2)}%`;
        const annualRate = averageRate / 100;
        const finalValue = startingCapital * Math.pow((1 + annualRate), timePeriod);
        const profit = finalValue - startingCapital;

        profitLine.textContent = `Total estimated profit: ${profit.toFixed(2)} ${currency}`;
    });
};

// Function to calculate and update bank deposit based on inputs
const updateBankDepositData = () => {
    const startingCapital = parseNumberWithPlaceholder(startingCapitalInput);
    const timePeriod = parseNumberWithPlaceholder(timePeriodInput);
    const capitalizationPeriod = capitalizationPeriodInput.value;

    if (startingCapital <= 0 || timePeriod <= 0) {
        bankDepositAnnualRate.textContent = 'Annual capitalization: --';
        bankDepositCapitalization.textContent = 'Capitalization per period: --';
        bankDepositProfit.textContent = 'Total estimated profit: --';
        return;
    }

    // Get currency and corresponding interest rate
    const currency = countryToCurrency[countryInput.value] || 'USD';
    const annualRate = interestRates[currency] / 100;

    // Determine periods per year based on capitalization period
    let periodsPerYear;
    let periodLabel;

    switch (capitalizationPeriod) {
        case '1month':
            periodsPerYear = 12;
            periodLabel = 'monthly';
            break;
        case '3months':
            periodsPerYear = 4;
            periodLabel = 'quarterly';
            break;
        case '6months':
            periodsPerYear = 2;
            periodLabel = 'semi-annual';
            break;
        case '1year':
            periodsPerYear = 1;
            periodLabel = 'annual';
            break;
        default:
            periodsPerYear = 1;
            periodLabel = 'annual';
    }

    // Compound interest formula: A = P(1 + r/n)^(nt)
    const ratePerPeriod = annualRate / periodsPerYear;
    const totalPeriods = periodsPerYear * timePeriod;
    const finalValue = startingCapital * Math.pow((1 + ratePerPeriod), totalPeriods);
    const profit = finalValue - startingCapital;

    bankDepositAnnualRate.textContent = `Annual capitalization (${currency} average interest rate): ${(annualRate * 100).toFixed(2)}%`;
    bankDepositCapitalization.textContent = `Capitalization per period: ${(ratePerPeriod * 100).toFixed(3)}% (${periodLabel})`;
    bankDepositProfit.textContent = `Total estimated profit: ${profit.toFixed(2)} ${currency}`;
};

// Add event listeners to update data on input changes
startingCapitalInput.addEventListener('input', updateBankDepositData);
timePeriodInput.addEventListener('input', updateBankDepositData);
countryInput.addEventListener('change', updateBankDepositData);
capitalizationPeriodInput.addEventListener('change', updateBankDepositData);

startingCapitalInput.addEventListener('input', updateMetalsData);
timePeriodInput.addEventListener('input', updateMetalsData);
countryInput.addEventListener('change', updateMetalsData);

// Initial update
updateBankDepositData();
updateMetalsData();

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