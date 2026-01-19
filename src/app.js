import express from 'express';

import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { health } from './middlewares/health.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';

const app = express();

app.get('/health', health);

app.use(notFound);
app.use(errorHandler);

export default app;
