import { jest } from "@jest/globals";

// Mock console để không spam logs khi test
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.SUPPRESS_JEST_WARNINGS = "true";
