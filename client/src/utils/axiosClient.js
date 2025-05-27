import axios from "axios";

const axiosClient = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api", // Sử dụng biến môi trường từ React
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Attach token to headers if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Kiểm tra nếu dữ liệu là FormData thì không thiết lập Content-Type
    // để axios tự động xác định đúng giá trị và boundary
    if (config.data instanceof FormData) {
      // Loại bỏ Content-Type để axios tự động thiết lập
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Return the data from the response
    return response.data;
  },
  (error) => {
    // Handle errors globally
    console.error("API Request Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Tạo một đối tượng response chuẩn hóa
    const errorResponse = {
      success: false,
      message: "Đã xảy ra lỗi khi kết nối đến máy chủ",
    }; // Handle specific HTTP status codes
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // Handle bad request errors
          errorResponse.message = "Dữ liệu gửi lên không hợp lệ";
          console.error("Bad request:", error.response.data);
          break;
        case 401:
          // Handle unauthorized errors
          errorResponse.message =
            "Không có quyền truy cập, vui lòng đăng nhập lại";
          console.error("Unauthorized, redirecting to login...");
          // You could add auto-redirect to login page here
          break;
        case 404:
          errorResponse.message = "Không tìm thấy tài nguyên được yêu cầu";
          console.error("Resource not found:", error.config?.url);
          break;
        case 500:
          errorResponse.message = "Lỗi máy chủ, vui lòng thử lại sau";
          console.error("Server error");
          break;
        default:
          errorResponse.message = `Lỗi với mã ${error.response.status}: ${
            error.response.data?.message || "Không xác định"
          }`;
          console.error(`Error with status code ${error.response.status}`);
      }

      // Sử dụng thông báo lỗi từ server nếu có
      if (error.response.data?.message) {
        errorResponse.message = error.response.data.message;
      }

      // Thêm dữ liệu lỗi nếu có
      if (error.response.data?.errors) {
        errorResponse.errors = error.response.data.errors;
      }
    }

    return Promise.resolve(errorResponse);
  }
);

export default axiosClient;
