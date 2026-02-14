import { fetchPathways } from '../services/apiClient.js';
import { renderPathwayList } from '../components/PathwayList.js';

const defaultCountryResolver = (value) => String(value || 'us').toLowerCase();

export const mountCalculatorPage = ({
    form,
    container,
    resolveCountry = defaultCountryResolver,
    getLabels = () => ({
        inputError: 'Please provide valid capital and years.',
        loading: 'Loading pathways...',
        requestError: 'Failed to load pathways',
        annualRate: 'Annual return rate',
        totalReturn: 'Total return',
        inflationAdjusted: 'Inflation-adjusted return',
        history: 'History',
        low: 'Low',
        medium: 'Medium',
        high: 'High'
    }),
    onSuccess,
    getLocale = () => 'en-US'
}) => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const capital = Number(form.elements.amount.value);
        const years = Number(form.elements['time-period'].value);
        const country = resolveCountry(form.elements.country.value);
        const labels = getLabels();

        if (!capital || !years) {
            container.textContent = labels.inputError;
            return;
        }

        container.textContent = labels.loading;

        try {
            const result = await fetchPathways({ capital, years, country });
            renderPathwayList({
                container,
                country,
                pathways: result.pathways,
                labels,
                locale: getLocale()
            });

            if (typeof onSuccess === 'function') {
                onSuccess(result);
            }
        } catch (error) {
            container.textContent = `${labels.requestError}: ${error.message}`;
        }
    });
};
