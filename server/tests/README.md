# Unit Tests cho E-commerce Server

## Tổng quan

Đây là bộ unit tests cơ bản cho server e-commerce, được thiết kế để thể hiện kỹ năng testing trong CV.

## Kết quả Tests

```
Test Suites: 4 passed, 4 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        ~1s
```

## Cấu trúc Tests

### 📁 Utils Tests

- **jwt.util.test.js**: Test JWT token generation và verification (3 tests)
- **response.util.test.js**: Test response formatting functions (3 tests)
- **textUtils.test.js**: Test Vietnamese text processing (4 tests)
- **cache.util.test.js**: Test cache operations (3 tests)

## Chạy Tests

```bash
# Chạy all tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage report
npm run test:coverage
```

## Test Coverage

### ✅ **Utils Coverage (28.69%):**

- JWT utilities: 100% coverage
- Response utilities: 64.7% coverage
- Text processing: 13.63% coverage
- Cache utilities: 100% coverage

### 🎯 **Core Functions Covered:**

- **Authentication**: Token generation & verification
- **Response Formatting**: Success, error, pagination responses
- **Text Processing**: Vietnamese tone removal, search query normalization
- **Caching**: Set, get, delete operations

## Đặc điểm Tests

### **Kỹ thuật sử dụng:**

- ✅ **Jest Framework** - Modern JavaScript testing
- ✅ **Mocking** - Mock external dependencies
- ✅ **Unit Testing** - Isolated function testing
- ✅ **Edge Cases** - Error handling, null inputs
- ✅ **Fast Execution** - <1s runtime

### **Phù hợp cho CV:**

- Thể hiện kỹ năng **Testing** fundamentals
- Thể hiện hiểu biết về **Best Practices**
- Thể hiện khả năng **Code Quality**
- **Clean & Professional** code structure

## Lưu ý

- Tests sử dụng mocking để tránh external dependencies
- Tập trung vào utility functions quan trọng nhất
- Đơn giản, hiệu quả và dễ maintain
- Phù hợp cho dự án CV level junior/mid-level
