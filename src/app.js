import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorConverter } from './middlewares/errorConverter.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { health } from './middlewares/health.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';
import v1Router from './routes/v1/index.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// HTTP Logger Middleware
app.use(morgan('dev'));

// Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', health);

app.use('/api/v1', v1Router);

// 404 + Error Handler
app.use(notFound);

app.use(errorConverter);
app.use(errorHandler);

export default app;
