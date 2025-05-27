import express from "express";
import mongoose from "mongoose";
import { successResponse, errorResponse } from "../utils/response.util.js";
import { HTTP_STATUS } from "../constants/index.js";

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Application is healthy
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: healthy
 *                     timestamp:
 *                       type: string
 *                       example: 2023-12-01T10:00:00.000Z
 *                     uptime:
 *                       type: number
 *                       example: 3600
 *                     database:
 *                       type: string
 *                       example: connected
 *       503:
 *         description: Application is unhealthy
 */
router.get("/", async (req, res) => {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
      },
      database:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    };

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json(
        errorResponse("Application is unhealthy", null, {
          ...healthData,
          status: "unhealthy",
        })
      );
    }

    res.json(successResponse("Application is healthy", healthData));
  } catch (error) {
    res
      .status(HTTP_STATUS.SERVICE_UNAVAILABLE)
      .json(errorResponse("Health check failed", [{ message: error.message }]));
  }
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Detailed health check with dependency status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get("/detailed", async (req, res) => {
  try {
    const checks = {
      database: await checkDatabase(),
      memory: checkMemory(),
      disk: checkDisk(),
    };

    const isHealthy = Object.values(checks).every(
      (check) => check.status === "healthy"
    );
    const status = isHealthy ? "healthy" : "unhealthy";
    const statusCode = isHealthy
      ? HTTP_STATUS.OK
      : HTTP_STATUS.SERVICE_UNAVAILABLE;

    const healthData = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    };

    const response = isHealthy
      ? successResponse("Detailed health check passed", healthData)
      : errorResponse("Some health checks failed", null, healthData);

    res.status(statusCode).json(response);
  } catch (error) {
    res
      .status(HTTP_STATUS.SERVICE_UNAVAILABLE)
      .json(
        errorResponse("Detailed health check failed", [
          { message: error.message },
        ])
      );
  }
});

// Helper functions for health checks
async function checkDatabase() {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    if (state === 1) {
      // Test database with a simple query
      await mongoose.connection.db.admin().ping();
      return {
        status: "healthy",
        message: "Database connection is active",
        responseTime: Date.now(),
      };
    } else {
      return {
        status: "unhealthy",
        message: `Database is ${states[state]}`,
      };
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: `Database check failed: ${error.message}`,
    };
  }
}

function checkMemory() {
  const usage = process.memoryUsage();
  const usedMB = Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100;
  const totalMB = Math.round((usage.heapTotal / 1024 / 1024) * 100) / 100;
  const usagePercent = Math.round((usage.heapUsed / usage.heapTotal) * 100);

  return {
    status: usagePercent > 90 ? "unhealthy" : "healthy",
    message: `Memory usage: ${usedMB}MB / ${totalMB}MB (${usagePercent}%)`,
    details: {
      used: usedMB,
      total: totalMB,
      percentage: usagePercent,
    },
  };
}

function checkDisk() {
  // This is a simplified disk check
  // In production, you might want to use a library like 'node-disk-info'
  return {
    status: "healthy",
    message: "Disk space check not implemented",
  };
}

export default router;
