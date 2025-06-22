import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend, FiLoader } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import chatbotService from "../../services/chatbotService";
import ProductSuggestion from "./ProductSuggestion";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI của cửa hàng. Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn mua hàng, và trả lời các câu hỏi về sản phẩm. Bạn cần hỗ trợ gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbox opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Chuẩn bị lịch sử hội thoại cho AI (bỏ id và timestamp)
    const conversationHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await chatbotService.chat(
      userMessage.content,
      conversationHistory
    );

    if (response?.success) {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.message || "Xin lỗi, tôi không thể trả lời lúc này.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Gợi ý sản phẩm nếu tin nhắn có từ khóa liên quan
      if (
        userMessage.content.toLowerCase().includes("sản phẩm") ||
        userMessage.content.toLowerCase().includes("mua") ||
        userMessage.content.toLowerCase().includes("tìm")
      ) {
        const productSuggestions = await chatbotService.suggestProducts(
          userMessage.content,
          3
        );
        if (
          productSuggestions?.success &&
          productSuggestions?.products?.length > 0
        ) {
          setSuggestedProducts(productSuggestions.products);
        }
      }
    } else {
      // Hiển thị lỗi từ response
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          response?.message ||
          "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearSuggestions = () => {
    setSuggestedProducts([]);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 group"
        aria-label="Mở chat"
      >
        <FiMessageCircle size={24} />
        <span className="absolute -top-12 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Cần hỗ trợ?
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full">
            <BsRobot className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="font-semibold">Trợ lý AI</h3>
            <p className="text-xs text-blue-100">Đang trực tuyến</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-blue-100 hover:text-white transition-colors"
          aria-label="Đóng chat"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : message.isError
                  ? "bg-red-100 text-red-800 rounded-bl-none border border-red-200"
                  : "bg-white text-gray-800 rounded-bl-none shadow-sm border"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm border flex items-center space-x-2">
              <FiLoader className="animate-spin" size={16} />
              <span className="text-sm text-gray-600">Đang suy nghĩ...</span>
            </div>
          </div>
        )}

        {/* Product suggestions */}
        {suggestedProducts.length > 0 && (
          <ProductSuggestion
            products={suggestedProducts}
            onClear={clearSuggestions}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ maxHeight: "80px" }}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-primary hover:bg-white disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            aria-label="Gửi tin nhắn"
          >
            <FiSend className="hover:text-primary" size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Nhấn Enter để gửi, Shift+Enter để xuống dòng
        </p>
      </div>
    </div>
  );
};

export default Chatbox;
