import express from 'express';

import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API running',
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
