import express from 'express';
import cors from 'cors';
import { pricesRouter } from './routes/pricesRoutes.js';
import { inflationRouter } from './routes/inflationRoutes.js';
import { indexesRouter } from './routes/indexesRoutes.js';
import { metalsRouter } from './routes/metalsRoutes.js';
import { pathwaysRouter } from './routes/pathwaysRoutes.js';

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'capital-calculator-api' });
});

app.use('/api/companies', pricesRouter);
app.use('/api/inflation', inflationRouter);
app.use('/api/indexes', indexesRouter);
app.use('/api/metals', metalsRouter);
app.use('/api/pathways', pathwaysRouter);

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Capital Calculator API listening on port ${PORT}`);
});
