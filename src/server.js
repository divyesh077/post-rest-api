import http from 'http';

import app from './app.js';
import { connectToDB } from './config/db.js';
import { env } from './config/env.js';

const PORT = env.port || 3000;

export const bootstrap = async () => {
  try {
    // Connect DB
    await connectToDB();

    // Start the HTTP server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server is running on http:localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to bootstrap server:', error);
    process.exit(1);
  }
};
