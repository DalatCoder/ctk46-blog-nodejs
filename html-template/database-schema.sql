-- ====================================
-- BLOG DATABASE SCHEMA
-- ====================================

-- Tạo database
CREATE DATABASE blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_db;

-- ====================================
-- 1. Bảng USERS - Quản lý người dùng
-- ====================================
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

-- ====================================
-- 2. Bảng CATEGORIES - Danh mục bài viết
-- ====================================
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

-- ====================================
-- 3. Bảng TAGS - Thẻ bài viết
-- ====================================
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7), -- HEX color code
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================
-- 4. Bảng POSTS - Bài viết chính
-- ====================================
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

-- ====================================
-- 5. Bảng POST_TAGS - Mối quan hệ bài viết và thẻ
-- ====================================
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ====================================
-- 6. Bảng COMMENTS - Hệ thống bình luận
-- ====================================
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

-- ====================================
-- 7. Bảng COMMENT_REACTIONS - Phản ứng bình luận
-- ====================================
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

-- ====================================
-- 8. Bảng POST_VIEWS - Theo dõi lượt xem
-- ====================================
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

-- ====================================
-- 9. Bảng POST_SHARES - Theo dõi chia sẻ
-- ====================================
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

-- ====================================
-- 10. Bảng NEWSLETTER_SUBSCRIBERS
-- ====================================
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

-- ====================================
-- 11. Bảng RELATED_POSTS - Bài viết liên quan
-- ====================================
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

-- ====================================
-- 12. Bảng POST_LIKES - Lượt thích bài viết
-- ====================================
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

-- ====================================
-- 13. Bảng SITE_SETTINGS - Cấu hình hệ thống
-- ====================================
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Có thể truy cập từ frontend
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================
-- VIEWS
-- ====================================

-- View thống kê bài viết
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

-- View bình luận được duyệt
CREATE VIEW approved_comments AS
SELECT 
    c.*,
    COALESCE(u.full_name, c.guest_name) as commenter_name,
    COALESCE(u.avatar_url, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face') as commenter_avatar
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.status = 'approved'
ORDER BY c.created_at DESC;

-- ====================================
-- TRIGGERS
-- ====================================

-- Trigger cập nhật số lượng bình luận khi thêm
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

-- Trigger cập nhật số lượng bình luận khi sửa
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

-- Trigger cập nhật usage_count cho tags khi thêm
CREATE TRIGGER update_tag_usage_after_insert
AFTER INSERT ON post_tags
FOR EACH ROW
BEGIN
    UPDATE tags 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.tag_id;
END//

-- Trigger cập nhật usage_count cho tags khi xóa
CREATE TRIGGER update_tag_usage_after_delete
AFTER DELETE ON post_tags
FOR EACH ROW
BEGIN
    UPDATE tags 
    SET usage_count = usage_count - 1 
    WHERE id = OLD.tag_id;
END//

DELIMITER ;

-- ====================================
-- STORED PROCEDURES
-- ====================================

-- Procedure lấy bài viết liên quan
DELIMITER //
CREATE PROCEDURE GetRelatedPosts(
    IN input_post_id INT,
    IN limit_count INT DEFAULT 3
)
BEGIN
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
             WHERE pt1.post_id = input_post_id AND pt2.post_id = p.id) * 0.6 +
            -- Cộng điểm nếu cùng category
            (CASE WHEN p.category_id = (SELECT category_id FROM posts WHERE id = input_post_id) 
                  THEN 0.4 ELSE 0 END)
        ) as relevance_score
    FROM posts p
    WHERE p.id != input_post_id 
        AND p.status = 'published'
        AND p.published_at <= NOW()
    HAVING relevance_score > 0
    ORDER BY relevance_score DESC, p.view_count DESC
    LIMIT limit_count;
END//

-- Procedure tăng view count
CREATE PROCEDURE IncrementViewCount(
    IN input_post_id INT,
    IN input_user_id INT,
    IN input_ip_address VARCHAR(45),
    IN input_user_agent TEXT,
    IN input_referrer VARCHAR(500)
)
BEGIN
    DECLARE view_exists INT DEFAULT 0;
    
    -- Kiểm tra xem IP này đã xem trong vòng 1 giờ chưa (tránh spam)
    SELECT COUNT(*) INTO view_exists
    FROM post_views 
    WHERE post_id = input_post_id 
        AND ip_address = input_ip_address 
        AND viewed_at > DATE_SUB(NOW(), INTERVAL 1 HOUR);
    
    IF view_exists = 0 THEN
        -- Thêm record view mới
        INSERT INTO post_views (post_id, user_id, ip_address, user_agent, referrer)
        VALUES (input_post_id, input_user_id, input_ip_address, input_user_agent, input_referrer);
        
        -- Cập nhật view count
        UPDATE posts 
        SET view_count = view_count + 1 
        WHERE id = input_post_id;
    END IF;
END//

DELIMITER ;

-- ====================================
-- DỮ LIỆU MẪU
-- ====================================

-- Users
INSERT INTO users (email, username, full_name, password_hash, avatar_url, bio, facebook_url, twitter_url, linkedin_url, is_admin) VALUES
('admin@myblog.com', 'admin', 'Minh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', 'Developer & Blogger passionate about technology and life', 'https://facebook.com/myblog', 'https://twitter.com/myblog', 'https://linkedin.com/in/myblog', TRUE);

-- Categories
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('Công nghệ', 'cong-nghe', 'Những bài viết về công nghệ và đổi mới', '#3B82F6', 'fas fa-laptop-code', 1),
('Cuộc sống', 'cuoc-song', 'Chia sẻ về cuộc sống hàng ngày', '#10B981', 'fas fa-heart', 2),
('Du lịch', 'du-lich', 'Trải nghiệm và chia sẻ về du lịch', '#F59E0B', 'fas fa-map-marked-alt', 3),
('Phát triển bản thân', 'phat-trien-ban-than', 'Hướng dẫn và chia sẻ về phát triển cá nhân', '#8B5CF6', 'fas fa-user-graduate', 4);

-- Tags
INSERT INTO tags (name, slug, color) VALUES
('Công nghệ', 'cong-nghe', '#3B82F6'),
('Cuộc sống', 'cuoc-song', '#10B981'),
('Tương lai', 'tuong-lai', '#8B5CF6'),
('Digital', 'digital', '#F59E0B'),
('AI', 'ai', '#EF4444'),
('Remote work', 'remote-work', '#06B6D4');

-- Posts
INSERT INTO posts (title, slug, excerpt, content, featured_image, author_id, category_id, status, is_featured, reading_time, view_count, published_at) VALUES
('Làm thế nào công nghệ thay đổi cuộc sống chúng ta', 'lam-the-nao-cong-nghe-thay-doi-cuoc-song-chung-ta', 'Trong thời đại số hóa ngày nay, công nghệ đã và đang thay đổi mọi khía cạnh của cuộc sống chúng ta một cách sâu sắc và toàn diện.', 'Nội dung bài viết đầy đủ về công nghệ...', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&crop=center', 1, 1, 'published', TRUE, 8, 1234, '2024-07-25 10:00:00'),
('Trí tuệ nhân tạo và tương lai nghề nghiệp', 'tri-tue-nhan-tao-va-tuong-lai-nghe-nghiep', 'AI đang thay đổi thị trường lao động như thế nào?', 'Nội dung về AI...', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&crop=center', 1, 1, 'published', FALSE, 6, 856, '2024-07-20 14:30:00'),
('Làm việc từ xa: Ưu và nhược điểm', 'lam-viec-tu-xa-uu-va-nhuoc-diem', 'Remote work đã trở thành xu hướng chính trong thời đại mới', 'Nội dung về remote work...', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=400&fit=crop&crop=center', 1, 1, 'published', FALSE, 5, 642, '2024-07-15 09:15:00');

-- Post Tags
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 5), (2, 3),
(3, 6), (3, 1), (3, 2);

-- Comments
INSERT INTO comments (post_id, guest_name, guest_email, content, status, like_count, created_at) VALUES
(1, 'Lan Anh', 'lananh@email.com', 'Bài viết rất hay và có ý nghĩa! Mình đặc biệt thích phần nói về giáo dục. Thực sự công nghệ đã thay đổi cách chúng ta học tập rất nhiều.', 'approved', 5, '2024-07-27 10:30:00'),
(1, 'Hoàng Nam', 'hoangnam@email.com', 'Cảm ơn tác giả đã chia sẻ! Mình cũng đang quan tâm về vấn đề bảo mật dữ liệu mà bài viết đề cập. Có thể viết thêm về chủ đề này không?', 'approved', 3, '2024-07-28 15:45:00');

-- Newsletter Subscribers
INSERT INTO newsletter_subscribers (email, name, source) VALUES
('subscriber1@email.com', 'Người đăng ký 1', 'sidebar'),
('subscriber2@email.com', 'Người đăng ký 2', 'post_page');

-- Site Settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'MyBlog', 'string', 'Tên website', TRUE),
('site_description', 'Chia sẻ những câu chuyện và kinh nghiệm sống', 'string', 'Mô tả website', TRUE),
('posts_per_page', '10', 'number', 'Số bài viết trên mỗi trang', TRUE),
('comments_enabled', 'true', 'boolean', 'Bật/tắt hệ thống bình luận', TRUE),
('comment_moderation', 'true', 'boolean', 'Kiểm duyệt bình luận trước khi hiển thị', FALSE),
('social_links', '{"facebook": "https://facebook.com/myblog", "twitter": "https://twitter.com/myblog", "linkedin": "https://linkedin.com/in/myblog"}', 'json', 'Liên kết mạng xã hội', TRUE);
