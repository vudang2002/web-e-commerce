import { CustomError } from "../../src/utils/customError.util.js";

describe("CustomError Utils", () => {
  describe("CustomError", () => {
    it("should create custom error with message and status", () => {
      const error = new CustomError("Test error", 400);

      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe("CustomError");
      expect(error instanceof Error).toBe(true);
    });

    it("should use default status code 500", () => {
      const error = new CustomError("Test error");

      expect(error.statusCode).toBe(500);
    });
  });
});
