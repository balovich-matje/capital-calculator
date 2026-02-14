import { Router } from 'express';
import { getInflationByCountry } from '../services/inflationService.js';
import { buildPathwayResults } from '../services/pathwayService.js';

export const pathwaysRouter = Router();

pathwaysRouter.get('/', async (req, res, next) => {
    try {
        const country = String(req.query.country || 'usa').toLowerCase();
        const years = Number.parseInt(String(req.query.years || '10'), 10);
        const capital = Number.parseFloat(String(req.query.capital || '10000'));

        const inflationData = await getInflationByCountry({ countryCode: country });
        const pathways = buildPathwayResults({
            countryCode: country,
            startingCapital: capital,
            years,
            inflationSeries: inflationData.inflation
        });

        res.json({
            input: { country, years, capital },
            inflationSource: inflationData.source,
            pathways
        });
    } catch (error) {
        if (error.message.includes('capital') || error.message.includes('years')) {
            return res.status(400).json({ error: error.message });
        }

        return next(error);
    }
});
