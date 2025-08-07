# UserController Documentation

## Overview
UserController xử lý tất cả logic quản lý users phía admin, được tách riêng từ AdminController để có cấu trúc code tốt hơn và dễ bảo trì.

## API Endpoints

### 1. Get All Users
**GET** `/admin/users`
- **Description**: Lấy danh sách tất cả users với pagination và filters
- **Query Parameters**:
  - `page` (optional): Số trang (default: 1)
  - `limit` (optional): Số items per page (default: 10)
  - `role` (optional): Filter theo role (USER, ADMIN)
  - `status` (optional): Filter theo status (ACTIVE, INACTIVE)
  - `search` (optional): Tìm kiếm theo email, username, firstName, lastName
- **Response**: JSON object với users, pagination, stats, filters

### 2. Get User By ID
**GET** `/admin/users/:id`
- **Description**: Lấy thông tin chi tiết của một user
- **Response**: JSON object với thông tin user (không bao gồm password)

### 3. Create User
**POST** `/admin/users`
- **Description**: Tạo user mới
- **Body Parameters**:
  - `username` (required): Tên đăng nhập
  - `email` (required): Email
  - `firstName` (required): Tên
  - `lastName` (required): Họ
  - `password` (required): Mật khẩu (tối thiểu 6 ký tự)
  - `role` (optional): Role (default: USER)
  - `status` (optional): Status (default: ACTIVE)
- **Validation**:
  - Email format validation
  - Username/email uniqueness check
  - Password strength validation
- **Response**: JSON object với user mới tạo (không bao gồm password)

### 4. Update User
**PUT** `/admin/users/:id`
- **Description**: Cập nhật thông tin user
- **Body Parameters**:
  - `username` (required): Tên đăng nhập
  - `email` (required): Email
  - `firstName` (required): Tên
  - `lastName` (required): Họ
  - `role` (optional): Role
  - `status` (optional): Status
  - `password` (optional): Mật khẩu mới (nếu có)
- **Validation**: Tương tự create, plus check conflicts with existing users
- **Response**: JSON object với user đã cập nhật

### 5. Delete User
**DELETE** `/admin/users/:id`
- **Description**: Xóa user
- **Restrictions**:
  - Không thể xóa chính mình
  - Không thể xóa SUPER_ADMIN
- **Response**: JSON object với message xác nhận

### 6. Toggle User Status
**PATCH** `/admin/users/:id/toggle-status`
- **Description**: Chuyển đổi trạng thái user (ACTIVE ↔ INACTIVE)
- **Restrictions**: Không thể thay đổi trạng thái của chính mình
- **Response**: JSON object với user đã cập nhật

### 7. Reset User Password
**PATCH** `/admin/users/:id/reset-password`
- **Description**: Reset mật khẩu user
- **Body Parameters**:
  - `newPassword` (required): Mật khẩu mới (tối thiểu 6 ký tự)
- **Response**: JSON object với message xác nhận

### 8. Bulk Update Users
**POST** `/admin/users/bulk-update`
- **Description**: Thực hiện actions hàng loạt trên nhiều users
- **Body Parameters**:
  - `action` (required): activate, deactivate, promote, demote, delete
  - `userIds` (required): Array of user IDs
- **Restrictions**:
  - Không thể thao tác trên chính mình
  - Không thể demote hoặc delete SUPER_ADMIN
- **Response**: JSON object với số lượng users đã cập nhật

### 9. Get User Statistics
**GET** `/admin/users/stats`
- **Description**: Lấy thống kê về users
- **Response**: JSON object với statistics

## Security Features

1. **Authentication & Authorization**: Tất cả endpoints require admin authentication
2. **Self-Protection**: Không thể xóa hoặc thay đổi trạng thái của chính mình
3. **Super Admin Protection**: Bảo vệ SUPER_ADMIN khỏi các actions nguy hiểm
4. **Input Validation**: Validate email format, password strength, required fields
5. **Conflict Detection**: Check username/email uniqueness
6. **Password Security**: Passwords được hash trước khi lưu (xử lý trong UserModel)

## Error Handling

- **400 Bad Request**: Invalid input, validation errors, business rule violations
- **404 Not Found**: User not found
- **500 Internal Server Error**: Database errors, unexpected errors

## Usage Example

```javascript
// Tạo user mới
const response = await fetch('/admin/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'securepassword123',
    role: 'USER',
    status: 'ACTIVE'
  })
});

// Bulk update users
const bulkResponse = await fetch('/admin/users/bulk-update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'activate',
    userIds: [1, 2, 3]
  })
});
```

## Benefits

1. **Separation of Concerns**: Tách biệt logic user management khỏi AdminController
2. **Code Reusability**: Có thể sử dụng lại cho mobile API hoặc frontend khác
3. **Better Error Handling**: Xử lý lỗi chi tiết và phù hợp
4. **Enhanced Security**: Validation và authorization mạnh mẽ
5. **Maintainability**: Code dễ đọc, dễ test và dễ bảo trì
