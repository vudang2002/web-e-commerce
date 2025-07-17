import {
  createProduct,
  getProducts,
  getProductById,
} from "../../src/services/product.service.js";
import Product from "../../src/models/product.model.js";

jest.mock("../../src/models/product.model.js");

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createProduct", () => {
    it("should create product successfully", async () => {
      const productData = {
        name: "Test Product",
        price: 100,
        stock: 10,
      };

      const mockProduct = {
        ...productData,
        save: jest.fn().mockResolvedValue(productData),
      };

      Product.mockImplementation(() => mockProduct);

      const result = await createProduct(productData);

      expect(Product).toHaveBeenCalledWith(productData);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toEqual(productData);
    });

    it("should throw error for invalid data", async () => {
      await expect(createProduct(null)).rejects.toThrow(
        "Invalid product data provided"
      );
      await expect(createProduct({})).rejects.toThrow(
        "Invalid product data provided"
      );
    });
  });

  describe("getProducts", () => {
    it("should return paginated products", async () => {
      const mockProducts = [
        { _id: "1", name: "Product 1" },
        { _id: "2", name: "Product 2" },
      ];

      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockProducts),
            }),
          }),
        }),
      });

      Product.countDocuments.mockResolvedValue(10);

      const result = await getProducts({}, { page: 1, limit: 5 });

      expect(result).toEqual({
        products: mockProducts,
        total: 10,
        page: 1,
        limit: 5,
      });
    });
  });

  describe("getProductById", () => {
    it("should return product by id", async () => {
      const mockProduct = { _id: "123", name: "Test Product" };

      Product.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await getProductById("123");

      expect(Product.findById).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockProduct);
    });

    it("should return null when not found", async () => {
      Product.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await getProductById("123");

      expect(result).toBeNull();
    });
  });
});
