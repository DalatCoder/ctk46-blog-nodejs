# API Endpoints cho Blog System

## Authentication APIs

### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/register
```json
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "password123"
}
```

### POST /api/auth/logout
```json
{
  "refresh_token": "token_here"
}
```

## Posts APIs

### GET /api/posts
**Parameters:**
- page (int): Trang hiện tại
- per_page (int): Số bài viết trên trang
- category (string): Slug danh mục
- tag (string): Slug thẻ
- search (string): Từ khóa tìm kiếm
- status (string): draft, published, archived
- featured (boolean): Bài viết nổi bật

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Làm thế nào công nghệ thay đổi cuộc sống chúng ta",
      "slug": "lam-the-nao-cong-nghe-thay-doi-cuoc-song-chung-ta",
      "excerpt": "Trong thời đại số hóa ngày nay...",
      "featured_image": "https://example.com/image.jpg",
      "author": {
        "id": 1,
        "full_name": "Minh",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "category": {
        "id": 1,
        "name": "Công nghệ",
        "slug": "cong-nghe",
        "color": "#3B82F6"
      },
      "tags": [
        {
          "id": 1,
          "name": "Công nghệ",
          "slug": "cong-nghe",
          "color": "#3B82F6"
        }
      ],
      "reading_time": 8,
      "view_count": 1234,
      "like_count": 56,
      "comment_count": 12,
      "published_at": "2024-07-25T10:00:00Z",
      "created_at": "2024-07-25T09:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

### GET /api/posts/{slug}
**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Làm thế nào công nghệ thay đổi cuộc sống chúng ta",
    "slug": "lam-the-nao-cong-nghe-thay-doi-cuoc-song-chung-ta",
    "content": "Nội dung đầy đủ bài viết...",
    "excerpt": "Trong thời đại số hóa ngày nay...",
    "featured_image": "https://example.com/image.jpg",
    "meta_description": "Mô tả SEO",
    "meta_keywords": "công nghệ, cuộc sống, digital",
    "author": {
      "id": 1,
      "full_name": "Minh",
      "username": "admin",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Developer & Blogger",
      "website": "https://myblog.com",
      "social_links": {
        "facebook": "https://facebook.com/myblog",
        "twitter": "https://twitter.com/myblog",
        "linkedin": "https://linkedin.com/in/myblog"
      }
    },
    "category": {
      "id": 1,
      "name": "Công nghệ",
      "slug": "cong-nghe",
      "color": "#3B82F6",
      "icon": "fas fa-laptop-code"
    },
    "tags": [
      {
        "id": 1,
        "name": "Công nghệ",
        "slug": "cong-nghe",
        "color": "#3B82F6"
      }
    ],
    "reading_time": 8,
    "view_count": 1234,
    "like_count": 56,
    "share_count": 23,
    "comment_count": 12,
    "is_featured": true,
    "status": "published",
    "published_at": "2024-07-25T10:00:00Z",
    "created_at": "2024-07-25T09:30:00Z",
    "updated_at": "2024-07-25T10:00:00Z",
    "breadcrumb": [
      {
        "name": "Trang chủ",
        "url": "/"
      },
      {
        "name": "Công nghệ",
        "url": "/category/cong-nghe"
      },
      {
        "name": "Bài viết",
        "url": null
      }
    ],
    "related_posts": [
      {
        "id": 2,
        "title": "Trí tuệ nhân tạo và tương lai nghề nghiệp",
        "slug": "tri-tue-nhan-tao-va-tuong-lai-nghe-nghiep",
        "featured_image": "https://example.com/image2.jpg",
        "published_at": "2024-07-20T14:30:00Z"
      }
    ]
  }
}
```

### POST /api/posts
**Authentication:** Required (Admin)
```json
{
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết...",
  "excerpt": "Tóm tắt ngắn",
  "featured_image": "https://example.com/image.jpg",
  "category_id": 1,
  "tag_ids": [1, 2, 3],
  "status": "published",
  "is_featured": false,
  "meta_description": "Mô tả SEO",
  "meta_keywords": "keyword1, keyword2"
}
```

### PUT /api/posts/{id}
**Authentication:** Required (Admin)

### DELETE /api/posts/{id}
**Authentication:** Required (Admin)

### POST /api/posts/{id}/like
```json
{
  "ip_address": "192.168.1.1"
}
```

### POST /api/posts/{id}/view
```json
{
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://google.com"
}
```

### POST /api/posts/{id}/share
```json
{
  "platform": "facebook",
  "ip_address": "192.168.1.1"
}
```

## Comments APIs

### GET /api/posts/{post_id}/comments
**Parameters:**
- page (int): Trang hiện tại
- per_page (int): Số bình luận trên trang
- status (string): pending, approved, rejected

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "content": "Bài viết rất hay và có ý nghĩa!",
      "status": "approved",
      "like_count": 5,
      "dislike_count": 0,
      "created_at": "2024-07-27T10:30:00Z",
      "author": {
        "name": "Lan Anh",
        "email": "lananh@email.com",
        "avatar_url": "https://example.com/avatar.jpg",
        "is_registered": false
      },
      "replies": [
        {
          "id": 2,
          "content": "Cảm ơn bạn đã chia sẻ!",
          "created_at": "2024-07-27T11:00:00Z",
          "author": {
            "name": "Minh",
            "avatar_url": "https://example.com/avatar2.jpg",
            "is_registered": true
          }
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 12,
    "total_pages": 1
  }
}
```

### POST /api/posts/{post_id}/comments
```json
{
  "content": "Nội dung bình luận",
  "parent_id": null,
  "guest_name": "Tên người dùng",
  "guest_email": "email@example.com"
}
```

### POST /api/comments/{id}/react
```json
{
  "reaction_type": "like",
  "ip_address": "192.168.1.1"
}
```

### PUT /api/comments/{id}/status
**Authentication:** Required (Admin)
```json
{
  "status": "approved"
}
```

### DELETE /api/comments/{id}
**Authentication:** Required (Admin)

## Categories APIs

### GET /api/categories
```json
{
  "data": [
    {
      "id": 1,
      "name": "Công nghệ",
      "slug": "cong-nghe",
      "description": "Những bài viết về công nghệ và đổi mới",
      "color": "#3B82F6",
      "icon": "fas fa-laptop-code",
      "post_count": 15,
      "children": []
    }
  ]
}
```

### GET /api/categories/{slug}
```json
{
  "data": {
    "id": 1,
    "name": "Công nghệ",
    "slug": "cong-nghe",
    "description": "Những bài viết về công nghệ và đổi mới",
    "color": "#3B82F6",
    "icon": "fas fa-laptop-code",
    "post_count": 15,
    "recent_posts": [
      {
        "id": 1,
        "title": "Làm thế nào công nghệ thay đổi cuộc sống chúng ta",
        "slug": "lam-the-nao-cong-nghe-thay-doi-cuoc-song-chung-ta",
        "featured_image": "https://example.com/image.jpg",
        "published_at": "2024-07-25T10:00:00Z"
      }
    ]
  }
}
```

## Tags APIs

### GET /api/tags
**Parameters:**
- popular (boolean): Lấy tags phổ biến
- limit (int): Số lượng tags

```json
{
  "data": [
    {
      "id": 1,
      "name": "Công nghệ",
      "slug": "cong-nghe",
      "color": "#3B82F6",
      "usage_count": 25
    }
  ]
}
```

### GET /api/tags/{slug}
```json
{
  "data": {
    "id": 1,
    "name": "Công nghệ",
    "slug": "cong-nghe",
    "color": "#3B82F6",
    "usage_count": 25,
    "recent_posts": [
      {
        "id": 1,
        "title": "Làm thế nào công nghệ thay đổi cuộc sống chúng ta",
        "slug": "lam-the-nao-cong-nghe-thay-doi-cuoc-song-chung-ta",
        "featured_image": "https://example.com/image.jpg",
        "published_at": "2024-07-25T10:00:00Z"
      }
    ]
  }
}
```

## Newsletter APIs

### POST /api/newsletter/subscribe
```json
{
  "email": "subscriber@example.com",
  "name": "Tên người đăng ký",
  "source": "sidebar"
}
```

### POST /api/newsletter/unsubscribe
```json
{
  "email": "subscriber@example.com",
  "token": "unsubscribe_token"
}
```

## Search APIs

### GET /api/search
**Parameters:**
- q (string): Từ khóa tìm kiếm
- type (string): posts, comments, all
- page (int): Trang hiện tại

```json
{
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Làm thế nào công nghệ thay đổi cuộc sống chúng ta",
        "slug": "lam-the-nao-cong-nghe-thay-doi-cuoc-song-chung-ta",
        "excerpt": "Trong thời đại số hóa ngày nay...",
        "highlight": "...thay đổi cuộc sống..."
      }
    ],
    "total_results": 5
  }
}
```

## Statistics APIs

### GET /api/stats/dashboard
**Authentication:** Required (Admin)
```json
{
  "data": {
    "total_posts": 25,
    "total_comments": 150,
    "total_views": 12500,
    "total_subscribers": 89,
    "recent_activity": [
      {
        "type": "new_comment",
        "data": {
          "post_title": "Bài viết ABC",
          "commenter_name": "Người dùng XYZ"
        },
        "created_at": "2024-07-28T15:30:00Z"
      }
    ],
    "popular_posts": [
      {
        "id": 1,
        "title": "Làm thế nào công nghệ thay đổi cuộc sống chúng ta",
        "view_count": 1234,
        "comment_count": 12
      }
    ]
  }
}
```

## Site Settings APIs

### GET /api/settings
```json
{
  "data": {
    "site_name": "MyBlog",
    "site_description": "Chia sẻ những câu chuyện và kinh nghiệm sống",
    "posts_per_page": 10,
    "comments_enabled": true,
    "social_links": {
      "facebook": "https://facebook.com/myblog",
      "twitter": "https://twitter.com/myblog",
      "linkedin": "https://linkedin.com/in/myblog"
    }
  }
}
```

### PUT /api/settings
**Authentication:** Required (Admin)
```json
{
  "site_name": "MyBlog Updated",
  "site_description": "Mô tả mới",
  "posts_per_page": 12,
  "comments_enabled": true
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": {
      "email": ["Email không đúng định dạng"],
      "password": ["Mật khẩu phải có ít nhất 8 ký tự"]
    }
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Yêu cầu xác thực"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Không có quyền truy cập"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Không tìm thấy tài nguyên"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Lỗi hệ thống"
  }
}
```

## Rate Limiting

Tất cả APIs đều có giới hạn:
- **Authenticated users**: 1000 requests/hour
- **Anonymous users**: 100 requests/hour
- **Comment/Like/Share**: 20 requests/minute

**Rate limit headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1627840800
```
