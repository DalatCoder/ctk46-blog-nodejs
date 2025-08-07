# SLIDE THUYẾT TRÌNH: KIẾN TRÚC MVC VÀ ORM

## SLIDE 1: GIỚI THIỆU KHÓA HỌC
```
WEB DEVELOPMENT NÂNG CAO
Kiến trúc MVC & Object-Relational Mapping (ORM)

🎯 Đối tượng: Sinh viên năm 4 - Kỹ thuật phần mềm
⏱️ Thời gian: 4 tiết (180 phút)
💻 Demo Project: Dynamic Node.js CMS/Blog System
```

---

## SLIDE 2: MỤC TIÊU BÀI HỌC
```
KNOWLEDGE (Kiến thức)
✅ Hiểu rõ khái niệm và nguyên lý MVC Pattern
✅ Nắm vững ORM và cách map Object ↔ Database
✅ Phân biệt các layer trong MVC architecture

SKILLS (Kỹ năng)
✅ Thiết kế & implement MVC trong Node.js
✅ Sử dụng Prisma ORM hiệu quả
✅ Debug và maintain ứng dụng MVC

ATTITUDE (Thái độ)
✅ Tư duy có hệ thống trong thiết kế phần mềm
✅ Chú trọng clean code & best practices
```

---

## SLIDE 3: TẠI SAO CẦN MVC?
```
PROBLEMS WITHOUT MVC:
❌ Spaghetti Code - logic lẫn lộn
❌ Khó maintain và scale
❌ Không thể test riêng biệt
❌ Team work khó khăn
❌ Code duplication

SOLUTIONS WITH MVC:
✅ Separation of Concerns
✅ Maintainable & Scalable
✅ Testable components
✅ Team collaboration
✅ Code reusability
```

---

## SLIDE 4: MVC PATTERN OVERVIEW
```
┌─────────────┐    HTTP Request    ┌────────────────┐
│   Browser   │ ──────────────────▶│   Controller   │
│   (Client)  │                    │  (Dispatcher)  │
└─────────────┘                    └────────────────┘
      ▲                                     │
      │ HTTP Response                       ▼
      │ (HTML/JSON)                  ┌─────────────┐
      │                              │    Model    │
      └──────────────────────────────│ (Data Logic)│
                                     └─────────────┘
                                             │
                                             ▼
                                     ┌─────────────┐
                                     │    View     │
                                     │(Presentation)│
                                     └─────────────┘
```

---

## SLIDE 5: MODEL LAYER
```
RESPONSIBILITIES:
🔸 Business Logic & Data Validation
🔸 Database Operations (CRUD)
🔸 Data Processing & Transformation
🔸 Independent of UI & Request handling

EXAMPLE - PostModel.js:
class PostModel {
  static async create(postData) {
    // Generate slug
    if (!postData.slug) {
      postData.slug = slugify(postData.title);
    }
    
    // Calculate reading time
    const wordCount = postData.content.split(/\s+/).length;
    postData.readingTime = Math.ceil(wordCount / 200);
    
    return await prisma.post.create({ data: postData });
  }
}
```

---

## SLIDE 6: VIEW LAYER
```
RESPONSIBILITIES:
🔸 User Interface Presentation
🔸 Display data from Model
🔸 Collect user input
🔸 NO Business Logic

EXAMPLE - Handlebars Template:
{{#each posts}}
  <article class="post-card">
    <h2>{{title}}</h2>
    <p>{{substring content 100}}</p>
    <div class="meta">
      <span>{{formatDate publishedAt}}</span>
      <span>{{readingTime}} phút đọc</span>
    </div>
  </article>
{{/each}}
```

---

## SLIDE 7: CONTROLLER LAYER
```
RESPONSIBILITIES:
🔸 Handle HTTP Requests
🔸 Input Validation & Processing
🔸 Call appropriate Model methods
🔸 Select View & pass data

EXAMPLE - PostController.js:
class PostController {
  static async index(req, res) {
    const { page = 1, search } = req.query;
    
    // Call Model
    const result = await PostModel.findAll({ page, search });
    
    // Render View
    res.render('posts/index', {
      posts: result.posts,
      pagination: result.pagination
    });
  }
}
```

---

## SLIDE 8: REQUEST FLOW
```
1. User clicks "Xem bài viết" 
   ↓
2. Router: GET /posts → PostController.index
   ↓
3. Middleware: Authentication, Validation
   ↓
4. Controller: Process request, validate input
   ↓
5. Model: PostModel.findAll() → Database query
   ↓
6. Database: Return posts data
   ↓
7. Model: Process & return formatted data
   ↓
8. Controller: Select view, pass data
   ↓
9. View: Render HTML with posts data
   ↓
10. Response: HTML sent to browser
```

---

## SLIDE 9: WHAT IS ORM?
```
OBJECT-RELATIONAL MAPPING

JavaScript Objects          Database Tables
┌─────────────────┐         ┌─────────────────────┐
│   const user = {│         │ CREATE TABLE users (│
│     id: 1,      │ ◄─────► │   id INT PRIMARY,   │
│     name: "John"│   ORM   │   name VARCHAR(50)  │
│   }             │         │ );                  │
└─────────────────┘         └─────────────────────┘

user.save()          →      INSERT INTO users...
User.findAll()       →      SELECT * FROM users
user.update()        →      UPDATE users SET...
```

---

## SLIDE 10: WHY USE ORM?
```
ADVANTAGES:
✅ Database Agnostic (MySQL → PostgreSQL)
✅ Type Safety & Validation
✅ Auto-generated Queries
✅ Migration Management
✅ Security (SQL Injection protection)
✅ Developer Productivity

DISADVANTAGES:
❌ Performance Overhead
❌ Learning Curve
❌ Complex Queries limitations
❌ "Magic" - Hidden implementation
```

---

## SLIDE 11: PRISMA ORM FEATURES
```
🔥 TYPE-SAFE DATABASE CLIENT
🔥 AUTO-GENERATED QUERIES
🔥 MIGRATION SYSTEM
🔥 REAL-TIME TYPE GENERATION
🔥 MULTIPLE DATABASE SUPPORT

// Schema Definition
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  posts    Post[]
  @@map("users")
}

// Generated Client
const user = await prisma.user.create({
  data: { email: "john@example.com" },
  include: { posts: true }
});
```

---

## SLIDE 12: PRISMA SCHEMA
```
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Post {
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(255)
  content     String?   @db.Text
  status      PostStatus @default(DRAFT)
  
  // Relations
  authorId    Int
  author      User      @relation(fields: [authorId], references: [id])
  
  @@map("posts")
}
```

---

## SLIDE 13: ORM vs RAW SQL
```
RAW SQL:
const posts = await db.query(`
  SELECT p.*, u.username, c.name as category
  FROM posts p
  JOIN users u ON p.author_id = u.id
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE p.status = 'PUBLISHED'
  ORDER BY p.created_at DESC
  LIMIT ${limit} OFFSET ${offset}
`);

PRISMA ORM:
const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' },
  include: {
    author: { select: { username: true } },
    category: { select: { name: true } }
  },
  orderBy: { createdAt: 'desc' },
  take: limit,
  skip: offset
});
```

---

## SLIDE 14: PROJECT STRUCTURE
```
src/
├── controllers/          # 🎮 Request Handlers
│   ├── PostController.js
│   ├── UserController.js
│   └── AdminController.js
├── models/              # 📊 Data Logic
│   ├── PostModel.js
│   ├── UserModel.js
│   └── CategoryModel.js
├── views/               # 🎨 UI Templates
│   ├── layouts/
│   ├── frontend/
│   └── admin/
├── routes/              # 🛣️ URL Routing
│   ├── frontend.js
│   └── admin.js
├── middleware/          # 🛡️ Request Processing
│   ├── auth.js
│   └── validation.js
└── config/              # ⚙️ Configuration
    └── database.js
```

---

## SLIDE 15: MIDDLEWARE PATTERN
```
REQUEST PIPELINE:

HTTP Request
    ↓
┌─────────────────┐
│  Authentication │ ← Check if user logged in
└─────────────────┘
    ↓
┌─────────────────┐
│  Authorization  │ ← Check user permissions
└─────────────────┘
    ↓
┌─────────────────┐
│   Validation    │ ← Validate input data
└─────────────────┘
    ↓
┌─────────────────┐
│   Controller    │ ← Business logic
└─────────────────┘
    ↓
HTTP Response
```

---

## SLIDE 16: ADVANCED PATTERNS
```
REPOSITORY PATTERN:
- Abstraction layer over data access
- Easier testing with mock repositories
- Consistent data access interface

SERVICE LAYER:
- Complex business logic
- Orchestrate multiple models
- Transaction management

DTO (Data Transfer Objects):
- Data validation & transformation
- API request/response formatting
- Type safety
```

---

## SLIDE 17: SECURITY BEST PRACTICES
```
🔒 AUTHENTICATION & AUTHORIZATION
🔒 INPUT VALIDATION & SANITIZATION
🔒 SQL INJECTION PREVENTION (ORM)
🔒 XSS PROTECTION
🔒 CSRF PROTECTION
🔒 RATE LIMITING
🔒 SECURE HEADERS
🔒 PASSWORD HASHING

Example:
const hashedPassword = await bcrypt.hash(password, 12);
const sanitizedContent = DOMPurify.sanitize(userInput);
```

---

## SLIDE 18: PERFORMANCE OPTIMIZATION
```
DATABASE LEVEL:
✅ Proper Indexing
✅ Query Optimization
✅ Connection Pooling
✅ Avoid N+1 Queries

APPLICATION LEVEL:
✅ Caching (Redis, Memory)
✅ Pagination
✅ Lazy Loading
✅ CDN for static assets

PRISMA OPTIMIZATIONS:
prisma.post.findMany({
  select: { id: true, title: true }, // Select only needed fields
  include: { author: true },         // Include relations
  take: 10                          // Limit results
});
```

---

## SLIDE 19: TESTING STRATEGIES
```
UNIT TESTING:
✅ Test Models individually
✅ Mock database connections
✅ Test business logic

INTEGRATION TESTING:
✅ Test Controller + Model + Database
✅ Test API endpoints
✅ Test authentication flows

E2E TESTING:
✅ Test complete user workflows
✅ Test UI interactions
✅ Test cross-browser compatibility
```

---

## SLIDE 20: THỰC HÀNH
```
BÀI TẬP 1: COMMENT SYSTEM (30 phút)
- Tạo CommentModel với CRUD operations
- Implement CommentController
- Tạo view hiển thị comments
- Thêm validation và authorization

BÀI TẬP 2: REST API (45 phút)
- Tạo API endpoints cho Posts, Categories
- Implement JWT authentication
- Add pagination và filtering
- Viết API documentation

BÀI TẬP 3: ADVANCED FEATURES (60 phút)
- Full-text search
- File upload system
- Email notifications
- Dashboard analytics
```

---

## SLIDE 21: ĐÁNH GIÁ
```
TIÊU CHÍ ĐÁNH GIÁ:

📚 LÝ THUYẾT (30%):
- Giải thích MVC components
- So sánh ORM vs SQL
- Phân tích ưu/nhược điểm

💻 THỰC HÀNH (40%):
- Code theo chuẩn MVC
- Sử dụng ORM hiệu quả
- Implement yêu cầu chức năng

🔧 CODE QUALITY (20%):
- Clean code, readable
- Error handling tốt
- Security best practices

👥 TEAMWORK (10%):
- Collaboration hiệu quả
- Documentation đầy đủ
```

---

## SLIDE 22: TÀI LIỆU THAM KHẢO
```
📚 BOOKS:
- Node.js Design Patterns - Mario Casciaro
- Clean Architecture - Robert C. Martin
- Patterns of Enterprise Application Architecture

🌐 DOCUMENTATION:
- Prisma: https://www.prisma.io/docs
- Express.js: https://expressjs.com
- Node.js: https://nodejs.org

🛠️ TOOLS:
- VS Code với extensions
- Prisma Studio (Database GUI)
- Postman (API Testing)
- GitHub (Version Control)
```

---

## SLIDE 23: NEXT STEPS
```
TIẾP THEO TRONG KHÓA HỌC:

🔮 WEEK 2: Advanced Node.js & API Design
🔮 WEEK 3: Frontend Frameworks Integration
🔮 WEEK 4: Microservices Architecture
🔮 WEEK 5: DevOps & Deployment
🔮 WEEK 6: Performance & Security
🔮 WEEK 7: Real-time Applications
🔮 WEEK 8: Final Project Presentation
```

---

## SLIDE 24: Q&A
```
💬 QUESTIONS & ANSWERS

Có câu hỏi nào về:
- MVC Pattern implementation?
- ORM usage và best practices?
- Project structure organization?
- Security considerations?
- Performance optimization?

📧 Contact: instructor@university.edu
💬 Discord: Web Dev Advanced Class
📚 Materials: GitHub repository
```

---

*Slides được thiết kế cho việc thuyết trình với thời gian 180 phút, bao gồm cả thời gian thực hành và Q&A. Mỗi slide nên được trình bày trong 5-10 phút với các ví dụ code cụ thể và demo trực tiếp.*
