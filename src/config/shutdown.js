export const registerShutdown = ({ server, disconnectFromDB }) => {
  const shutdown = async (signal) => {
    console.log(`${signal}  received. shutting down...`);

    server.close(async () => {
      await disconnectFromDB();
      console.log('server shutdown complete');
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};
