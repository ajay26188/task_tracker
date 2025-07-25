import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

app.get('/ping', (_req, res) => {
    res.send('pong');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

