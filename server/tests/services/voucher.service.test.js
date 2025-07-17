import {
  applyVoucher,
  getVoucherByCode,
  createVoucher,
} from "../../src/services/voucher.service.js";
import Voucher from "../../src/models/voucher.model.js";

jest.mock("../../src/models/voucher.model.js");

describe("Voucher Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getVoucherByCode", () => {
    it("should return voucher when found", async () => {
      const mockVoucher = {
        _id: "123",
        code: "SAVE20",
        isActive: true,
      };

      Voucher.findOne.mockResolvedValue(mockVoucher);

      const result = await getVoucherByCode("save20");

      expect(Voucher.findOne).toHaveBeenCalledWith({
        code: "SAVE20",
        isActive: true,
      });
      expect(result).toEqual(mockVoucher);
    });

    it("should return null when not found", async () => {
      Voucher.findOne.mockResolvedValue(null);

      const result = await getVoucherByCode("INVALID");

      expect(result).toBeNull();
    });
  });

  describe("applyVoucher", () => {
    it("should apply voucher successfully", async () => {
      const mockVoucher = {
        code: "SAVE20",
        minOrderValue: 100,
        isValid: jest.fn().mockReturnValue(true),
        calculateDiscount: jest.fn().mockReturnValue(50),
      };

      Voucher.findOne.mockResolvedValue(mockVoucher);

      const result = await applyVoucher("SAVE20", 200);

      expect(result).toEqual({
        voucher: mockVoucher,
        discountAmount: 50,
        finalAmount: 150,
      });
    });

    it("should throw error when voucher not found", async () => {
      Voucher.findOne.mockResolvedValue(null);

      await expect(applyVoucher("INVALID", 200)).rejects.toThrow(
        "Voucher not found"
      );
    });

    it("should throw error when order value too low", async () => {
      const mockVoucher = {
        minOrderValue: 100,
        isValid: jest.fn().mockReturnValue(true),
      };

      Voucher.findOne.mockResolvedValue(mockVoucher);

      await expect(applyVoucher("SAVE20", 50)).rejects.toThrow(
        "Minimum order value is 100"
      );
    });
  });

  describe("createVoucher", () => {
    it("should create voucher successfully", async () => {
      const voucherData = {
        code: "SAVE20",
        discountType: "percentage",
        amount: 20,
      };

      const mockVoucher = {
        ...voucherData,
        save: jest.fn().mockResolvedValue(voucherData),
      };

      Voucher.mockImplementation(() => mockVoucher);

      const result = await createVoucher(voucherData);

      expect(result).toEqual(voucherData);
    });
  });
});
