import { generateToken, verifyToken } from "../../src/utils/jwt.util.js";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("JWT Utils", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    jest.clearAllMocks();
  });

  describe("generateToken", () => {
    it("should generate token with user data", () => {
      const user = { _id: "123", role: "user" };
      const mockToken = "mock-token";

      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user._id, role: user.role },
        "test-secret",
        { expiresIn: "1d" }
      );
      expect(result).toBe(mockToken);
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token", () => {
      const mockPayload = { id: "123", role: "user" };
      jwt.verify.mockReturnValue(mockPayload);

      const result = verifyToken("valid-token");

      expect(result).toEqual(mockPayload);
    });

    it("should throw error for invalid token", () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => verifyToken("invalid-token")).toThrow("Invalid token");
    });
  });
});
