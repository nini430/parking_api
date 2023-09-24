import express from 'express';

import apiRouter from './routes/api'
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.use('/api/v1',apiRouter);

app.use(errorHandler);

export default app;
