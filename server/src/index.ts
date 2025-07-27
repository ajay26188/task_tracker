import connectDB from './config/db';
import { PORT } from './config/env';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';

import organizationRouter from './routes/organizations';

const app = express();

connectDB();

app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.use('/api/organization', organizationRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

