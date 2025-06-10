import { useState, useEffect } from "react";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history từ localStorage khi hook được mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading search history:", error);
      setSearchHistory([]);
    }
  }, []);

  // Thêm query mới vào lịch sử
  const addToHistory = (query) => {
    if (!query || query.trim().length < 2) return;

    const trimmedQuery = query.trim();

    try {
      // Xóa query cũ nếu đã tồn tại (để đưa lên đầu)
      const filteredHistory = searchHistory.filter(
        (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
      );

      // Thêm query mới vào đầu danh sách
      const newHistory = [trimmedQuery, ...filteredHistory].slice(
        0,
        MAX_HISTORY_ITEMS
      );

      setSearchHistory(newHistory);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  // Xóa một item khỏi lịch sử
  const removeFromHistory = (query) => {
    try {
      const newHistory = searchHistory.filter(
        (item) => item.toLowerCase() !== query.toLowerCase()
      );
      setSearchHistory(newHistory);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error removing from search history:", error);
    }
  };

  // Xóa toàn bộ lịch sử
  const clearHistory = () => {
    try {
      setSearchHistory([]);
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
