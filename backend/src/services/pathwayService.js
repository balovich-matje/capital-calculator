import {
    calculateCompoundReturn,
    calculateInflationAdjustedReturn,
    calculateYearlyReturns
} from '../../../shared/calculations.js';
import { getAverageInflation } from './inflationService.js';

const pathwayDefinitions = [
    { key: 'bank-deposit', label: 'Bank deposit', risk: 'low' },
    { key: 'index-funds', label: 'Index funds', risk: 'medium' },
    { key: 'individual-stocks', label: 'Individual stocks', risk: 'high' },
    { key: 'crypto', label: 'Crypto', risk: 'high' },
    { key: 'precious-metals', label: 'Precious metals', risk: 'medium' }
];

const annualReturnByCountry = {
    usa: {
        'bank-deposit': 0.035,
        'index-funds': 0.08,
        'individual-stocks': 0.1,
        crypto: 0.15,
        'precious-metals': 0.05
    },
    germany: {
        'bank-deposit': 0.025,
        'index-funds': 0.075,
        'individual-stocks': 0.095,
        crypto: 0.14,
        'precious-metals': 0.045
    },
    russia: {
        'bank-deposit': 0.07,
        'index-funds': 0.11,
        'individual-stocks': 0.13,
        crypto: 0.2,
        'precious-metals': 0.065
    }
};

const historicalAnnualReturns = {
    'bank-deposit': {
        usa: [0.012, 0.015, 0.02, 0.018, 0.011, 0.008, 0.012, 0.021, 0.035, 0.045],
        germany: [0.004, 0.003, 0.004, 0.003, 0.002, 0.001, 0.002, 0.01, 0.025, 0.03],
        russia: [0.085, 0.09, 0.08, 0.075, 0.07, 0.065, 0.06, 0.055, 0.07, 0.08]
    },
    'index-funds': {
        usa: [0.287, 0.109, -0.043, 0.314, 0.181, 0.287, 0.163, 0.269, -0.194, 0.242],
        germany: [0.031, 0.123, -0.186, 0.271, 0.097, 0.255, 0.035, 0.158, -0.123, 0.203],
        russia: [0.263, -0.057, 0.094, 0.255, 0.286, 0.074, 0.122, 0.081, -0.433, 0.446]
    },
    'individual-stocks': {
        usa: [0.148, 0.122, 0.213, 0.177, 0.194, 0.231, 0.167, 0.209, -0.176, 0.284],
        germany: [0.112, 0.096, 0.164, 0.141, 0.122, 0.151, 0.083, 0.135, -0.197, 0.224],
        russia: [0.217, 0.184, 0.158, 0.241, 0.207, 0.132, 0.119, 0.176, -0.318, 0.302]
    },
    crypto: {
        usa: [1.35, 0.34, -0.73, 0.92, 0.31, 0.67, -0.64, 3.02, -0.645, 1.56],
        germany: [1.35, 0.34, -0.73, 0.92, 0.31, 0.67, -0.64, 3.02, -0.645, 1.56],
        russia: [1.35, 0.34, -0.73, 0.92, 0.31, 0.67, -0.64, 3.02, -0.645, 1.56]
    },
    'precious-metals': {
        usa: [0.089, -0.118, 0.006, 0.136, -0.009, 0.182, 0.251, -0.037, 0.002, 0.129],
        germany: [0.089, -0.118, 0.006, 0.136, -0.009, 0.182, 0.251, -0.037, 0.002, 0.129],
        russia: [0.089, -0.118, 0.006, 0.136, -0.009, 0.182, 0.251, -0.037, 0.002, 0.129]
    }
};

const buildHistoricalSeries = ({ startingCapital, years, annualReturns }) => {
    const currentYear = new Date().getUTCFullYear();
    const selected = annualReturns.slice(-years);
    let value = startingCapital;

    return selected.map((annualReturn, index) => {
        value *= 1 + annualReturn;

        return {
            year: currentYear - selected.length + index + 1,
            value: Number(value.toFixed(2)),
            annualReturnPct: Number((annualReturn * 100).toFixed(2))
        };
    });
};

const averageAnnualRate = (annualReturns) => {
    if (!annualReturns.length) {
        return 0;
    }

    const total = annualReturns.reduce((sum, value) => sum + value, 0);
    return total / annualReturns.length;
};

const validateInputs = ({ startingCapital, years }) => {
    if (!Number.isFinite(startingCapital) || startingCapital <= 0) {
        throw new Error('capital must be a positive number');
    }

    if (!Number.isInteger(years) || years <= 0) {
        throw new Error('years must be a positive integer');
    }
};

export const buildPathwayResults = ({ countryCode, startingCapital, years, inflationSeries }) => {
    validateInputs({ startingCapital, years });

    const normalizedCountry = countryCode.toLowerCase();
    const countryReturns = annualReturnByCountry[normalizedCountry] || annualReturnByCountry.usa;
    const averageInflationRate = getAverageInflation(inflationSeries) / 100;

    return pathwayDefinitions.map((pathway) => {
        const historicalRates = historicalAnnualReturns[pathway.key]?.[normalizedCountry]
            || historicalAnnualReturns[pathway.key]?.usa
            || [];
        const selectedHistoricalRates = historicalRates.slice(-years);
        const annualRate = selectedHistoricalRates.length
            ? averageAnnualRate(selectedHistoricalRates)
            : countryReturns[pathway.key];
        const compound = calculateCompoundReturn({
            startingCapital,
            annualRate,
            years,
            periodsPerYear: 1
        });

        const inflationAdjusted = calculateInflationAdjustedReturn({
            nominalFinalValue: compound.finalValue,
            annualInflationRate: averageInflationRate,
            years
        });

        return {
            id: pathway.key,
            name: pathway.label,
            riskLevel: pathway.risk,
            annualReturnRatePct: Number((annualRate * 100).toFixed(2)),
            totalReturn: {
                finalValue: compound.finalValue,
                profit: compound.totalProfit
            },
            inflationAdjustedReturn: {
                finalValue: inflationAdjusted.realFinalValue,
                adjustmentDelta: inflationAdjusted.realProfit
            },
            history: buildHistoricalSeries({
                startingCapital,
                years,
                annualReturns: historicalRates.length ? historicalRates : [annualRate]
            }),
            yearlyReturns: calculateYearlyReturns({
                startingCapital,
                annualRate,
                years
            })
        };
    });
};
