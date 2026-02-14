import { createPathwayCard } from './PathwayCard.js';

const currencyByCountry = {
    us: 'USD',
    de: 'EUR',
    ru: 'RUB',
    usa: 'USD',
    germany: 'EUR',
    russia: 'RUB'
};

export const renderPathwayList = ({ container, country, pathways, labels, locale }) => {
    container.innerHTML = '';

    const currency = currencyByCountry[country] || 'USD';

    for (const pathway of pathways) {
        const card = createPathwayCard({
            pathway,
            currencyCode: currency,
            labels,
            locale
        });
        container.appendChild(card);
    }
};
