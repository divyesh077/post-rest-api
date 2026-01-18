import express from 'express';

import { notFound } from './middlewares/notFound.middleware.js';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API running',
  });
});

app.use(notFound);

export default app;
