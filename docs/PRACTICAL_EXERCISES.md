# PRACTICAL EXERCISES: MVC & ORM

## BÀI TẬP 1: COMMENT SYSTEM IMPLEMENTATION
**Thời gian**: 30 phút  
**Độ khó**: Trung bình  
**Mục tiêu**: Hiểu cách implement một feature hoàn chỉnh theo MVC pattern

### Yêu cầu:
1. Tạo CommentModel với các phương thức CRUD
2. Implement CommentController với validation
3. Tạo view để hiển thị và thêm comment
4. Thêm middleware kiểm tra quyền sở hữu comment

### Step 1: Model Implementation
```javascript
// src/models/CommentModel.js
const prisma = require('../config/database');

class CommentModel {
  // TODO: Implement create method
  static async create(commentData) {
    // Validate parent comment if reply
    // Create comment with status PENDING
    // Return comment with author info
  }
  
  // TODO: Implement findByPostId method
  static async findByPostId(postId, options = {}) {
    // Get approved comments for a post
    // Include author information
    // Support pagination
    // Order by creation date
  }
  
  // TODO: Implement update method
  static async update(id, data) {
    // Update comment content
    // Check ownership
    // Return updated comment
  }
  
  // TODO: Implement delete method
  static async delete(id) {
    // Soft delete or hard delete
    // Check ownership
    // Handle replies if parent comment
  }
  
  // TODO: Implement approve method (admin only)
  static async approve(id) {
    // Change status to APPROVED
    // Send notification to author
  }
}

module.exports = CommentModel;
```

### Step 2: Controller Implementation
```javascript
// src/controllers/CommentController.js
const CommentModel = require('../models/CommentModel');
const { validationResult } = require('express-validator');

class CommentController {
  // TODO: Implement store method
  static async store(req, res) {
    try {
      // Validate input
      // Check if post exists
      // Create comment
      // Return success response
    } catch (error) {
      // Handle errors appropriately
    }
  }
  
  // TODO: Implement update method
  static async update(req, res) {
    try {
      // Validate ownership
      // Update comment
      // Return updated comment
    } catch (error) {
      // Handle errors
    }
  }
  
  // TODO: Implement destroy method
  static async destroy(req, res) {
    // Check ownership or admin permission
    // Delete comment
    // Return success message
  }
}

module.exports = CommentController;
```

### Step 3: View Implementation
```handlebars
{{!-- src/views/partials/comments.hbs --}}
<div class="comments-section mt-8">
  <h3 class="text-xl font-semibold mb-4">
    Bình luận ({{comments.length}})
  </h3>
  
  {{!-- Comment Form --}}
  {{#if user}}
    <form id="commentForm" class="mb-6">
      <!-- TODO: Implement comment form -->
      <textarea 
        name="content" 
        placeholder="Viết bình luận..."
        class="w-full p-3 border rounded-lg"
        required
      ></textarea>
      <button type="submit" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Gửi bình luận
      </button>
    </form>
  {{else}}
    <p class="text-gray-600 mb-6">
      <a href="/auth/login" class="text-blue-600">Đăng nhập</a> để bình luận
    </p>
  {{/if}}
  
  {{!-- Comments List --}}
  <div class="comments-list">
    {{#each comments}}
      <!-- TODO: Implement comment display -->
      <div class="comment mb-4 p-4 border rounded-lg">
        <div class="comment-header flex justify-between items-center mb-2">
          <div class="author-info">
            <span class="font-semibold">{{author.firstName}} {{author.lastName}}</span>
            <span class="text-gray-500 text-sm">{{timeAgo createdAt}}</span>
          </div>
          {{#if (or (eq ../user.id author.id) (eq ../user.role "ADMIN"))}}
            <div class="comment-actions">
              <button class="edit-comment text-blue-600 text-sm">Sửa</button>
              <button class="delete-comment text-red-600 text-sm">Xóa</button>
            </div>
          {{/if}}
        </div>
        <div class="comment-content">
          <p>{{content}}</p>
        </div>
      </div>
    {{/each}}
  </div>
</div>
```

### Step 4: Validation Middleware
```javascript
// src/middleware/validation.js
const { body } = require('express-validator');

const validateComment = [
  body('content')
    .notEmpty()
    .withMessage('Nội dung bình luận không được để trống')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Bình luận phải từ 5-1000 ký tự')
    .trim()
    .escape(),
    
  body('postId')
    .isInt({ min: 1 })
    .withMessage('Post ID không hợp lệ'),
    
  body('parentId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Parent comment ID không hợp lệ')
];

module.exports = { validateComment };
```

### Câu hỏi kiểm tra:
1. Giải thích vai trò của từng layer trong việc xử lý comment
2. Tại sao cần validation ở cả frontend và backend?
3. Làm thế nào để prevent XSS attacks trong comment system?

---

## BÀI TẬP 2: REST API DEVELOPMENT
**Thời gian**: 45 phút  
**Độ khó**: Khó  
**Mục tiêu**: Phát triển REST API hoàn chỉnh cho mobile application

### Yêu cầu:
1. Tạo API endpoints cho Posts, Categories, Comments
2. Implement JWT authentication
3. Add pagination và filtering
4. Viết API documentation

### Step 1: API Routes Structure
```javascript
// src/routes/api/v1/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const postRoutes = require('./posts');
const categoryRoutes = require('./categories');
const commentRoutes = require('./comments');

// Authentication routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
```

### Step 2: Posts API Implementation
```javascript
// src/routes/api/v1/posts.js
const express = require('express');
const router = express.Router();
const PostController = require('../../../controllers/api/PostController');
const { authenticateToken } = require('../../../middleware/auth');

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */

// TODO: Implement GET /posts
router.get('/', PostController.index);

// TODO: Implement GET /posts/:id
router.get('/:id', PostController.show);

// TODO: Implement POST /posts (protected)
router.post('/', authenticateToken, PostController.store);

// TODO: Implement PUT /posts/:id (protected)
router.put('/:id', authenticateToken, PostController.update);

// TODO: Implement DELETE /posts/:id (protected)
router.delete('/:id', authenticateToken, PostController.destroy);

module.exports = router;
```

### Step 3: API Controller Implementation
```javascript
// src/controllers/api/PostController.js
const PostModel = require('../../models/PostModel');
const { validationResult } = require('express-validator');

class PostController {
  static async index(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        status = 'PUBLISHED'
      } = req.query;
      
      // TODO: Implement filtering and pagination
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        category,
        status
      };
      
      const result = await PostModel.findAll(options);
      
      res.json({
        success: true,
        data: result.posts,
        pagination: result.pagination,
        meta: {
          total: result.pagination.total,
          page: result.pagination.currentPage,
          pages: result.pagination.pages
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  static async show(req, res) {
    try {
      const { id } = req.params;
      
      // TODO: Implement post detail with comments
      const post = await PostModel.findById(id, {
        include: {
          author: {
            select: { id: true, username: true, firstName: true, lastName: true }
          },
          category: true,
          comments: {
            where: { status: 'APPROVED' },
            include: {
              author: {
                select: { id: true, username: true, firstName: true, lastName: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  // TODO: Implement store, update, destroy methods
}

module.exports = PostController;
```

### Step 4: JWT Authentication
```javascript
// src/middleware/apiAuth.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { authenticateToken };
```

### Step 5: API Documentation Schema
```javascript
// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic Blog API',
      version: '1.0.0',
      description: 'REST API for Dynamic Blog CMS'
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
            publishedAt: { type: 'string', format: 'date-time' },
            author: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' }
              }
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                slug: { type: 'string' }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/api/v1/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
```

### Câu hỏi kiểm tra:
1. Phân biệt giữa Web API và Web Application trong kiến trúc MVC
2. Tại sao cần versioning trong API design?
3. Giải thích cách JWT authentication hoạt động

---

## BÀI TẬP 3: ADVANCED FEATURES
**Thời gian**: 60 phút  
**Độ khó**: Rất khó  
**Mục tiêu**: Implement các tính năng nâng cao trong ứng dụng web

### Yêu cầu:
1. Full-text search với Prisma
2. File upload với validation
3. Email notification system
4. Admin dashboard với statistics

### Step 1: Full-text Search Implementation
```javascript
// Update Prisma Schema
model Post {
  id      Int     @id @default(autoincrement())
  title   String  @db.VarChar(255)
  content String? @db.Text
  
  @@fulltext([title, content])
  @@map("posts")
}

// src/models/SearchModel.js
class SearchModel {
  static async searchPosts(query, options = {}) {
    const { page = 1, limit = 10, category } = options;
    
    // TODO: Implement full-text search
    const searchResults = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              search: query
            }
          },
          {
            content: {
              search: query
            }
          }
        ],
        AND: {
          status: 'PUBLISHED',
          ...(category && { categoryId: parseInt(category) })
        }
      },
      include: {
        author: {
          select: { username: true, firstName: true, lastName: true }
        },
        category: true
      },
      orderBy: {
        _relevance: {
          fields: ['title', 'content'],
          search: query,
          sort: 'desc'
        }
      },
      skip: (page - 1) * limit,
      take: limit
    });
    
    return searchResults;
  }
  
  // TODO: Implement search suggestions
  static async getSearchSuggestions(query) {
    // Implement autocomplete suggestions
  }
}
```

### Step 2: File Upload System
```javascript
// src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = 'public/uploads/posts/';
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // TODO: Implement file type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Image processing middleware
const processImage = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const inputPath = req.file.path;
    const outputPath = inputPath.replace(/\.[^/.]+$/, '_processed.webp');
    
    // TODO: Implement image optimization
    await sharp(inputPath)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    // Update file info
    req.file.processedPath = outputPath;
    req.file.processedFilename = path.basename(outputPath);
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, processImage };
```

### Step 3: Email Notification System
```javascript
// src/services/EmailService.js
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  async sendEmail(to, subject, template, data) {
    try {
      // TODO: Load and compile template
      const templatePath = path.join(__dirname, '../templates/emails', `${template}.hbs`);
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const compiledTemplate = handlebars.compile(templateSource);
      
      const html = compiledTemplate(data);
      
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html
      };
      
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
  
  async sendCommentNotification(post, comment) {
    // TODO: Send notification to post author
    await this.sendEmail(
      post.author.email,
      `Bình luận mới trên bài viết "${post.title}"`,
      'comment-notification',
      {
        postTitle: post.title,
        postUrl: `${process.env.BASE_URL}/posts/${post.slug}`,
        commentAuthor: `${comment.author.firstName} ${comment.author.lastName}`,
        commentContent: comment.content
      }
    );
  }
  
  async sendWelcomeEmail(user) {
    // TODO: Send welcome email to new users
    await this.sendEmail(
      user.email,
      'Chào mừng bạn đến với Dynamic Blog',
      'welcome',
      {
        firstName: user.firstName,
        username: user.username,
        loginUrl: `${process.env.BASE_URL}/auth/login`
      }
    );
  }
}

module.exports = new EmailService();
```

### Step 4: Dashboard Statistics
```javascript
// src/services/StatisticsService.js
class StatisticsService {
  static async getDashboardStats() {
    try {
      // TODO: Implement dashboard statistics
      const [
        totalPosts,
        totalUsers,
        totalComments,
        publishedPosts,
        pendingComments,
        recentPosts,
        topCategories,
        monthlyStats
      ] = await Promise.all([
        // Total counts
        prisma.post.count(),
        prisma.user.count(),
        prisma.comment.count(),
        
        // Published posts
        prisma.post.count({ where: { status: 'PUBLISHED' } }),
        
        // Pending comments
        prisma.comment.count({ where: { status: 'PENDING' } }),
        
        // Recent posts (last 7 days)
        prisma.post.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          },
          include: {
            author: {
              select: { username: true, firstName: true, lastName: true }
            },
            category: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }),
        
        // Top categories by post count
        prisma.category.findMany({
          include: {
            _count: {
              select: { posts: true }
            }
          },
          orderBy: {
            posts: {
              _count: 'desc'
            }
          },
          take: 5
        }),
        
        // Monthly statistics
        this.getMonthlyStats()
      ]);
      
      return {
        overview: {
          totalPosts,
          totalUsers,
          totalComments,
          publishedPosts,
          pendingComments
        },
        recentPosts,
        topCategories,
        monthlyStats
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
  
  static async getMonthlyStats() {
    // TODO: Implement monthly statistics
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      
      const [postsCount, usersCount, commentsCount] = await Promise.all([
        prisma.post.count({
          where: {
            createdAt: { gte: startDate, lte: endDate }
          }
        }),
        prisma.user.count({
          where: {
            createdAt: { gte: startDate, lte: endDate }
          }
        }),
        prisma.comment.count({
          where: {
            createdAt: { gte: startDate, lte: endDate }
          }
        })
      ]);
      
      months.push({
        month: startDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' }),
        posts: postsCount,
        users: usersCount,
        comments: commentsCount
      });
    }
    
    return months;
  }
}

module.exports = StatisticsService;
```

### Câu hỏi kiểm tra:
1. Tại sao cần tối ưu hóa images trước khi lưu trữ?
2. Giải thích cách full-text search hoạt động trong database
3. Phân tích performance impact của real-time statistics

---

## ĐÁNH GIÁ VÀ CHẤM ĐIỂM

### Rubric cho Bài tập 1 (30 điểm):
- **Model Implementation (10 điểm)**:
  - CRUD methods correct (5 điểm)
  - Proper relationships (3 điểm)
  - Error handling (2 điểm)

- **Controller Logic (10 điểm)**:
  - Request processing (4 điểm)
  - Validation (3 điểm)
  - Response formatting (3 điểm)

- **View & Frontend (10 điểm)**:
  - UI implementation (5 điểm)
  - Form handling (3 điểm)
  - User experience (2 điểm)

### Rubric cho Bài tập 2 (35 điểm):
- **API Design (15 điểm)**:
  - RESTful principles (5 điểm)
  - Endpoint structure (5 điểm)
  - Response format (5 điểm)

- **Authentication (10 điểm)**:
  - JWT implementation (6 điểm)
  - Security measures (4 điểm)

- **Documentation (10 điểm)**:
  - Swagger/OpenAPI (6 điểm)
  - Clear examples (4 điểm)

### Rubric cho Bài tập 3 (35 điểm):
- **Advanced Features (20 điểm)**:
  - Search functionality (8 điểm)
  - File upload system (7 điểm)
  - Email service (5 điểm)

- **Performance & Optimization (10 điểm)**:
  - Database optimization (5 điểm)
  - Image processing (3 điểm)
  - Caching strategy (2 điểm)

- **Code Quality (5 điểm)**:
  - Clean code practices (3 điểm)
  - Error handling (2 điểm)

### Bonus Points (10 điểm):
- Unit tests implementation (5 điểm)
- Additional security features (3 điểm)
- Creative improvements (2 điểm)

**Tổng điểm**: 100 điểm + 10 điểm bonus

---

*Các bài tập này được thiết kế để sinh viên thực hành từ cơ bản đến nâng cao, đảm bảo hiểu sâu về MVC pattern và ORM usage trong thực tế.*
