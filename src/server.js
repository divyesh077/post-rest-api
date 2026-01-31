import http from 'http';

import app from './app.js';
import { connectToDB, disconnectFromDB } from './config/db.js';
import { env } from './config/env.js';
import { registerShutdown } from './config/shutdown.js';
import { verifyMailServer } from './config/smtp.js';

const PORT = env.port || 3000;

export const bootstrap = async () => {
  try {
    // Connect DB
    await connectToDB();

    // Check the SMTP server
    await verifyMailServer();

    // Start the HTTP server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server is running on http:localhost:${PORT}`);
    });

    registerShutdown({ server, disconnectFromDB });
  } catch (error) {
    console.error('Failed to bootstrap server:', error);
    process.exit(1);
  }
};
