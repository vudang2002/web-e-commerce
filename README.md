# 🛒 Web E-commerce Platform

Nền tảng thương mại điện tử đầy đủ tính năng được xây dựng với kiến trúc Microservices, bao gồm frontend React và backend Node.js API.

## 🌟 Tổng quan dự án

Đây là một ứng dụng e-commerce hoàn chỉnh với đầy đủ tính năng cho cả khách hàng và admin, hỗ trợ bán hàng trực tuyến, quản lý kho, thanh toán và AI chatbot.

### ✨ Tính năng chính

#### 👥 Dành cho khách hàng

- 🔐 Đăng ký, đăng nhập, quản lý tài khoản
- 🛍️ Duyệt sản phẩm theo danh mục, thương hiệu
- 🔍 Tìm kiếm và lọc sản phẩm thông minh
- 🛒 Quản lý giỏ hàng và wishlist
- 💳 Thanh toán trực tuyến an toàn
- 📦 Theo dõi đơn hàng và lịch sử mua hàng
- ⭐ Đánh giá và review sản phẩm
- 🎫 Sử dụng voucher và mã giảm giá
- 🤖 Hỗ trợ AI chatbot 24/7

#### 👨‍💼 Dành cho Admin

- 📊 Dashboard thống kê doanh thu, đơn hàng
- 🏷️ Quản lý sản phẩm, danh mục, thương hiệu
- 👥 Quản lý người dùng và phân quyền
- 📦 Quản lý đơn hàng và trạng thái giao hàng
- 🎫 Tạo và quản lý voucher, khuyến mãi
- 📈 Báo cáo doanh thu và analytics
- 🤖 Cấu hình và training AI chatbot

## 🏗️ Kiến trúc hệ thống

```
web-e-commerce/
├── client/          # Frontend React Application
├── server/          # Backend Node.js API
├── docker-compose.yml
└── README.md
```

### 🎨 Frontend (Client)

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Testing**: Jest + React Testing Library

### ⚡ Backend (Server)

- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Bcrypt
- **File Upload**: Cloudinary
- **AI Integration**: OpenAI API
- **Documentation**: Swagger UI
- **Logging**: Winston
- **Testing**: Jest + Supertest

## 📋 Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0
- **Docker** (optional)
- **npm** hoặc **yarn**

## 🚀 Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/vudang2002/web-e-commerce.git
cd web-e-commerce
```

### 2. Cài đặt dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3. Cấu hình environment variables

#### Backend (.env)

```bash
cd server
cp .env.example .env
```

Cấu hình các biến môi trường:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)

```bash
cd client
cp .env.example .env
```

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Chạy ứng dụng

#### Development mode

**Backend**:

```bash
cd server
npm start
```

**Frontend**:

```bash
cd client
npm run dev
```

#### Production mode với Docker

```bash
docker-compose up --build
```

### 5. Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 📁 Cấu trúc dự án chi tiết

### Frontend Structure

```
client/
├── public/
│   └── images/          # Static images
├── src/
│   ├── components/      # Reusable components
│   │   ├── admin/      # Admin dashboard components
│   │   ├── cart/       # Shopping cart components
│   │   ├── common/     # Shared components
│   │   └── ...
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   └── contexts/       # React contexts
├── Dockerfile
└── README.md
```

### Backend Structure

```
server/
├── src/
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middlewares
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── tests/              # Test files
├── logs/               # Application logs
└── README.md
```

## 🧪 Testing

### Frontend Tests

```bash
cd client
npm test
npm run test:coverage
```

### Backend Tests

```bash
cd server
npm test
npm run test:coverage
```

## 🐳 Docker Deployment

### Development

```bash
docker-compose up
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 API Documentation

Swagger UI có sẵn tại: `http://localhost:5000/api-docs`

### Các API chính:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Orders**: `/api/orders/*`
- **Cart**: `/api/cart/*`
- **Reviews**: `/api/reviews/*`
- **Search**: `/api/search/*`
- **Chatbot**: `/api/chatbot/*`

## 🔐 Bảo mật

- JWT Authentication với refresh tokens
- Password hashing với Bcrypt
- Rate limiting cho API endpoints
- Input validation và sanitization
- CORS protection
- Helmet.js security headers
- Environment variables cho sensitive data

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows:

- **Frontend CI/CD**: `.github/workflows/frontend.yml`

  - Automated testing
  - Build và deployment
  - Docker image creation

- **Backend CI/CD**: `.github/workflows/backend.yml`
  - Unit và integration tests
  - Security scanning
  - Docker deployment

## 📈 Performance & Monitoring

- **Caching**: Redis cho session và data caching
- **Compression**: Gzip compression
- **CDN**: Cloudinary cho images
- **Database Indexing**: MongoDB performance optimization
- **Logging**: Winston với structured logging
- **Health Checks**: Endpoint monitoring

## 🌐 Environment Support

- **Development**: Local development với hot reload
- **Staging**: Pre-production testing environment
- **Production**: Optimized production deployment

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho:

- 📱 Mobile devices (< 768px)
- 📟 Tablets (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### Development Guidelines:

- Tuân theo ESLint rules
- Viết tests cho features mới
- Cập nhật documentation
- Code review trước khi merge

## 🚀 Roadmap

- [ ] Mobile app với React Native
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Social media integration
- [ ] Progressive Web App (PWA)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
      **⭐ Nếu dự án này hữu ích, hãy give star để ủng hộ nhé!**
