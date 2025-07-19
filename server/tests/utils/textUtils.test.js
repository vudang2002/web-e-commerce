import {
  removeVietnameseTones,
  normalizeSearchQuery,
} from "../../src/utils/textUtils.js";

describe("Text Utils", () => {
  describe("removeVietnameseTones", () => {
    it("should remove Vietnamese tones", () => {
      expect(removeVietnameseTones("Tiếng Việt")).toBe("Tieng Viet");
      expect(removeVietnameseTones("Hà Nội")).toBe("Ha Noi");
      expect(removeVietnameseTones("Đà Nẵng")).toBe("Da Nang");
    });

    it("should handle empty input", () => {
      expect(removeVietnameseTones("")).toBe("");
      expect(removeVietnameseTones(null)).toBe("");
    });
  });

  describe("normalizeSearchQuery", () => {
    it("should normalize search query", () => {
      expect(normalizeSearchQuery("  Điện Thoại  ")).toBe("dien thoai");
      expect(normalizeSearchQuery("IPHONE 15")).toBe("iphone 15");
    });

    it("should handle empty input", () => {
      expect(normalizeSearchQuery("")).toBe("");
      expect(normalizeSearchQuery(null)).toBe("");
    });
  });
});
