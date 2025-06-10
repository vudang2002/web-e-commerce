// Utility functions for text processing

/**
 * Remove Vietnamese tones from text
 * @param {string} text - Text to remove tones from
 * @returns {string} - Text without tones
 */
export function removeVietnameseTones(text) {
  if (!text) return "";

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/**
 * Normalize search query
 * @param {string} query - Search query
 * @returns {string} - Normalized query
 */
export function normalizeSearchQuery(query) {
  if (!query) return "";

  return removeVietnameseTones(query.toLowerCase().trim());
}

/**
 * Highlight search terms in text
 * @param {string} text - Original text
 * @param {string} searchTerm - Term to highlight
 * @returns {string} - Text with highlighted terms
 */
export function highlightSearchTerm(text, searchTerm) {
  if (!text || !searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Generate search keywords from product data
 * @param {Object} product - Product object
 * @returns {Array} - Array of search keywords
 */
export function generateSearchKeywords(product) {
  const keywords = [];

  if (product.name) {
    keywords.push(product.name.toLowerCase());
    keywords.push(removeVietnameseTones(product.name.toLowerCase()));
  }

  if (product.brand) {
    keywords.push(product.brand.toLowerCase());
    keywords.push(removeVietnameseTones(product.brand.toLowerCase()));
  }

  if (product.category) {
    keywords.push(product.category.toLowerCase());
    keywords.push(removeVietnameseTones(product.category.toLowerCase()));
  }

  if (product.tags && Array.isArray(product.tags)) {
    product.tags.forEach((tag) => {
      keywords.push(tag.toLowerCase());
      keywords.push(removeVietnameseTones(tag.toLowerCase()));
    });
  }

  // Remove duplicates
  return [...new Set(keywords)];
}

/**
 * Calculate search relevance score
 * @param {Object} product - Product object
 * @param {string} query - Search query
 * @returns {number} - Relevance score
 */
export function calculateRelevanceScore(product, query) {
  if (!query) return 0;

  const normalizedQuery = normalizeSearchQuery(query);
  let score = 0;

  // Exact match in name (highest score)
  if (
    product.name &&
    product.name.toLowerCase().includes(query.toLowerCase())
  ) {
    score += 100;
  }

  // Normalized match in name
  if (
    product.normalizedName &&
    product.normalizedName.includes(normalizedQuery)
  ) {
    score += 80;
  }

  // Brand match
  if (
    product.brand &&
    product.brand.toLowerCase().includes(query.toLowerCase())
  ) {
    score += 60;
  }

  // Category match
  if (
    product.category &&
    product.category.toLowerCase().includes(query.toLowerCase())
  ) {
    score += 40;
  }

  // Tags match
  if (product.tags && Array.isArray(product.tags)) {
    product.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        score += 30;
      }
    });
  }

  // Description match
  if (
    product.description &&
    product.description.toLowerCase().includes(query.toLowerCase())
  ) {
    score += 20;
  }

  return score;
}
