# E-commerce Frontend Client

Ứng dụng web thương mại điện tử được xây dựng với React + Vite, Tailwind CSS và các công nghệ hiện đại.

## 🚀 Công nghệ sử dụng

- **React 18** - Thư viện UI chính
- **Vite** - Build tool và dev server
- **Tailwind CSS** - CSS framework
- **React Query** - Data fetching và state management
- **React Hook Form** - Form handling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Toast notifications** - User feedback
- **ESLint** - Code linting

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm hoặc yarn

## 🛠️ Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/vudang2002/web-e-commerce.git
cd web-e-commerce/client
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với các thông tin cần thiết:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 5. Build production

```bash
npm run build
```

## 📁 Cấu trúc thư mục

```
client/
├── public/                 # Static assets
│   ├── images/            # Hình ảnh tĩnh
│   └── vite.svg
├── src/
│   ├── components/        # React components
│   │   ├── admin/        # Admin dashboard components
│   │   ├── cart/         # Shopping cart components
│   │   ├── common/       # Shared components
│   │   ├── home/         # Homepage components
│   │   ├── order/        # Order management
│   │   └── user/         # User interface components
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   ├── routes/          # Routing configuration
│   ├── services/        # API service functions
│   ├── utils/           # Utility functions
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── Dockerfile          # Docker configuration
├── nginx.conf         # Nginx configuration
└── package.json       # Dependencies và scripts
```

## 🎯 Tính năng chính

### Khách hàng

- 🛍️ Duyệt và tìm kiếm sản phẩm
- 🛒 Quản lý giỏ hàng
- 💳 Thanh toán đơn hàng
- 👤 Quản lý tài khoản cá nhân
- 📝 Đánh giá sản phẩm
- 🤖 Chatbot hỗ trợ

### Admin Dashboard

- 📊 Dashboard thống kê
- 🏷️ Quản lý sản phẩm, danh mục, thương hiệu
- 👥 Quản lý người dùng
- 📦 Quản lý đơn hàng
- 🎫 Quản lý voucher
- 🤖 Quản lý chatbot

## 🧪 Testing

```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🐳 Docker

### Build Docker image

```bash
docker build -t web-ecommerce-client .
```

### Run với Docker

```bash
docker run -p 80:80 web-ecommerce-client
```

### Docker Compose

```bash
# Từ thư mục root
docker-compose up client
```

## 🔧 Scripts có sẵn

```json
{
  "dev": "Chạy development server",
  "build": "Build production",
  "preview": "Preview production build",
  "lint": "Chạy ESLint",
  "lint:fix": "Fix ESLint issues tự động",
  "test": "Chạy test suite",
  "test:watch": "Chạy tests ở watch mode"
}
```

## 🌍 Environment Variables

| Variable                          | Description           | Default                     |
| --------------------------------- | --------------------- | --------------------------- |
| `REACT_APP_API_BASE_URL`          | Backend API URL       | `http://localhost:5000/api` |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | -                           |

## 📱 Responsive Design

Ứng dụng được thiết kế responsive, hỗ trợ các breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 UI/UX Features

- ✨ Modern, clean design với Tailwind CSS
- 🌙 Responsive layout
- 🔄 Loading states và error handling
- 📱 Mobile-first approach
- 🎯 Intuitive navigation
- 💫 Smooth transitions và animations

## 🚀 Deployment

### Manual Deployment

1. Build production: `npm run build`
2. Deploy folder `dist/` lên web server
3. Configure Nginx/Apache để serve static files

### CI/CD với GitHub Actions

Pipeline tự động sẽ:

- Chạy tests và linting
- Build production
- Build và push Docker image
- Deploy lên server

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request
