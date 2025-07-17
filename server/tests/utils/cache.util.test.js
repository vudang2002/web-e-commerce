import cache from "../../src/utils/cache.util.js";

describe("Cache Utils", () => {
  beforeEach(() => {
    cache.flushAll();
  });

  describe("cache operations", () => {
    it("should set and get cache value", () => {
      const key = "test-key";
      const value = { data: "test" };

      cache.set(key, value);
      const result = cache.get(key);

      expect(result).toEqual(value);
    });

    it("should return undefined for non-existent key", () => {
      const result = cache.get("non-existent-key");

      expect(result).toBeUndefined();
    });

    it("should delete cache value", () => {
      const key = "test-key";
      const value = { data: "test" };

      cache.set(key, value);
      cache.del(key);

      const result = cache.get(key);
      expect(result).toBeUndefined();
    });
  });
});
