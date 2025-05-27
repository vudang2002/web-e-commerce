import { QueryClient } from "react-query";

// Tạo một instance của QueryClient với cấu hình mặc định
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Không refetch khi focus lại vào cửa sổ
      retry: 1, // Thử lại 1 lần nếu có lỗi
      staleTime: 5 * 60 * 1000, // Dữ liệu được coi là "cũ" sau 5 phút
    },
  },
});
