import { Router } from 'express';
import { getMetalPriceHistory } from '../services/marketDataService.js';

export const metalsRouter = Router();

metalsRouter.get('/:metalCode/prices', async (req, res, next) => {
    try {
        const metalCode = String(req.params.metalCode || '').toLowerCase();

        if (!metalCode) {
            return res.status(400).json({ error: 'metalCode is required' });
        }

        const response = await getMetalPriceHistory({
            metalCode,
            startDate: req.query.startDate ? String(req.query.startDate) : null,
            endDate: req.query.endDate ? String(req.query.endDate) : null
        });

        return res.json(response);
    } catch (error) {
        return next(error);
    }
});
