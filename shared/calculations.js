// Computes compound annual growth rate for a period.
// CAGR = (final / initial)^(1 / years) - 1
export const calculateCAGR = ({ initialValue, finalValue, years }) => {
    if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
        return 0;
    }

    return Math.pow(finalValue / initialValue, 1 / years) - 1;
};

// Builds a year-by-year projection using annual compounding.
// Returns an array of yearly balances and yearly profit.
export const calculateYearlyReturns = ({ startingCapital, annualRate, years }) => {
    if (startingCapital <= 0 || years <= 0) {
        return [];
    }

    const yearly = [];
    let value = startingCapital;

    for (let year = 1; year <= years; year += 1) {
        const yearStart = value;
        const yearEnd = yearStart * (1 + annualRate);
        yearly.push({
            year,
            startValue: Number(yearStart.toFixed(2)),
            endValue: Number(yearEnd.toFixed(2)),
            profit: Number((yearEnd - yearStart).toFixed(2))
        });
        value = yearEnd;
    }

    return yearly;
};

// Calculates final and profit values with periodic compounding.
// Formula: A = P * (1 + r / n)^(n * t)
export const calculateCompoundReturn = ({ startingCapital, annualRate, years, periodsPerYear = 1 }) => {
    if (startingCapital <= 0 || years <= 0 || periodsPerYear <= 0) {
        return {
            finalValue: 0,
            totalProfit: 0
        };
    }

    const finalValue = startingCapital * Math.pow(1 + annualRate / periodsPerYear, periodsPerYear * years);
    const totalProfit = finalValue - startingCapital;

    return {
        finalValue: Number(finalValue.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2))
    };
};

// Converts nominal final value into real purchasing power using annual inflation.
// Real value = nominal / (1 + inflation)^years
export const calculateInflationAdjustedReturn = ({ nominalFinalValue, annualInflationRate, years }) => {
    if (nominalFinalValue <= 0 || years <= 0) {
        return {
            realFinalValue: 0,
            realProfit: 0
        };
    }

    const inflationFactor = Math.pow(1 + annualInflationRate, years);
    const realFinalValue = nominalFinalValue / inflationFactor;

    return {
        realFinalValue: Number(realFinalValue.toFixed(2)),
        realProfit: Number((realFinalValue - nominalFinalValue).toFixed(2))
    };
};
