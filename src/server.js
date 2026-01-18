import http from 'http';

import app from './app.js';
import { env } from './config/env.js';

const PORT = env.port || 3000;

export const bootstrap = () => {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`);
  });
};
