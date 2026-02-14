import { Router } from 'express';
import { getIndexReturnHistory } from '../services/marketDataService.js';

export const indexesRouter = Router();

indexesRouter.get('/:symbol/returns', async (req, res, next) => {
    try {
        const symbol = String(req.params.symbol || '').trim();

        if (!symbol) {
            return res.status(400).json({ error: 'symbol is required' });
        }

        const startYear = req.query.startYear ? Number.parseInt(String(req.query.startYear), 10) : null;
        const endYear = req.query.endYear ? Number.parseInt(String(req.query.endYear), 10) : null;

        const response = await getIndexReturnHistory({ symbol, startYear, endYear });
        return res.json(response);
    } catch (error) {
        return next(error);
    }
});
