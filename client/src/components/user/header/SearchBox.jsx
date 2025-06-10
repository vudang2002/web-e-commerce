import { FiSearch, FiClock, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSearchSuggestions,
  getPopularSearchTerms,
} from "../../../services/searchService";
import { AiOutlineStock } from "react-icons/ai";
import { useSearchHistory } from "../../../hooks/useSearchHistory";
import { IoPricetagOutline } from "react-icons/io5";
import { TbCategory } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [popularTerms, setPopularTerms] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Search history hook
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();

  // Load popular terms when component mounts
  useEffect(() => {
    const loadPopularTerms = async () => {
      try {
        const response = await getPopularSearchTerms(8);
        if (response.success) {
          setPopularTerms(response.data);
        }
      } catch (error) {
        console.error("Error loading popular terms:", error);
      }
    };

    loadPopularTerms();
  }, []);

  // Debounced search suggestions with abort controller
  useEffect(() => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        try {
          const response = await getSearchSuggestions(query, 8, {
            signal: abortControllerRef.current.signal,
          });

          // Only update state if this request wasn't aborted
          if (!abortControllerRef.current.signal.aborted) {
            if (response.success) {
              setSuggestions(response.data);
              setShowSuggestions(true);
            } else {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }
        } catch (error) {
          // Only log error if it's not an abort error
          if (
            error.name !== "AbortError" &&
            !abortControllerRef.current?.signal.aborted
          ) {
            console.error("Error getting suggestions:", error);
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } finally {
          // Only update loading state if request wasn't aborted
          if (!abortControllerRef.current?.signal.aborted) {
            setIsLoading(false);
          }
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }

    return () => {
      // Cleanup on unmount or query change
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (query.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (query.trim().length === 0) {
      // Hiển thị lịch sử tìm kiếm khi focus vào ô tìm kiếm rỗng
      setShowSuggestions(true);
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      // Lưu vào lịch sử tìm kiếm
      addToHistory(searchQuery.trim());
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0) {
      if (suggestions.length > 0) {
        // Navigate suggestion
        const selectedSuggestion = suggestions[selectedIndex];
        handleSearch(selectedSuggestion.value);
      } else if (query.trim().length === 0 && searchHistory.length > 0) {
        // Navigate search history
        const selectedHistory = searchHistory[selectedIndex];
        handleSearch(selectedHistory);
      }
    } else {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion.value);
  };

  const handleRemoveHistory = (e, historyItem) => {
    e.stopPropagation();
    removeFromHistory(historyItem);
  };

  const handleClearAllHistory = () => {
    clearHistory();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    // Calculate total navigable items
    const totalItems =
      suggestions.length > 0
        ? suggestions.length
        : query.trim().length === 0
        ? searchHistory.length
        : 0;

    if (totalItems === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case "brand":
        return <IoPricetagOutline size={20} />;
      case "category":
        return <TbCategory size={20} />;
      default:
        return <CiSearch size={20} />;
    }
  };

  return (
    <div className="relative flex w-full max-w-4xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative flex w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          <FiSearch size={20} />
        </span>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-grow pl-10 pr-4 py-2 rounded-l-lg border 
          border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
          placeholder-gray-400 text-sm bg-white"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark border border-l-0 border-primary 
          text-white px-6 rounded-r-lg text-sm font-medium transition-colors duration-200"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 
          rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-1"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <span className="mt-2 block">Đang tìm kiếm...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="p-2 text-xs text-gray-500 border-b bg-gray-50">
                Gợi ý tìm kiếm
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.value}`}
                  className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3 ${
                    selectedIndex === index ? "bg-primary/10" : ""
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="text-lg">
                    {getSuggestionIcon(suggestion.type)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.type === "brand"
                        ? "Thương hiệu"
                        : suggestion.type === "category"
                        ? "Danh mục"
                        : "Sản phẩm"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy gợi ý nào
            </div>
          ) : null}

          {/* Search History */}
          {query.trim().length === 0 && searchHistory.length > 0 && (
            <div>
              <div className="p-2 text-xs text-gray-500 border-b bg-gray-50 flex items-center justify-between">
                <span>Lịch sử tìm kiếm</span>
                <button
                  onClick={handleClearAllHistory}
                  className="text-primary hover:text-primary-dark text-xs"
                >
                  Xóa tất cả
                </button>
              </div>
              {searchHistory.map((historyItem, index) => (
                <div
                  key={`${historyItem}-${index}`}
                  className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3 group ${
                    selectedIndex === index && query.trim().length === 0
                      ? "bg-primary/10"
                      : ""
                  }`}
                  onClick={() => handleSearch(historyItem)}
                >
                  <FiClock className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="text-sm text-gray-700 flex-1">
                    {historyItem}
                  </div>
                  <button
                    onClick={(e) => handleRemoveHistory(e, historyItem)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-opacity"
                    title="Xóa khỏi lịch sử"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Popular Search Terms */}
          {query.trim().length === 0 &&
            searchHistory.length === 0 &&
            popularTerms.length > 0 && (
              <div>
                <div className="p-2 text-xs text-gray-500 border-b bg-gray-50">
                  Tìm kiếm phổ biến
                </div>
                {popularTerms.map((term) => (
                  <div
                    key={term}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    onClick={() => handleSearch(term)}
                  >
                    <span className="text-lg">
                      <AiOutlineStock size={20} />
                    </span>
                    <div className="text-sm text-gray-700">{term}</div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
