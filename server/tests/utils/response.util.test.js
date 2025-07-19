import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../../src/utils/response.util.js";

describe("Response Utils", () => {
  beforeEach(() => {
    jest
      .spyOn(Date.prototype, "toISOString")
      .mockReturnValue("2024-01-01T00:00:00.000Z");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("successResponse", () => {
    it("should create success response", () => {
      const result = successResponse("Success", { id: 1 });

      expect(result).toEqual({
        success: true,
        message: "Success",
        timestamp: "2024-01-01T00:00:00.000Z",
        data: { id: 1 },
      });
    });
  });

  describe("errorResponse", () => {
    it("should create error response", () => {
      const result = errorResponse("Error occurred");

      expect(result).toEqual({
        success: false,
        message: "Error occurred",
        timestamp: "2024-01-01T00:00:00.000Z",
      });
    });
  });

  describe("paginatedResponse", () => {
    it("should create paginated response", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = paginatedResponse(data, 1, 10, 25);

      expect(result.data).toEqual(data);
      expect(result.meta.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false,
      });
    });
  });
});
