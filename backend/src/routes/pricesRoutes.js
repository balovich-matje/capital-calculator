import { Router } from 'express';
import { getCompanyPriceHistory } from '../services/marketDataService.js';

export const pricesRouter = Router();

pricesRouter.get('/:ticker/prices', async (req, res, next) => {
    try {
        const ticker = String(req.params.ticker || '').trim();

        if (!ticker) {
            return res.status(400).json({ error: 'ticker is required' });
        }

        const data = await getCompanyPriceHistory({
            ticker,
            startDate: req.query.startDate ? String(req.query.startDate) : null,
            endDate: req.query.endDate ? String(req.query.endDate) : null
        });

        return res.json(data);
    } catch (error) {
        return next(error);
    }
});
