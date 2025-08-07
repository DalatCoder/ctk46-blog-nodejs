# Thiết kế Cơ sở Dữ liệu cho Blog Cá nhân

## Phân tích yêu cầu từ giao diện

Dựa trên nội dung trang bài viết chi tiết, hệ thống cần lưu trữ:

### 1. Thông tin bài viết
- Tiêu đề, nội dung, hình ảnh
- Thông tin tác giả
- Ngày đăng, lượt xem, thời gian đọc
- Thẻ (tags) và danh mục
- Breadcrumb navigation

### 2. Hệ thống bình luận
- Bình luận của người dùng
- Thông tin người bình luận
- Thời gian bình luận
- Chức năng like/dislike
- Trả lời bình luận (nested comments)

### 3. Tương tác xã hội
- Chia sẻ trên các mạng xã hội
- Đếm số lượt chia sẻ

### 4. Nội dung liên quan
- Bài viết liên quan/gợi ý
- Tác giả và thông tin cá nhân
- Newsletter subscription

## Thiết kế các bảng

### 1. Bảng `users` - Quản lý người dùng
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Bảng `categories` - Danh mục bài viết
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- HEX color code
    icon VARCHAR(50), -- Font Awesome icon class
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

### 3. Bảng `tags` - Thẻ bài viết
```sql
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7), -- HEX color code
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Bảng `posts` - Bài viết chính
```sql
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500),
    meta_description VARCHAR(160),
    meta_keywords TEXT,
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    reading_time INT, -- in minutes
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_status_published (status, published_at),
    INDEX idx_author (author_id),
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    FULLTEXT idx_search (title, content, excerpt)
);
```

### 5. Bảng `post_tags` - Mối quan hệ nhiều-nhiều giữa bài viết và thẻ
```sql
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

### 6. Bảng `comments` - Hệ thống bình luận
```sql
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    parent_id INT NULL, -- For nested comments/replies
    user_id INT NULL, -- NULL for guest comments
    guest_name VARCHAR(100) NULL,
    guest_email VARCHAR(255) NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_status (post_id, status),
    INDEX idx_parent (parent_id),
    INDEX idx_created (created_at)
);
```

### 7. Bảng `comment_reactions` - Phản ứng với bình luận
```sql
CREATE TABLE comment_reactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45) NOT NULL,
    reaction_type ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_reaction (comment_id, user_id, ip_address),
    INDEX idx_comment (comment_id)
);
```

### 8. Bảng `post_views` - Theo dõi lượt xem
```sql
CREATE TABLE post_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_date (post_id, viewed_at),
    INDEX idx_ip_date (ip_address, viewed_at)
);
```

### 9. Bảng `post_shares` - Theo dõi chia sẻ
```sql
CREATE TABLE post_shares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    platform ENUM('facebook', 'twitter', 'linkedin', 'copy_link', 'email') NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45) NOT NULL,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_platform (post_id, platform),
    INDEX idx_date (shared_at)
);
```

### 10. Bảng `newsletter_subscribers` - Đăng ký nhận tin
```sql
CREATE TABLE newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    source VARCHAR(100), -- 'website', 'post_page', 'sidebar', etc.
    ip_address VARCHAR(45),
    user_agent TEXT,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    last_email_sent TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    INDEX idx_status (status),
    INDEX idx_subscribed_date (subscribed_at)
);
```

### 11. Bảng `related_posts` - Bài viết liên quan
```sql
CREATE TABLE related_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    related_post_id INT NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    relation_type ENUM('manual', 'auto_category', 'auto_tags', 'auto_content') DEFAULT 'manual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_relation (post_id, related_post_id),
    INDEX idx_post (post_id),
    INDEX idx_score (relevance_score)
);
```

### 12. Bảng `post_likes` - Lượt thích bài viết
```sql
CREATE TABLE post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45) NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_like (post_id, user_id, ip_address),
    INDEX idx_post (post_id)
);
```

## Mối quan hệ giữa các bảng

### 1. Quan hệ One-to-Many
- `users` (1) → `posts` (n): Một user có thể viết nhiều bài
- `categories` (1) → `posts` (n): Một danh mục có nhiều bài viết
- `posts` (1) → `comments` (n): Một bài viết có nhiều bình luận
- `comments` (1) → `comments` (n): Bình luận cha có nhiều bình luận con
- `users` (1) → `comments` (n): Một user có thể có nhiều bình luận
- `categories` (1) → `categories` (n): Danh mục cha có nhiều danh mục con

### 2. Quan hệ Many-to-Many
- `posts` ↔ `tags` (thông qua `post_tags`): Bài viết có nhiều thẻ, thẻ thuộc nhiều bài viết
- `posts` ↔ `posts` (thông qua `related_posts`): Bài viết liên quan với nhau

### 3. Quan hệ theo dõi (Tracking)
- `posts` → `post_views`: Theo dõi lượt xem
- `posts` → `post_shares`: Theo dõi lượt chia sẻ  
- `posts` → `post_likes`: Theo dõi lượt thích
- `comments` → `comment_reactions`: Theo dõi phản ứng bình luận

## Indexes và Optimization

### 1. Primary Indexes
- Tất cả bảng đều có PRIMARY KEY
- Unique indexes cho email, username, slug

### 2. Performance Indexes
- Composite indexes cho các truy vấn phổ biến
- FULLTEXT index cho tìm kiếm nội dung
- Indexes cho foreign keys

### 3. Partitioning (Tùy chọn)
```sql
-- Partition bảng post_views theo tháng để tối ưu performance
ALTER TABLE post_views PARTITION BY RANGE (MONTH(viewed_at)) (
    PARTITION p_jan VALUES LESS THAN (2),
    PARTITION p_feb VALUES LESS THAN (3),
    -- ... các tháng khác
    PARTITION p_dec VALUES LESS THAN (13)
);
```

## Views hữu ích

### 1. View thống kê bài viết
```sql
CREATE VIEW post_statistics AS
SELECT 
    p.id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.share_count,
    p.comment_count,
    COUNT(DISTINCT pt.tag_id) as tag_count,
    u.full_name as author_name,
    c.name as category_name
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
GROUP BY p.id;
```

### 2. View bình luận được approve
```sql
CREATE VIEW approved_comments AS
SELECT 
    c.*,
    COALESCE(u.full_name, c.guest_name) as commenter_name,
    COALESCE(u.avatar_url, '/img/default-avatar.png') as commenter_avatar
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.status = 'approved'
ORDER BY c.created_at DESC;
```

## Triggers để đồng bộ dữ liệu

### 1. Cập nhật số lượng bình luận
```sql
DELIMITER //
CREATE TRIGGER update_comment_count_after_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' THEN
        UPDATE posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
    END IF;
END//

CREATE TRIGGER update_comment_count_after_update
AFTER UPDATE ON comments
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
            UPDATE posts 
            SET comment_count = comment_count + 1 
            WHERE id = NEW.post_id;
        ELSEIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
            UPDATE posts 
            SET comment_count = comment_count - 1 
            WHERE id = NEW.post_id;
        END IF;
    END IF;
END//
DELIMITER ;
```

### 2. Cập nhật usage_count cho tags
```sql
DELIMITER //
CREATE TRIGGER update_tag_usage_after_insert
AFTER INSERT ON post_tags
FOR EACH ROW
BEGIN
    UPDATE tags 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.tag_id;
END//

CREATE TRIGGER update_tag_usage_after_delete
AFTER DELETE ON post_tags
FOR EACH ROW
BEGIN
    UPDATE tags 
    SET usage_count = usage_count - 1 
    WHERE id = OLD.tag_id;
END//
DELIMITER ;
```

## Stored Procedures hữu ích

### 1. Lấy bài viết liên quan tự động
```sql
DELIMITER //
CREATE PROCEDURE GetRelatedPosts(
    IN post_id INT,
    IN limit_count INT DEFAULT 3
)
BEGIN
    -- Tìm bài viết liên quan dựa trên tags và category
    SELECT DISTINCT 
        p.id,
        p.title,
        p.slug,
        p.featured_image,
        p.published_at,
        p.view_count,
        (
            -- Tính điểm relevance dựa trên tags chung
            (SELECT COUNT(*) FROM post_tags pt1 
             JOIN post_tags pt2 ON pt1.tag_id = pt2.tag_id 
             WHERE pt1.post_id = post_id AND pt2.post_id = p.id) * 0.6 +
            -- Cộng điểm nếu cùng category
            (CASE WHEN p.category_id = (SELECT category_id FROM posts WHERE id = post_id) 
                  THEN 0.4 ELSE 0 END)
        ) as relevance_score
    FROM posts p
    WHERE p.id != post_id 
        AND p.status = 'published'
        AND p.published_at <= NOW()
    HAVING relevance_score > 0
    ORDER BY relevance_score DESC, p.view_count DESC
    LIMIT limit_count;
END//
DELIMITER ;
```

## Bảng cấu hình hệ thống
```sql
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Có thể truy cập từ frontend
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'MyBlog', 'string', 'Tên website', TRUE),
('site_description', 'Chia sẻ những câu chuyện và kinh nghiệm sống', 'string', 'Mô tả website', TRUE),
('posts_per_page', '10', 'number', 'Số bài viết trên mỗi trang', TRUE),
('comments_enabled', 'true', 'boolean', 'Bật/tắt hệ thống bình luận', TRUE),
('comment_moderation', 'true', 'boolean', 'Kiểm duyệt bình luận trước khi hiển thị', FALSE),
('social_links', '{"facebook": "", "twitter": "", "linkedin": ""}', 'json', 'Liên kết mạng xã hội', TRUE);
```

Thiết kế này đảm bảo:
- **Tính toàn vện**: Bao phủ tất cả chức năng từ giao diện
- **Khả năng mở rộng**: Dễ dàng thêm tính năng mới
- **Hiệu suất**: Indexes và partitioning cho truy vấn nhanh
- **Tính nhất quán**: Foreign key constraints và triggers
- **Linh hoạt**: Hỗ trợ cả user đăng ký và guest comments
