import app from "./src/app.js";
import config from "./src/config/env.config.js";
import logger from "./src/utils/logger.util.js";
import connectDB from "./src/config/db.config.js";

// Connect to database
connectDB();

// Start server
const server = app.listen(config.PORT, () => {
  logger.info(`🚀 Server is running on port ${config.PORT}`);
  logger.info(`🌍 Environment: ${config.NODE_ENV}`);
  logger.info(`📚 API Documentation: http://localhost:${config.PORT}/api-docs`);
  logger.info(`❤️  Health Check: http://localhost:${config.PORT}/api/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      logger.error("Error during server shutdown:", err);
      process.exit(1);
    }

    logger.info("Server closed successfully");
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after 30 seconds");
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default server;
