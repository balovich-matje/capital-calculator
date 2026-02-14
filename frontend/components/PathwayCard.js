import { createHistoryChart } from './PathwayChart.js';

const riskClassByLevel = {
    low: 'risk-low',
    medium: 'risk-medium',
    high: 'risk-high'
};

export const createPathwayCard = ({ pathway, currencyCode = 'USD', labels, locale = 'en-US' }) => {
    const card = document.createElement('article');
    card.className = 'pathway-card';

    const formatNumber = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });

    const riskLevel = String(pathway.riskLevel || '').toLowerCase();
    const riskClass = riskClassByLevel[riskLevel] || 'risk-medium';

    card.innerHTML = `
    <div class="pathway-card-top">
      <h3 class="pathway-title">${labels[pathway.id] || pathway.name}</h3>
      <span class="risk-badge ${riskClass}">${labels[riskLevel] || pathway.riskLevel}</span>
    </div>
    <div class="metrics-grid">
      <div class="metric-item">
        <span class="metric-label">${labels.annualRate}</span>
        <span class="metric-value">${formatNumber.format(pathway.annualReturnRatePct)}%</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">${labels.totalReturn}</span>
        <span class="metric-value">${formatNumber.format(pathway.totalReturn.finalValue)} ${currencyCode}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">${labels.inflationAdjusted}</span>
        <span class="metric-value">${formatNumber.format(pathway.inflationAdjustedReturn.finalValue)} ${currencyCode}</span>
      </div>
    </div>
    <div class="history-head">${labels.history}</div>
  `;

    const chart = createHistoryChart({
        history: pathway.history || [],
        emptyLabel: labels.history
    });
    card.appendChild(chart);

    return card;
};
