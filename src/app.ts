import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import ticketsRouter from './routes/tickets.routes';

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()) }));

app.use(express.json());

app.use('/tickets', ticketsRouter);

app.use(notFoundHandler);
app.use(errorHandler);