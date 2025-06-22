import React, { useState, useEffect } from "react";
import {
  FiMessageCircle,
  FiActivity,
  FiSettings,
  FiRefreshCw,
} from "react-icons/fi";
import { BsRobot, BsChatDots } from "react-icons/bs";
import chatbotService from "../../services/chatbotService";

const ChatbotManagement = () => {
  const [chatbotStatus, setChatbotStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTestingMsg, setIsTestingMsg] = useState(false);

  useEffect(() => {
    checkChatbotStatus();
  }, []);

  const checkChatbotStatus = async () => {
    try {
      setIsLoading(true);
      const response = await chatbotService.getStatus();
      setChatbotStatus(response);
    } catch (error) {
      console.error("Error checking chatbot status:", error);
      setChatbotStatus({
        success: false,
        status: "error",
        message: "Không thể kết nối với chatbot",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testChatbot = async () => {
    if (!testMessage.trim()) return;

    try {
      setIsTestingMsg(true);
      const response = await chatbotService.chat(testMessage);
      setTestResponse(response.message || "No response");
    } catch (error) {
      console.error("Error testing chatbot:", error);
      setTestResponse(
        "Lỗi: " + (error.message || "Không thể gửi tin nhắn test")
      );
    } finally {
      setIsTestingMsg(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BsRobot className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Chatbot AI
          </h1>
        </div>
        <button
          onClick={checkChatbotStatus}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Trạng thái</h2>
            <FiActivity className="text-xl text-gray-400" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <FiRefreshCw className="animate-spin text-2xl text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    chatbotStatus?.success
                      ? getStatusColor(chatbotStatus.status)
                      : getStatusColor("error")
                  }`}
                >
                  {chatbotStatus?.success
                    ? chatbotStatus.status === "active"
                      ? "Hoạt động"
                      : "Lỗi"
                    : "Ngưng hoạt động"}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {chatbotStatus?.message || "Không có thông tin"}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-gray-500">Hoạt động</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">AI</p>
                  <p className="text-sm text-gray-500">Powered</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Chatbot Card */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Chatbot
            </h2>
            <BsChatDots className="text-xl text-gray-400" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tin nhắn test
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Ví dụ: Tôi muốn mua điện thoại iPhone"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && testChatbot()}
                />
                <button
                  onClick={testChatbot}
                  disabled={!testMessage.trim() || isTestingMsg}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isTestingMsg ? "Đang test..." : "Gửi"}
                </button>
              </div>
            </div>

            {testResponse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phản hồi từ AI
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {testResponse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tính năng Chatbot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiMessageCircle />
            </div>
            <h3 className="font-medium text-gray-900">Tư vấn sản phẩm</h3>
            <p className="text-sm text-gray-500 mt-1">
              AI hiểu và gợi ý sản phẩm phù hợp với nhu cầu khách hàng
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BsRobot />
            </div>
            <h3 className="font-medium text-gray-900">Trả lời tự động</h3>
            <p className="text-sm text-gray-500 mt-1">
              Phản hồi nhanh chóng các câu hỏi về sản phẩm và chính sách
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiSettings />
            </div>
            <h3 className="font-medium text-gray-900">Tìm kiếm thông minh</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tìm kiếm sản phẩm dựa trên mô tả và đặc điểm
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiActivity />
            </div>
            <h3 className="font-medium text-gray-900">Hỗ trợ 24/7</h3>
            <p className="text-sm text-gray-500 mt-1">
              Luôn sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Lưu ý cấu hình</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Cần có OpenRouter API key để chatbot hoạt động</li>
          <li>• AI được train với dữ liệu sản phẩm realtime từ database</li>
          <li>• Chatbot tự động gợi ý sản phẩm dựa trên ngữ cảnh</li>
          <li>• Hỗ trợ tìm kiếm bằng tiếng Việt tự nhiên</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatbotManagement;
