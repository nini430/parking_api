import express from 'express';
import cors from 'cors'

import apiRouter from './routes/api'
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(cors())

app.use('/api/v1',apiRouter);

app.use(errorHandler);

export default app;
