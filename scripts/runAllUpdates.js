import { updateCompanyPrices } from './updateCompanyPrices.js';
import { updateInflation } from './updateInflation.js';
import { updateIndexes } from './updateIndexes.js';
import { updateMetals } from './updateMetals.js';

const jobs = [
    { name: 'companies', run: updateCompanyPrices },
    { name: 'inflation', run: updateInflation },
    { name: 'indexes', run: updateIndexes },
    { name: 'metals', run: updateMetals }
];

export const runAllUpdates = async () => {
    for (const job of jobs) {
        const startedAt = Date.now();

        try {
            await job.run();
            const durationMs = Date.now() - startedAt;
            console.log(`Update job ${job.name} completed in ${durationMs}ms`);
        } catch (error) {
            console.error(`Update job ${job.name} failed:`, error.message);
        }
    }
};

if (import.meta.url === `file://${process.argv[1]}`) {
    runAllUpdates()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('runAllUpdates failed:', error.message);
            process.exit(1);
        });
}
