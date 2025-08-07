# GIÁO TRÌNH: KIẾN TRÚC MVC VÀ ORM TRONG WEB DEVELOPMENT

## THÔNG TIN GIÁO TRÌNH

**Tên môn học:** Web Development Nâng Cao  
**Mã môn học:** CSE401  
**Số tín chỉ:** 3 (2-1-0)  
**Đối tượng:** Sinh viên năm 4, Chuyên ngành Kỹ thuật Phần mềm  
**Điều kiện tiên quyết:** Web Programming Fundamentals, Database Systems  
**Thời gian:** 15 tuần x 3 tiết/tuần = 45 tiết

---

## MỤC TIÊU GIÁO TRÌNH

### 1. Mục tiêu chung
Trang bị cho sinh viên kiến thức và kỹ năng về:
- Kiến trúc phần mềm trong web development
- Design patterns trong lập trình web
- Object-Relational Mapping và database optimization
- Best practices trong phát triển ứng dụng web quy mô lớn

### 2. Mục tiêu cụ thể

**Về kiến thức:**
- Hiểu sâu về MVC architectural pattern và các biến thể
- Nắm vững nguyên lý và cách sử dụng ORM
- Biết các design patterns phổ biến trong web development
- Hiểu về security, performance, và scalability

**Về kỹ năng:**
- Thiết kế và implement ứng dụng web theo kiến trúc MVC
- Sử dụng ORM để tương tác với database hiệu quả
- Debug và optimize performance của web applications
- Làm việc nhóm trong dự án phát triển phần mềm

**Về thái độ:**
- Tư duy hệ thống trong thiết kế phần mềm
- Chú trọng code quality và maintainability
- Học hỏi và cập nhật công nghệ mới

---

## CẤU TRÚC GIÁO TRÌNH

### PHẦN I: FOUNDATION (Tuần 1-3)

#### Tuần 1: Giới thiệu Web Architecture
**Lý thuyết (2 tiết):**
- Evolution của web development
- Monolithic vs Microservices
- Client-server architecture
- RESTful principles

**Thực hành (1 tiết):**
- Setup development environment
- Initialize Node.js project
- Basic Express.js application

**Bài tập:**
- Tạo simple web server với Express
- Implement basic routing
- Connect to database

#### Tuần 2: Software Design Patterns
**Lý thuyết (2 tiết):**
- Design patterns overview
- Creational, Structural, Behavioral patterns
- Pattern trong web development
- Anti-patterns và code smells

**Thực hành (1 tiết):**
- Implement Singleton pattern
- Factory pattern cho database connections
- Observer pattern cho events

**Bài tập:**
- Refactor existing code using patterns
- Identify và fix anti-patterns

#### Tuần 3: Database Design & ORM Introduction
**Lý thuyết (2 tiết):**
- Relational database design
- Normalization và denormalization
- ORM concepts và benefits
- Popular ORM frameworks

**Thực hành (1 tiết):**
- Database schema design
- Prisma setup và configuration
- Basic CRUD operations

**Bài tập:**
- Design database cho blog system
- Implement Models với Prisma

### PHẦN II: MVC ARCHITECTURE (Tuần 4-8)

#### Tuần 4: MVC Pattern Deep Dive
**Lý thuyết (2 tiết):**
- MVC history và evolution
- Model, View, Controller responsibilities
- MVC variants: MVP, MVVM
- Benefits và limitations

**Thực hành (1 tiết):**
- Tạo basic MVC structure
- Implement simple CRUD với MVC
- Routing và middleware

**Bài tập:**
- Convert monolithic app sang MVC
- Implement user authentication

#### Tuần 5: Model Layer Implementation
**Lý thuyết (2 tiết):**
- Business logic trong Models
- Data validation và sanitization
- Model relationships và associations
- Active Record vs Data Mapper

**Thực hành (1 tiết):**
- Advanced Prisma features
- Model methods và validations
- Database migrations

**Bài tập:**
- Implement User, Post, Category models
- Add validation và relationships

#### Tuần 6: Controller Layer & Request Handling
**Lý thuyết (2 tiết):**
- Controller responsibilities
- Request/response cycle
- Middleware pattern
- Error handling strategies

**Thực hành (1 tiết):**
- Controller implementation
- Middleware development
- Error handling middleware

**Bài tập:**
- Implement PostController với full CRUD
- Add authentication middleware

#### Tuần 7: View Layer & Templating
**Lý thuyết (2 tiết):**
- View technologies overview
- Server-side vs client-side rendering
- Template engines comparison
- Frontend integration strategies

**Thực hành (1 tiết):**
- Handlebars templating
- Partial templates và layouts
- Helper functions

**Bài tập:**
- Create responsive UI với Handlebars
- Implement admin dashboard

#### Tuần 8: MVC Integration & Testing
**Lý thuyết (2 tiết):**
- Integration best practices
- Testing strategies cho MVC
- Unit vs Integration testing
- Test-driven development

**Thực hành (1 tiết):**
- End-to-end MVC implementation
- Unit testing với Jest
- Integration testing

**Bài tập:**
- Complete blog CMS với testing
- Performance optimization

### PHẦN III: ADVANCED ORM & DATABASE (Tuần 9-11)

#### Tuần 9: Advanced ORM Features
**Lý thuyết (2 tiết):**
- Complex queries và relationships
- Eager vs lazy loading
- N+1 query problem
- Query optimization techniques

**Thực hành (1 tiết):**
- Advanced Prisma queries
- Relationship management
- Query performance analysis

**Bài tập:**
- Optimize existing queries
- Implement search functionality

#### Tuần 10: Database Performance & Optimization
**Lý thuyết (2 tiết):**
- Database indexing strategies
- Query optimization
- Connection pooling
- Caching mechanisms

**Thực hành (1 tiết):**
- Database index creation
- Query performance monitoring
- Implement caching layer

**Bài tập:**
- Performance audit và optimization
- Implement Redis caching

#### Tuần 11: Database Migrations & Schema Management
**Lý thuyết (2 tiết):**
- Schema evolution strategies
- Migration best practices
- Data seeding và fixtures
- Environment-specific configurations

**Thực hành (1 tiết):**
- Migration development
- Seeding implementation
- Environment setup

**Bài tập:**
- Create production-ready migrations
- Setup staging environment

### PHẦN IV: SECURITY & PERFORMANCE (Tuần 12-13)

#### Tuần 12: Web Security
**Lý thuyết (2 tiết):**
- Common web vulnerabilities
- Authentication vs Authorization
- Security headers và HTTPS
- Input validation và sanitization

**Thực hành (1 tiết):**
- Implement JWT authentication
- Security middleware
- Input validation

**Bài tập:**
- Security audit của ứng dụng
- Implement 2FA

#### Tuần 13: Performance Optimization
**Lý thuyết (2 tiết):**
- Performance monitoring
- Caching strategies
- Load balancing
- CDN và static asset optimization

**Thực hành (1 tiết):**
- Performance profiling
- Caching implementation
- Asset optimization

**Bài tập:**
- Performance optimization project
- Load testing

### PHẦN V: ADVANCED TOPICS (Tuần 14-15)

#### Tuần 14: API Development & Documentation
**Lý thuyết (2 tiết):**
- RESTful API design
- API versioning strategies
- Documentation với OpenAPI
- GraphQL introduction

**Thực hành (1 tiết):**
- REST API implementation
- Swagger documentation
- API testing

**Bài tập:**
- Complete API documentation
- API client development

#### Tuần 15: DevOps & Deployment
**Lý thuyết (2 tiết):**
- Deployment strategies
- Containerization với Docker
- CI/CD pipelines
- Monitoring và logging

**Thực hành (1 tiết):**
- Docker setup
- Deployment automation
- Monitoring implementation

**Bài tập:**
- Production deployment
- Monitoring dashboard

---

## PHƯƠNG PHÁP GIẢNG DẠY

### 1. Lý thuyết (60%)
- **Lecture-based learning:** Trình bày concepts và principles
- **Case study analysis:** Phân tích real-world applications
- **Discussion sessions:** Thảo luận best practices
- **Guest lectures:** Industry experts sharing experience

### 2. Thực hành (40%)
- **Hands-on coding:** Live coding demonstrations
- **Lab sessions:** Guided practice exercises
- **Project-based learning:** Build complete applications
- **Code reviews:** Peer review sessions

### 3. Công cụ hỗ trợ
- **GitHub Classroom:** Code submission và collaboration
- **VS Code:** Recommended IDE với extensions
- **Docker:** Consistent development environment
- **Postman:** API testing và documentation

---

## ĐÁNH GIÁ HỌC TẬP

### 1. Cấu trúc điểm số

| Thành phần | Tỷ trọng | Mô tả |
|------------|----------|-------|
| Bài kiểm tra giữa kỳ | 20% | Lý thuyết + thực hành (tuần 8) |
| Bài kiểm tra cuối kỳ | 30% | Comprehensive exam |
| Dự án nhóm | 25% | Complete web application |
| Bài tập hàng tuần | 15% | Weekly assignments |
| Participation & Lab | 10% | Class participation và lab work |

### 2. Tiêu chí đánh giá chi tiết

**Bài kiểm tra giữa kỳ (20%):**
- Multiple choice questions (30%)
- Short answer questions (40%)
- Coding problems (30%)

**Bài kiểm tra cuối kỳ (30%):**
- Comprehensive theory (40%)
- System design questions (30%)
- Advanced coding problems (30%)

**Dự án nhóm (25%):**
- Technical implementation (60%)
- Code quality và documentation (25%)
- Presentation (15%)

**Bài tập hàng tuần (15%):**
- Completion rate (50%)
- Code quality (30%)
- Innovation (20%)

**Participation & Lab (10%):**
- Class attendance (30%)
- Lab completion (40%)
- Peer review participation (30%)

### 3. Thang điểm

| Điểm | Xếp loại | Mô tả |
|------|----------|-------|
| 9.0 - 10.0 | A+ | Xuất sắc |
| 8.5 - 8.9 | A | Rất tốt |
| 8.0 - 8.4 | B+ | Tốt |
| 7.0 - 7.9 | B | Khá |
| 6.5 - 6.9 | C+ | Trung bình khá |
| 5.5 - 6.4 | C | Trung bình |
| 4.0 - 5.4 | D | Yếu |
| < 4.0 | F | Kém |

---

## DỰ ÁN NHÓM

### 1. Mô tả dự án
**Tên dự án:** Enterprise Web Application

**Yêu cầu:**
- Team size: 3-4 sinh viên
- Duration: 8 tuần (tuần 8-15)
- Technology stack: Node.js, Express, Prisma, MySQL
- Frontend: Handlebars hoặc React/Vue.js

### 2. Tính năng bắt buộc
1. **User Management:**
   - Authentication & authorization
   - User profiles và roles
   - Password reset functionality

2. **Content Management:**
   - CRUD operations cho main entities
   - File upload và management
   - Search và filtering

3. **Admin Panel:**
   - Dashboard với statistics
   - User management interface
   - System configuration

4. **API Development:**
   - RESTful API cho mobile
   - API documentation
   - Rate limiting và security

5. **Advanced Features:**
   - Email notifications
   - Real-time features (optional)
   - Performance optimization
   - Security implementation

### 3. Deliverables
1. **Week 10:** Project proposal và database design
2. **Week 12:** Mid-project demo (MVP)
3. **Week 14:** Code review session
4. **Week 15:** Final presentation và code submission

### 4. Evaluation Criteria
- **Functionality (40%):** Feature completeness
- **Code Quality (25%):** Clean code, structure, documentation
- **Security (15%):** Security best practices
- **Performance (10%):** Optimization và scalability
- **Presentation (10%):** Demo và documentation

---

## TÀI LIỆU THAM KHẢO

### 1. Sách giáo khoa chính
1. **"Node.js Design Patterns"** - Mario Casciaro & Luciano Mammino
2. **"Clean Architecture"** - Robert C. Martin
3. **"Patterns of Enterprise Application Architecture"** - Martin Fowler

### 2. Sách tham khảo
1. **"JavaScript: The Good Parts"** - Douglas Crockford
2. **"Web Application Security"** - Andrew Hoffman
3. **"High Performance MySQL"** - Baron Schwartz

### 3. Tài liệu online
1. **MDN Web Docs:** https://developer.mozilla.org
2. **Node.js Documentation:** https://nodejs.org/docs
3. **Prisma Documentation:** https://www.prisma.io/docs
4. **Express.js Guide:** https://expressjs.com

### 4. Video courses (optional)
1. **Node.js Masterclass** - Udemy
2. **Advanced Web Development** - Pluralsight
3. **Database Design Course** - Coursera

### 5. Tools và frameworks
1. **Development:** VS Code, Git, Docker
2. **Testing:** Jest, Supertest, Postman
3. **Deployment:** AWS, DigitalOcean, Heroku
4. **Monitoring:** PM2, New Relic, DataDog

---

## KẾ HOẠCH CHI TIẾT TỪNG TUẦN

### Tuần 1: Foundation Setup
**Mục tiêu:** Thiết lập foundation cho khóa học

**Lý thuyết:**
- Course introduction và expectations
- Web development evolution
- Modern web architecture patterns
- Development environment setup

**Thực hành:**
- Node.js và npm setup
- Git workflow
- Basic Express application
- Database connection

**Assignment:**
- Setup personal development environment
- Create GitHub repository
- Basic web server implementation

**Resources:**
- Node.js installation guide
- Git basics tutorial
- Express.js getting started

### Tuần 2: Design Patterns Fundamentals
**Mục tiêu:** Hiểu và apply design patterns

**Lý thuyết:**
- Software design principles (SOLID)
- Creational patterns: Singleton, Factory
- Structural patterns: Adapter, Decorator
- Behavioral patterns: Observer, Strategy

**Thực hành:**
- Implement Singleton database connection
- Factory pattern cho model creation
- Observer pattern cho event handling

**Assignment:**
- Refactor existing code using patterns
- Pattern identification exercise
- Implementation của 3 patterns

**Resources:**
- Gang of Four design patterns book
- JavaScript design patterns examples
- Code refactoring techniques

### Tuần 3-8: [Chi tiết tương tự cho các tuần còn lại]

---

## PHỤ LỤC

### A. Coding Standards
```javascript
// File naming: PascalCase for classes, camelCase for files
// src/models/UserModel.js
class UserModel {
  // Method naming: camelCase
  static async findById(id) {
    // Code implementation
  }
}

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;

// Variables: camelCase
const userProfile = await UserModel.findById(userId);
```

### B. Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/user-authentication
git add .
git commit -m "feat: implement user authentication"
git push origin feature/user-authentication

# Pull request và code review
# Merge sau khi approved
```

### C. Project Structure Template
```
project-name/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── views/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── utils/
├── tests/
├── docs/
├── public/
├── prisma/
└── package.json
```

### D. Assessment Rubrics
[Detailed rubrics cho từng assignment và project]

---

*Giáo trình này được thiết kế để cung cấp kiến thức toàn diện về Web Development nâng cao, với focus vào practical skills và industry best practices.*
