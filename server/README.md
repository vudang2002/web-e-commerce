# E-commerce Backend Server

RESTful API server cho ứng dụng thương mại điện tử được xây dựng với Node.js, Express.js, MongoDB và các công nghệ hiện đại.

## 🚀 Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image upload và storage
- **OpenAI** - AI chatbot integration
- **Swagger** - API documentation
- **Winston** - Logging
- **Jest** - Testing framework

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm hoặc yarn

## 🛠️ Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/vudang2002/web-e-commerce.git
cd web-e-commerce/server
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
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce
MONGODB_TEST_URI=mongodb://localhost:27017/ecommerce_test

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

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

### 4. Chạy development server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

### 5. API Documentation

Swagger documentation: `http://localhost:5000/api-docs`

## 📁 Cấu trúc thư mục

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.config.js     # Database configuration
│   │   ├── env.config.js    # Environment variables
│   │   └── cloudinary.config.js # Cloudinary setup
│   ├── controllers/         # Route controllers
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── cart.controller.js
│   │   ├── chatbot.controller.js
│   │   └── ...
│   ├── models/             # Database models
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   └── ...
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middlewares/        # Custom middlewares
│   ├── utils/              # Utility functions
│   ├── validators/         # Input validation
│   ├── constants/          # Application constants
│   ├── app.js             # Express app setup
│   └── swagger.js         # Swagger configuration
├── tests/                  # Test files
├── logs/                   # Log files
├── coverage/              # Test coverage reports
├── babel.config.js        # Babel configuration
├── jest.config.js         # Jest configuration
└── package.json          # Dependencies và scripts
```

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Refresh token

### Users

- `GET /api/users/profile` - Lấy thông tin user
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users` - Lấy danh sách users (Admin)

### Products

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Categories & Brands

- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/brands` - Lấy danh sách thương hiệu
- `POST /api/categories` - Tạo danh mục (Admin)
- `POST /api/brands` - Tạo thương hiệu (Admin)

### Cart & Orders

- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/update` - Cập nhật giỏ hàng
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lấy danh sách đơn hàng

### Reviews

- `GET /api/reviews/product/:productId` - Lấy reviews của sản phẩm
- `POST /api/reviews` - Tạo review mới
- `PUT /api/reviews/:id` - Cập nhật review
- `DELETE /api/reviews/:id` - Xóa review

### Search & Chatbot

- `GET /api/search` - Tìm kiếm sản phẩm
- `POST /api/chatbot/message` - Chat với AI bot

## 🔐 Authentication & Authorization

API sử dụng JWT (JSON Web Token) cho authentication:

- Token được gửi qua Authorization header: `Bearer <token>`
- Token có thời hạn 7 ngày
- Refresh token để gia hạn session

### Roles:

- **User**: Khách hàng thông thường
- **Admin**: Quản trị viên hệ thống
- **Seller**: Người bán hàng

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests ở watch mode
npm run test:watch

# Chạy tests cho specific file
npm test -- user.test.js
```

## 📊 Logging

Hệ thống sử dụng Winston để logging:

- `logs/combined.log` - Tất cả logs
- `logs/error.log` - Error logs
- `logs/exceptions.log` - Exception logs

Log levels: error, warn, info, debug

## 🔧 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Giới hạn request
- **Input Validation**: Validate dữ liệu đầu vào
- **Password Hashing**: Bcrypt cho mật khẩu
- **JWT**: Secure authentication
- **Environment Variables**: Sensitive data protection

## 🚀 Performance

- **Compression**: Gzip compression
- **Caching**: Node-cache cho data caching
- **Database Indexing**: MongoDB indexes
- **Connection Pooling**: MongoDB connection pooling

## 📈 Monitoring & Health Check

- `GET /health` - Health check endpoint
- `GET /api/health/detailed` - Detailed health status
- Winston logging cho monitoring
- Error tracking và reporting

## 🐳 Docker

### Build Docker image

```bash
docker build -t web-ecommerce-server .
```

### Run với Docker

```bash
docker run -p 5000:5000 web-ecommerce-server
```

### Docker Compose

```bash
# Từ thư mục root
docker-compose up server
```

## 🌍 Environment Variables

| Variable                | Description               | Default       |
| ----------------------- | ------------------------- | ------------- |
| `PORT`                  | Server port               | `5000`        |
| `NODE_ENV`              | Environment               | `development` |
| `MONGODB_URI`           | MongoDB connection string | -             |
| `JWT_SECRET`            | JWT secret key            | -             |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | -             |
| `OPENAI_API_KEY`        | OpenAI API key            | -             |

## 📚 API Documentation

Swagger UI: `http://localhost:5000/api-docs`

### Example API calls:

```bash
# Get all products
curl -X GET http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Create product (requires admin token)
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product Name","price":100,"description":"Description"}'
```

## 🚀 Deployment

### Manual Deployment

1. Setup production MongoDB
2. Configure environment variables
3. Build và deploy application
4. Setup reverse proxy (Nginx)

### CI/CD

- Automated testing với GitHub Actions
- Docker build và push
- Environment-specific deployments

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request
