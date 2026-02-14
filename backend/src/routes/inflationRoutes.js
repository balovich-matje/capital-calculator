import { Router } from 'express';
import { getInflationByCountry } from '../services/inflationService.js';

export const inflationRouter = Router();

inflationRouter.get('/:country', async (req, res, next) => {
    try {
        const countryCode = String(req.params.country || '').toLowerCase();

        if (!countryCode) {
            return res.status(400).json({ error: 'country is required' });
        }

        const startYear = req.query.startYear ? Number.parseInt(String(req.query.startYear), 10) : null;
        const endYear = req.query.endYear ? Number.parseInt(String(req.query.endYear), 10) : null;

        const response = await getInflationByCountry({ countryCode, startYear, endYear });
        return res.json(response);
    } catch (error) {
        return next(error);
    }
});
