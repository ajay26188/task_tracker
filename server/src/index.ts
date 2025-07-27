import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import { PORT } from './config/env';
import express from 'express';
const app = express();

connectDB();

app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

