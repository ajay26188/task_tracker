import connectDB from './config/db';
import { PORT } from './config/env';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';

import organizationRouter from './routes/organizations';
import userRouter from './routes/users';
import loginRouter from './routes/logins';
import { tokenExtractor } from './middlewares/auth';

const app = express();

connectDB();

app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.use(tokenExtractor);

app.use('/api/organization', organizationRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

