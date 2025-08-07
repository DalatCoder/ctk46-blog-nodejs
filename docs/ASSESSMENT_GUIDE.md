# ASSESSMENT GUIDE: MVC & ORM

## TỔNG QUAN ĐÁNH GIÁ

### Phương thức đánh giá:
1. **Kiểm tra lý thuyết** (30%) - 45 phút
2. **Bài tập thực hành** (40%) - 90 phút  
3. **Code quality & presentation** (20%) - 30 phút
4. **Participation & teamwork** (10%) - Suốt khóa học

---

## PHẦN 1: KIỂM TRA LỚP THUYẾT (30 điểm)

### A. Câu hỏi trắc nghiệm (15 điểm - 15 câu x 1 điểm)

**Câu 1:** Trong MVC pattern, thành phần nào chịu trách nhiệm xử lý business logic?
a) View  
b) Controller  
c) Model ✓  
d) Router

**Câu 2:** ORM là viết tắt của:
a) Object-Relational Management  
b) Object-Relational Mapping ✓  
c) Object-Resource Mapping  
d) Operational-Relational Model

**Câu 3:** Trong Prisma ORM, để tạo relationship giữa User và Post, ta sử dụng:
a) @relation ✓  
b) @foreign  
c) @reference  
d) @link

**Câu 4:** Middleware trong Express.js được execute theo thứ tự:
a) Ngẫu nhiên  
b) Theo alphabet  
c) Theo thứ tự khai báo ✓  
d) Theo độ ưu tiên

**Câu 5:** N+1 query problem xảy ra khi:
a) Query quá nhiều tables cùng lúc  
b) Load related data trong loop ✓  
c) Database connection bị lỗi  
d) Query syntax không đúng

**Câu 6:** Trong RESTful API, HTTP method nào được sử dụng để update một resource?
a) POST  
b) GET  
c) PUT ✓  
d) DELETE

**Câu 7:** JWT token gồm mấy phần chính?
a) 2 phần  
b) 3 phần ✓  
c) 4 phần  
d) 5 phần

**Câu 8:** Trong MVC, View không nên chứa:
a) HTML markup  
b) CSS styling  
c) Business logic ✓  
d) Template helpers

**Câu 9:** Prisma migration được sử dụng để:
a) Backup database  
b) Thay đổi database schema ✓  
c) Optimize queries  
d) Monitor performance

**Câu 10:** Validation middleware nên được đặt:
a) Sau Controller  
b) Trước Controller ✓  
c) Trong Model  
d) Trong View

**Câu 11:** Repository pattern cung cấp:
a) UI abstraction  
b) Data access abstraction ✓  
c) Business logic abstraction  
d) Network abstraction

**Câu 12:** Trong database indexing, clustered index:
a) Có thể có nhiều trên một table  
b) Chỉ có một trên một table ✓  
c) Không ảnh hưởng đến performance  
d) Chỉ dùng cho text fields

**Câu 13:** Rate limiting được implement để:
a) Tăng performance  
b) Giảm server load  
c) Prevent abuse ✓  
d) Tất cả các đáp án trên

**Câu 14:** Trong Handlebars, helper function được sử dụng để:
a) Handle HTTP requests  
b) Process template data ✓  
c) Manage database connections  
d) Validate user input

**Câu 15:** CSRF attack có thể được prevent bằng:
a) Input validation  
b) CSRF tokens ✓  
c) Rate limiting  
d) Strong passwords

### B. Câu hỏi tự luận (15 điểm - 3 câu x 5 điểm)

**Câu 1:** (5 điểm) Giải thích chi tiết flow xử lý một HTTP request trong kiến trúc MVC. Cho ví dụ cụ thể với việc tạo một bài viết mới.

*Đáp án mẫu:*
1. User gửi POST request đến `/posts` với form data
2. Router nhận request và route đến `PostController.store`
3. Middleware chain execute: authentication → authorization → validation
4. Controller nhận request, validate input, prepare data
5. Controller gọi `PostModel.create(data)` để lưu vào database
6. Model thực hiện business logic: generate slug, calculate reading time
7. Model interact với database qua Prisma ORM
8. Database trả về created post data
9. Model return formatted data về Controller
10. Controller chọn appropriate response (JSON/redirect)
11. Response được gửi về client

**Câu 2:** (5 điểm) So sánh ưu và nhược điểm của ORM vs Raw SQL. Trong trường hợp nào nên sử dụng Raw SQL thay vì ORM?

*Đáp án mẫu:*

**ORM Advantages:**
- Type safety và auto-completion
- Database agnostic
- Migration management
- Security (SQL injection protection)
- Developer productivity

**ORM Disadvantages:**
- Performance overhead
- Learning curve
- Complex queries limitations
- "Magic" behavior

**Khi nên dùng Raw SQL:**
- Complex analytical queries
- Performance-critical operations
- Database-specific features
- Legacy system integration
- Bulk operations

**Câu 3:** (5 điểm) Phân tích các security vulnerabilities phổ biến trong web applications và cách prevent chúng trong MVC architecture.

*Đáp án mẫu:*

**1. SQL Injection:**
- Prevention: Use ORM/parameterized queries
- MVC: Validate trong Controller, escape trong Model

**2. XSS (Cross-Site Scripting):**
- Prevention: Input validation, output encoding
- MVC: Sanitize trong Controller, escape trong View

**3. CSRF (Cross-Site Request Forgery):**
- Prevention: CSRF tokens, SameSite cookies
- MVC: Middleware trong Controller layer

**4. Authentication/Authorization:**
- Prevention: Strong password policies, proper session management
- MVC: Middleware để check authentication/authorization

**5. File Upload Vulnerabilities:**
- Prevention: File type validation, size limits, virus scanning
- MVC: Validation middleware, secure storage trong Model

---

## PHẦN 2: BÀI TẬP THỰC HÀNH (40 điểm)

### Bài tập 1: Implement User Profile Management (20 điểm)

**Yêu cầu:** (60 phút)
Sinh viên implement một hệ thống quản lý profile người dùng hoàn chỉnh:

1. **Model Layer (6 điểm):**
   - Update UserModel với profile methods
   - Password change validation
   - Avatar upload handling

2. **Controller Layer (6 điểm):**
   - ProfileController với CRUD operations
   - Input validation và error handling
   - File upload processing

3. **View Layer (4 điểm):**
   - Profile display page
   - Edit profile form
   - Avatar upload interface

4. **Security (4 điểm):**
   - Authentication middleware
   - Authorization (own profile only)
   - Input sanitization

**Rubric:**
- Code functionality: 12 điểm
- Code quality & structure: 4 điểm
- Security implementation: 4 điểm

### Bài tập 2: Build Search & Filter System (20 điểm)

**Yêu cầu:** (60 phút)
Implement advanced search và filtering cho posts:

1. **Backend Implementation (12 điểm):**
   - Search trong title, content, tags
   - Filter theo category, author, date range
   - Pagination với search results
   - Sorting options

2. **Frontend Implementation (8 điểm):**
   - Search form với filters
   - AJAX search với autocomplete
   - Results display với highlighting
   - URL management cho bookmarking

**Rubric:**
- Search functionality: 8 điểm
- Filter implementation: 6 điểm
- Frontend UX: 4 điểm
- Performance optimization: 2 điểm

---

## PHẦN 3: CODE QUALITY & PRESENTATION (20 điểm)

### A. Code Review Session (10 điểm)

**Tiêu chí đánh giá:**
1. **Code Structure (3 điểm):**
   - Proper MVC separation
   - Consistent naming conventions
   - Logical file organization

2. **Best Practices (3 điểm):**
   - Error handling
   - Input validation
   - Security measures

3. **Documentation (2 điểm):**
   - Code comments
   - API documentation
   - README file

4. **Performance (2 điểm):**
   - Efficient database queries
   - Proper indexing
   - Caching strategies

### B. Presentation (10 điểm)

**Format:** 10 phút presentation + 5 phút Q&A

**Nội dung:**
1. **Architecture Overview (4 điểm):**
   - Explain MVC implementation
   - Database design decisions
   - Technology choices

2. **Demo Features (3 điểm):**
   - Show working application
   - Highlight key features
   - Demonstrate error handling

3. **Challenges & Solutions (3 điểm):**
   - Problems encountered
   - Solutions implemented
   - Lessons learned

---

## PHẦN 4: PARTICIPATION & TEAMWORK (10 điểm)

### A. Class Participation (5 điểm)

**Tiêu chí:**
- Active participation trong discussions
- Quality of questions asked
- Help provide cho classmates
- Attendance và punctuality

### B. Team Collaboration (5 điểm)

**Tiêu chí:**
- Git collaboration practices
- Code review participation
- Knowledge sharing
- Communication skills

---

## THANG ĐIỂM TỔNG KẾT

### Grade Scale:
- **A+ (95-100):** Xuất sắc - Master level understanding
- **A (90-94):** Rất tốt - Strong understanding với minor gaps
- **B+ (85-89):** Tốt - Good understanding với some gaps
- **B (80-84):** Khá - Adequate understanding
- **C+ (75-79):** Trung bình khá - Basic understanding
- **C (70-74):** Trung bình - Minimal understanding
- **F (<70):** Không đạt - Insufficient understanding

### Detailed Breakdown:

**90-100 điểm (A/A+):**
- Hoàn thành tất cả requirements
- Code quality cao, theo best practices
- Creative solutions và optimizations
- Excellent presentation skills
- Active contribution to class

**80-89 điểm (B+/B):**
- Hoàn thành hầu hết requirements
- Good code quality với minor issues
- Solid understanding of concepts
- Good presentation
- Regular participation

**70-79 điểm (C+/C):**
- Hoàn thành basic requirements
- Code functional nhưng có quality issues
- Basic understanding of concepts
- Adequate presentation
- Limited participation

**<70 điểm (F):**
- Không hoàn thành requirements
- Code có major issues hoặc không work
- Poor understanding of concepts
- Inadequate presentation
- Minimal participation

---

## FEEDBACK FORM

### Self-Assessment Questions:
1. Rate your understanding of MVC pattern (1-10)
2. Rate your comfort level with ORM usage (1-10)
3. What was the most challenging part?
4. What would you like to learn more about?
5. How can the course be improved?

### Peer Evaluation (cho team projects):
1. Communication và collaboration
2. Technical contribution
3. Problem-solving ability
4. Reliability và work quality
5. Overall team contribution

---

## EXTRA CREDIT OPPORTUNITIES (5 điểm bonus)

### Option 1: Unit Testing (3 điểm)
- Write comprehensive unit tests
- Test coverage >80%
- Include integration tests

### Option 2: Performance Optimization (3 điểm)
- Implement caching layer
- Database query optimization
- Performance monitoring

### Option 3: Advanced Security (3 điểm)
- Implement 2FA
- Security audit và fixes
- Security documentation

### Option 4: DevOps Integration (3 điểm)
- Docker containerization
- CI/CD pipeline setup
- Deployment automation

---

*Assessment guide này đảm bảo đánh giá toàn diện khả năng của sinh viên từ lý thuyết đến thực hành, từ technical skills đến soft skills.*
