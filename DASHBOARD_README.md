# Hướng dẫn chạy Dashboard

## Bước 1: Chạy Server Backend

Trước khi xem dashboard, bạn cần chạy server backend:

```bash
cd server
npm start
# hoặc
npm run dev
```

Server sẽ chạy trên port 3001 (hoặc port đã cấu hình).

## Bước 2: Chạy Client Frontend

Sau khi server đã chạy, mở terminal mới và chạy client:

```bash
cd client
npm run dev
```

## Bước 3: Truy cập Dashboard

1. Mở trình duyệt và truy cập `http://localhost:5173` (hoặc port Vite hiển thị)
2. Đăng nhập với tài khoản admin
3. Truy cập `/admin/dashboard` để xem dashboard

## Tính năng Dashboard

- ✅ Tổng số đơn hàng
- ✅ Tổng doanh thu
- ✅ Tổng số khách hàng
- ✅ Tổng số sản phẩm
- ✅ Top sản phẩm bán chạy (mock data)
- ✅ Tổng quan KPI
- ✅ Quick actions
- ✅ Chế độ offline với dữ liệu mẫu khi server không khả dụng

## Lưu ý

- Dashboard sẽ hiển thị dữ liệu mẫu khi không kết nối được server
- Tất cả dữ liệu thống kê được tính toán từ API thực tế
- UI responsive và tương thích mobile
