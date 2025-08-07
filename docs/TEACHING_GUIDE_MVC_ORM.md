# BÀI GIẢNG: KIẾN TRÚC MVC VÀ ORM TRONG WEB DEVELOPMENT

## THÔNG TIN KHÓA HỌC
- **Môn học**: Web Development Nâng Cao
- **Đối tượng**: Sinh viên năm 4, Chuyên ngành Kỹ thuật Phần mềm
- **Thời gian**: 4 tiết (180 phút)
- **Dự án demo**: Dynamic Node.js CMS/Blog System

---

## I. MỤC TIÊU BÀI HỌC

### 1. Kiến thức (Knowledge)
- Hiểu rõ khái niệm và nguyên lý hoạt động của kiến trúc MVC
- Nắm vững khái niệm ORM và các ưu điểm trong phát triển ứng dụng
- Phân biệt được các layer trong kiến trúc MVC
- Hiểu được cách ORM map object-oriented programming với relational database

### 2. Kỹ năng (Skills)
- Thiết kế và implement kiến trúc MVC trong Node.js project
- Sử dụng Prisma ORM để tương tác với database
- Tổ chức code theo chuẩn MVC pattern
- Debug và maintain ứng dụng có cấu trúc MVC

### 3. Thái độ (Attitude)
- Tư duy logic và có hệ thống trong việc thiết kế phần mềm
- Chú trọng đến clean code và best practices
- Khả năng làm việc nhóm và documentation

---

## II. NỘI DUNG CHI TIẾT

### PHẦN 1: GIỚI THIỆU KIẾN TRÚC MVC (30 phút)

#### 1.1 Khái niệm MVC Pattern

**Model-View-Controller (MVC)** là một architectural pattern phổ biến trong phát triển phần mềm, đặc biệt là web applications. MVC chia ứng dụng thành 3 thành phần chính:

```
┌─────────────┐    HTTP Request    ┌────────────────┐
│   Browser   │ ──────────────────▶│   Controller   │
│   (Client)  │                    │  (Dispatcher)  │
└─────────────┘                    └────────────────┘
      ▲                                     │
      │                                     ▼
      │ HTTP Response                ┌─────────────┐
      │ (HTML/JSON)                  │    Model    │
      │                              │ (Data Logic)│
      └──────────────────────────────└─────────────┘
                                             │
                                             ▼
                                     ┌─────────────┐
                                     │    View     │
                                     │(Presentation)│
                                     └─────────────┘
```

#### 1.2 Các thành phần của MVC

**A. Model (Mô hình dữ liệu)**
- Chịu trách nhiệm về logic nghiệp vụ và dữ liệu
- Tương tác trực tiếp với database
- Validate và xử lý dữ liệu
- Độc lập với View và Controller

**Ví dụ từ dự án:**
```javascript
// src/models/PostModel.js
class PostModel {
  static async create(postData) {
    // Validate và xử lý dữ liệu
    const { tags, ...otherData } = postData;
    
    // Generate slug nếu chưa có
    if (!otherData.slug) {
      otherData.slug = slugify(otherData.title, { lower: true, strict: true });
    }
    
    // Tính toán reading time
    if (otherData.content) {
      const wordCount = otherData.content.split(/\s+/).length;
      otherData.readingTime = Math.ceil(wordCount / 200);
    }
    
    // Tương tác với database qua Prisma ORM
    return await prisma.post.create({
      data: otherData,
      include: {
        author: { select: { id: true, username: true } },
        category: true
      }
    });
  }
}
```

**B. View (Giao diện người dùng)**
- Hiển thị dữ liệu cho người dùng
- Nhận input từ người dùng
- Không chứa business logic
- Có thể là HTML templates, JSON response, hoặc UI components

**Ví dụ từ dự án:**
```handlebars
{{!-- src/views/admin/posts.hbs --}}
<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
      Quản lý bài viết
    </h3>
  </div>
  
  <div class="p-6">
    {{#each posts}}
      <div class="border-b pb-4 mb-4">
        <h4 class="font-semibold">{{title}}</h4>
        <p class="text-gray-600">{{substring content 100}}</p>
        <div class="mt-2">
          <span class="badge badge-{{status}}">{{status}}</span>
          <span class="text-sm text-gray-500">{{formatDate createdAt}}</span>
        </div>
      </div>
    {{/each}}
  </div>
</div>
```

**C. Controller (Bộ điều khiển)**
- Nhận request từ user
- Xử lý input và gọi Model
- Chọn View phù hợp để hiển thị
- Điều phối giữa Model và View

**Ví dụ từ dự án:**
```javascript
// src/controllers/PostController.js
class PostController {
  static async index(req, res) {
    try {
      const { page = 1, limit = 10, search, category, status } = req.query;
      
      // Gọi Model để lấy dữ liệu
      const result = await PostModel.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        category,
        status
      });
      
      // Chọn View và truyền dữ liệu
      res.render('frontend/posts/index', {
        title: 'Danh sách bài viết',
        posts: result.posts,
        pagination: result.pagination,
        currentPage: parseInt(page)
      });
    } catch (error) {
      console.error('Error in PostController.index:', error);
      res.status(500).render('frontend/error', {
        title: 'Lỗi hệ thống',
        message: 'Không thể tải danh sách bài viết'
      });
    }
  }
}
```

#### 1.3 Ưu điểm của MVC Pattern

1. **Separation of Concerns**: Tách biệt rõ ràng các concerns
2. **Maintainability**: Dễ bảo trì và mở rộng
3. **Testability**: Dễ dàng unit test từng component
4. **Reusability**: Có thể tái sử dụng Model và Controller
5. **Team Development**: Nhiều developer có thể làm việc song song

#### 1.4 Cấu trúc thư mục trong dự án

```
src/
├── controllers/          # Controller layer
│   ├── AdminController.js
│   ├── PostController.js
│   ├── UserController.js
│   └── AuthController.js
├── models/              # Model layer  
│   ├── PostModel.js
│   ├── UserModel.js
│   ├── CategoryModel.js
│   └── CommentModel.js
├── views/               # View layer
│   ├── layouts/
│   ├── admin/
│   ├── frontend/
│   └── partials/
├── routes/              # URL routing
│   ├── admin.js
│   ├── auth.js
│   └── frontend.js
├── middleware/          # Middleware functions
│   ├── auth.js
│   └── validation.js
└── config/              # Configuration
    └── database.js
```

---

### PHẦN 2: OBJECT-RELATIONAL MAPPING (ORM) (40 phút)

#### 2.1 Khái niệm ORM

**Object-Relational Mapping (ORM)** là một kỹ thuật lập trình cho phép:
- Map giữa objects trong OOP và tables trong relational database
- Thao tác với database thông qua objects thay vì SQL queries
- Tự động generate SQL queries từ method calls

```
Object-Oriented World          Relational Database World
┌─────────────────┐           ┌─────────────────────┐
│   JavaScript    │           │       MySQL         │
│    Objects      │ ◄────────► │      Tables         │
│                 │    ORM    │                     │
│ user.save()     │           │ INSERT INTO users   │
│ post.findAll()  │           │ SELECT * FROM posts │
└─────────────────┘           └─────────────────────┘
```

#### 2.2 Tại sao sử dụng ORM?

**Ưu điểm:**
1. **Database Agnostic**: Có thể chuyển đổi database dễ dàng
2. **Type Safety**: TypeScript support và validation
3. **Migration Management**: Quản lý schema changes
4. **Query Optimization**: Tự động optimize queries
5. **Security**: Tránh SQL injection attacks
6. **Developer Productivity**: Viết code nhanh hơn

**Nhược điểm:**
1. **Performance Overhead**: Chậm hơn raw SQL
2. **Learning Curve**: Cần học ORM-specific syntax
3. **Complex Queries**: Khó implement complex business logic
4. **Magic**: Ẩn đi implementation details

#### 2.3 Prisma ORM trong dự án

**A. Schema Definition**
```prisma
// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique @db.VarChar(50)
  email     String   @unique @db.VarChar(100)
  firstName String   @db.VarChar(50)
  lastName  String   @db.VarChar(50)
  password  String   @db.VarChar(255)
  role      UserRole @default(USER)
  status    UserStatus @default(ACTIVE)
  
  // Relationships
  posts     Post[]
  comments  Comment[]
  
  @@map("users")
}

model Post {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  slug        String   @unique @db.VarChar(255)
  content     String?  @db.Text
  excerpt     String?  @db.VarChar(500)
  featuredImage String? @db.VarChar(255)
  status      PostStatus @default(DRAFT)
  readingTime Int?     @default(0)
  
  // Foreign keys
  authorId    Int
  categoryId  Int?
  
  // Relationships
  author      User     @relation(fields: [authorId], references: [id])
  category    Category? @relation(fields: [categoryId], references: [id])
  comments    Comment[]
  
  @@map("posts")
}
```

**B. Model Implementation**
```javascript
// src/models/UserModel.js
const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create new user
  static async create(userData) {
    const { password, ...otherData } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    return await prisma.user.create({
      data: {
        ...otherData,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true
      }
    });
  }
  
  // Find user with pagination and filters
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      orderBy = 'createdAt',
      orderDir = 'desc'
    } = options;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } }
      ];
    }
    
    if (role) where.role = role;
    if (status) where.status = status;
    
    // Execute queries
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              comments: true
            }
          }
        },
        orderBy: { [orderBy]: orderDir },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);
    
    return {
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    };
  }
}
```

#### 2.4 Database Configuration

```javascript
// src/config/database.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty'
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
```

#### 2.5 Migration và Seeding

**A. Database Migration**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create and run migration
npx prisma migrate dev --name init

# Reset database
npx prisma migrate reset
```

**B. Database Seeding**
```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });
  
  // Seed categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology trends and news'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming tutorials and tips'
      }
    })
  ]);
  
  // Seed posts
  await prisma.post.create({
    data: {
      title: 'Introduction to Node.js',
      slug: 'introduction-to-nodejs',
      content: 'Node.js is a JavaScript runtime...',
      excerpt: 'Learn the basics of Node.js development',
      status: 'PUBLISHED',
      authorId: admin.id,
      categoryId: categories[1].id,
      publishedAt: new Date()
    }
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

### PHẦN 3: THỰC HÀNH VỚI DỰ ÁN DEMO (60 phút)

#### 3.1 Phân tích kiến trúc dự án

**A. Flow xử lý request**
```
1. User Request → 2. Router → 3. Middleware → 4. Controller → 5. Model → 6. Database
                                                     ↓
7. Response ← 8. View ← 9. Controller ← 10. Model ← 11. Database
```

**B. Ví dụ cụ thể: Tạo bài viết mới**

```javascript
// 1. Route definition (src/routes/admin.js)
router.post('/posts', 
  requireAuth,           // Middleware: Authentication
  requireAdmin,          // Middleware: Authorization  
  validatePost,          // Middleware: Validation
  PostController.store   // Controller: Business logic
);

// 2. Controller xử lý request (src/controllers/PostController.js)
class PostController {
  static async store(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      // Prepare data
      const postData = {
        ...req.body,
        authorId: req.user.id,
        featuredImage: req.file ? `/uploads/posts/${req.file.filename}` : null
      };
      
      // Call Model to save data
      const post = await PostModel.create(postData);
      
      // Return response
      res.status(201).json({
        success: true,
        message: 'Bài viết đã được tạo thành công',
        data: post
      });
      
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi hệ thống, vui lòng thử lại'
      });
    }
  }
}

// 3. Model thực hiện database operations (src/models/PostModel.js)
class PostModel {
  static async create(postData) {
    // Business logic: Generate slug
    if (!postData.slug) {
      postData.slug = slugify(postData.title, { lower: true, strict: true });
    }
    
    // Business logic: Calculate reading time
    if (postData.content) {
      const wordCount = postData.content.split(/\s+/).length;
      postData.readingTime = Math.ceil(wordCount / 200);
    }
    
    // Database operation via Prisma ORM
    return await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true }
        },
        category: true
      }
    });
  }
}
```

#### 3.2 Middleware Pattern

Middleware là các function được execute theo thứ tự trong request-response cycle:

```javascript
// src/middleware/auth.js
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập'
    });
  }
  
  req.user = req.session.user;
  next(); // Chuyển đến middleware tiếp theo
};

const requireAdmin = (req, res, next) => {
  if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập'
    });
  }
  
  next();
};

// src/middleware/validation.js
const { body } = require('express-validator');

const validatePost = [
  body('title')
    .notEmpty()
    .withMessage('Tiêu đề là bắt buộc')
    .isLength({ min: 5, max: 255 })
    .withMessage('Tiêu đề phải từ 5-255 ký tự'),
    
  body('content')
    .notEmpty()
    .withMessage('Nội dung là bắt buộc')
    .isLength({ min: 10 })
    .withMessage('Nội dung phải ít nhất 10 ký tự'),
    
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Danh mục không hợp lệ')
];
```

#### 3.3 View Layer với Handlebars

**A. Layout System**
```handlebars
{{!-- src/views/layouts/main.hbs --}}
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - Dynamic Blog</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
    {{> header}}
    
    <main>
        {{{body}}}
    </main>
    
    {{> footer}}
</body>
</html>
```

**B. Template với Helper Functions**
```handlebars
{{!-- src/views/frontend/posts/index.hbs --}}
<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{title}}</h1>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {{#each posts}}
            <article class="bg-white rounded-lg shadow-md overflow-hidden">
                {{#if featuredImage}}
                    <img src="{{featuredImage}}" alt="{{title}}" class="w-full h-48 object-cover">
                {{/if}}
                
                <div class="p-6">
                    <h2 class="text-xl font-semibold mb-2">
                        <a href="/posts/{{slug}}" class="hover:text-blue-600">{{title}}</a>
                    </h2>
                    
                    <p class="text-gray-600 mb-4">{{substring excerpt 100}}</p>
                    
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>{{formatDate publishedAt}}</span>
                        <span>{{readingTime}} phút đọc</span>
                    </div>
                </div>
            </article>
        {{/each}}
    </div>
    
    {{!-- Pagination --}}
    {{#if pagination.pages}}
        <nav class="mt-8">
            <div class="flex justify-center">
                {{#if pagination.hasPrev}}
                    <a href="?page={{pagination.prevPage}}" class="px-4 py-2 bg-blue-600 text-white rounded">
                        Trang trước
                    </a>
                {{/if}}
                
                <span class="px-4 py-2">
                    Trang {{pagination.currentPage}} / {{pagination.pages}}
                </span>
                
                {{#if pagination.hasNext}}
                    <a href="?page={{pagination.nextPage}}" class="px-4 py-2 bg-blue-600 text-white rounded">
                        Trang sau
                    </a>
                {{/if}}
            </div>
        </nav>
    {{/if}}
</div>
```

**C. Custom Helper Functions**
```javascript
// src/utils/viewHelpers.js
const moment = require('moment');

module.exports = {
  formatDate: (date) => {
    return moment(date).format('DD/MM/YYYY');
  },
  
  timeAgo: (date) => {
    return moment(date).fromNow();
  },
  
  eq: (a, b) => a === b,
  
  substring: (str, length) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  },
  
  readingTime: (content) => {
    if (!content) return 0;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }
};
```

---

### PHẦN 4: ADVANCED PATTERNS VÀ BEST PRACTICES (40 phút)

#### 4.1 Repository Pattern

Repository Pattern cung cấp một abstraction layer giữa business logic và data access:

```javascript
// src/repositories/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  
  async findAll(options = {}) {
    const { page = 1, limit = 10, where = {}, include = {}, orderBy = {} } = options;
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.model.findMany({
        where,
        include,
        orderBy,
        skip,
        take: limit
      }),
      this.model.count({ where })
    ]);
    
    return {
      items,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    };
  }
  
  async findById(id, include = {}) {
    return await this.model.findUnique({
      where: { id },
      include
    });
  }
  
  async create(data) {
    return await this.model.create({ data });
  }
  
  async update(id, data) {
    return await this.model.update({
      where: { id },
      data
    });
  }
  
  async delete(id) {
    return await this.model.delete({
      where: { id }
    });
  }
}

// src/repositories/PostRepository.js
class PostRepository extends BaseRepository {
  constructor() {
    super(prisma.post);
  }
  
  async findPublished(options = {}) {
    return await this.findAll({
      ...options,
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        ...options.where
      },
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true }
        },
        category: true,
        _count: {
          select: { comments: true }
        }
      }
    });
  }
  
  async findBySlug(slug) {
    return await this.model.findUnique({
      where: { slug },
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
  }
}
```

#### 4.2 Service Layer Pattern

Service Layer chứa business logic phức tạp:

```javascript
// src/services/PostService.js
class PostService {
  constructor() {
    this.postRepository = new PostRepository();
  }
  
  async createPost(postData, authorId) {
    // Validate business rules
    await this.validatePostData(postData);
    
    // Process data
    const processedData = await this.processPostData(postData, authorId);
    
    // Create post
    const post = await this.postRepository.create(processedData);
    
    // Post-creation tasks
    await this.afterPostCreated(post);
    
    return post;
  }
  
  async validatePostData(data) {
    // Check if category exists
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });
      
      if (!category) {
        throw new Error('Category not found');
      }
    }
    
    // Check slug uniqueness
    if (data.slug) {
      const existing = await prisma.post.findUnique({
        where: { slug: data.slug }
      });
      
      if (existing) {
        throw new Error('Slug already exists');
      }
    }
  }
  
  async processPostData(data, authorId) {
    const processedData = { ...data, authorId };
    
    // Generate slug if not provided
    if (!processedData.slug) {
      processedData.slug = await this.generateUniqueSlug(data.title);
    }
    
    // Generate excerpt if not provided
    if (!processedData.excerpt && data.content) {
      processedData.excerpt = this.generateExcerpt(data.content);
    }
    
    // Calculate reading time
    if (data.content) {
      processedData.readingTime = this.calculateReadingTime(data.content);
    }
    
    // Set published date for published posts
    if (data.status === 'PUBLISHED' && !data.publishedAt) {
      processedData.publishedAt = new Date();
    }
    
    return processedData;
  }
  
  async generateUniqueSlug(title) {
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }
  
  generateExcerpt(content, length = 200) {
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
  
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
  
  async afterPostCreated(post) {
    // Send notifications, update cache, etc.
    console.log(`Post created: ${post.title} (ID: ${post.id})`);
  }
}
```

#### 4.3 Error Handling Strategy

```javascript
// src/utils/errors.js
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error
  console.error(err);
  
  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400, 'DUPLICATE_FIELD');
  }
  
  if (err.code === 'P2025') {
    const message = 'Record not found';
    error = new NotFoundError();
  }
  
  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    code: error.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { AppError, ValidationError, NotFoundError, UnauthorizedError, errorHandler };
```

#### 4.4 API Versioning và Documentation

```javascript
// src/routes/api/v1/posts.js
const express = require('express');
const router = express.Router();

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
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
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
router.get('/', async (req, res) => {
  try {
    const postService = new PostService();
    const result = await postService.getPublishedPosts(req.query);
    
    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

---

### PHẦN 5: SECURITY VÀ PERFORMANCE (20 phút)

#### 5.1 Security Best Practices

**A. Authentication & Authorization**
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

**B. Input Validation & Sanitization**
```javascript
// src/middleware/validation.js
const { body, validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');

const sanitizeHTML = (req, res, next) => {
  if (req.body.content) {
    req.body.content = DOMPurify.sanitize(req.body.content);
  }
  next();
};

const validatePost = [
  body('title')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 255 })
    .withMessage('Title must be between 5-255 characters'),
    
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
    
  sanitizeHTML
];
```

#### 5.2 Performance Optimization

**A. Database Optimization**
```javascript
// Indexing trong Prisma Schema
model Post {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(255)
  slug      String   @unique @db.VarChar(255)
  content   String?  @db.Text
  status    PostStatus @default(DRAFT)
  
  // Indexes
  @@index([status, publishedAt])
  @@index([authorId])
  @@index([categoryId])
  @@fulltext([title, content]) // Full-text search
}

// Efficient queries
class PostModel {
  static async findPublishedWithPagination(options) {
    const { page = 1, limit = 10 } = options;
    
    return await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        readingTime: true,
        author: {
          select: { username: true, firstName: true, lastName: true }
        },
        category: {
          select: { name: true, slug: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });
  }
}
```

**B. Caching Strategy**
```javascript
// src/middleware/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    res.originalJson = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.originalJson(body);
    };
    
    next();
  };
};

// Usage
router.get('/posts', cacheMiddleware(300), PostController.index);
```

---

## III. BÀI TẬP THỰC HÀNH

### Bài tập 1: Implement Comment System (30 phút)
Sinh viên sẽ implement một hệ thống comment hoàn chỉnh:

1. Tạo CommentModel với các phương thức CRUD
2. Implement CommentController với validation
3. Tạo view để hiển thị và thêm comment
4. Thêm middleware để kiểm tra quyền sở hữu comment

### Bài tập 2: API Development (45 phút)
Phát triển REST API cho mobile app:

1. Tạo API endpoints cho Posts, Categories, Comments
2. Implement JWT authentication
3. Add pagination và filtering
4. Viết API documentation

### Bài tập 3: Advanced Features (60 phút)
Implement các tính năng nâng cao:

1. Full-text search với Prisma
2. File upload với validation
3. Email notification system
4. Admin dashboard với statistics

---

## IV. ĐÁNH GIÁ VÀ KIỂM TRA

### Tiêu chí đánh giá:
1. **Hiểu biết lý thuyết (30%)**
   - Giải thích được các thành phần của MVC
   - Phân biệt được ORM vs SQL
   - Nêu được ưu/nhược điểm của từng pattern

2. **Kỹ năng thực hành (40%)**
   - Code theo đúng chuẩn MVC
   - Sử dụng ORM hiệu quả
   - Implement các feature được yêu cầu

3. **Code quality (20%)**
   - Clean code, readable
   - Error handling
   - Security best practices

4. **Team work & Documentation (10%)**
   - Làm việc nhóm hiệu quả
   - Documentation đầy đủ

### Câu hỏi kiểm tra mẫu:

**Lý thuyết:**
1. So sánh ưu/nhược điểm giữa Active Record và Data Mapper pattern
2. Giải thích N+1 query problem và cách giải quyết
3. Phân tích security vulnerabilities trong web applications

**Thực hành:**
1. Implement một feature hoàn chỉnh theo MVC pattern
2. Optimize một query phức tạp
3. Debug và fix lỗi trong hệ thống

---

## V. TÀI LIỆU THAM KHẢO

### Sách và tài liệu:
1. "Node.js Design Patterns" - Mario Casciaro
2. "Clean Architecture" - Robert C. Martin
3. "Patterns of Enterprise Application Architecture" - Martin Fowler
4. Prisma Documentation: https://www.prisma.io/docs
5. Express.js Guide: https://expressjs.com/en/guide

### Công cụ và framework:
1. Node.js: https://nodejs.org
2. Prisma ORM: https://www.prisma.io
3. Express.js: https://expressjs.com
4. Handlebars: https://handlebarsjs.com
5. MySQL: https://www.mysql.com

### Best practices và guidelines:
1. Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
2. MDN Web Docs: https://developer.mozilla.org
3. OWASP Security Guidelines: https://owasp.org

---

*Tài liệu này được biên soạn cho môn Web Development Nâng Cao, dành cho sinh viên năm 4 chuyên ngành Kỹ thuật Phần mềm. Nội dung được cập nhật theo xu hướng công nghệ mới nhất và thực tiễn trong ngành.*
