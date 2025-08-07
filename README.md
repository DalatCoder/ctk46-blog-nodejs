# Dynamic Node.js MVC Blog

A modern blog platform built with Node.js, Express, Prisma ORM, and MySQL using MVC architecture.

## 🚀 Features

- **MVC Architecture**: Clean separation of concerns
- **Prisma ORM**: Type-safe database access with MySQL
- **Server-Side Rendering**: Using Handlebars templates
- **Admin Panel**: Complete content management system
- **Authentication**: JWT-based authentication system
- **File Upload**: Image upload for featured posts
- **Comments System**: Threaded comments with moderation
- **Categories & Tags**: Organize content effectively
- **SEO Friendly**: Meta tags and clean URLs
- **Responsive Design**: Mobile-friendly interface

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/dynamic_blog"
   JWT_SECRET=your-super-secret-jwt-key
   SESSION_SECRET=your-super-secret-session-key
   NODE_ENV=development
   PORT=3000
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE dynamic_blog;
   ```

5. **Generate Prisma client and push schema**
   ```bash
   npm run db:generate
   npm run db:push
   ```

6. **Seed the database** (Optional - creates sample data)
   ```bash
   npm run db:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
dynamic-nodejs/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js               # Sample data seeder
├── src/
│   ├── config/
│   │   └── database.js       # Prisma client configuration
│   ├── controllers/          # MVC Controllers
│   │   ├── AdminController.js
│   │   ├── PostController.js
│   │   └── AuthController.js
│   ├── models/               # Data models
│   │   ├── UserModel.js
│   │   ├── PostModel.js
│   │   ├── CategoryModel.js
│   │   └── CommentModel.js
│   ├── routes/               # Route definitions
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── frontend.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── views/                # Handlebars templates
│   │   ├── layouts/
│   │   ├── admin/
│   │   └── frontend/
│   └── utils/                # Utility functions
├── public/                   # Static files
│   └── uploads/             # Uploaded files
├── admin-template/          # Admin panel assets
├── html-template/           # Frontend assets
├── app.js                   # Express app configuration
├── server.js               # Server entry point
└── package.json
```

## 🎯 Usage

### Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login**: http://localhost:3000/auth/login

### Default Login Credentials

After running the seed command:

- **Admin**: admin@example.com / admin123456
- **Editor**: editor@example.com / editor123456

### Database Management

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations (production)
npm run db:migrate

# Open Prisma Studio (database browser)
npm run db:studio

# Reset database and reseed
npm run db:push --force-reset
npm run db:seed
```

### Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# View database in browser
npm run db:studio
```

## 🏗️ Database Schema

### Main Tables

- **users**: User accounts and profiles
- **categories**: Post categories with hierarchy support
- **posts**: Blog posts with SEO fields
- **tags**: Post tags for better organization
- **post_tags**: Many-to-many relationship
- **comments**: Threaded comments system
- **media**: File upload management
- **settings**: System configuration
- **user_sessions**: Session management
- **post_views**: Analytics tracking
- **activity_logs**: User activity tracking

### Key Relationships

- User → Posts (One-to-Many)
- Category → Posts (One-to-Many)
- Post → Comments (One-to-Many)
- Comment → Comment (Self-referencing for replies)
- Post ↔ Tags (Many-to-Many)

## 🔧 API Endpoints

### Frontend Routes
- `GET /` - Homepage
- `GET /posts` - Blog posts listing
- `GET /posts/:slug` - Single post view
- `GET /categories/:slug` - Posts by category
- `GET /search` - Search posts

### Admin Routes
- `GET /admin` - Dashboard
- `GET /admin/posts` - Posts management
- `GET /admin/categories` - Categories management
- `GET /admin/comments` - Comments moderation
- `GET /admin/users` - User management
- `GET /admin/settings` - System settings

### Authentication Routes
- `GET /auth/login` - Login form
- `POST /auth/login` - Process login
- `GET /auth/register` - Registration form
- `POST /auth/register` - Process registration
- `GET /auth/logout` - Logout

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Express-validator for form validation
- **CSRF Protection**: Session-based protection
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: Helmet.js security headers
- **Rate Limiting**: Can be added for API endpoints

## 🎨 Customization

### Adding New Models

1. Update `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Create model file in `src/models/`
4. Create controller in `src/controllers/`
5. Add routes in `src/routes/`

### Custom Middleware

Create middleware in `src/middleware/` and apply in routes:

```javascript
const customMiddleware = (req, res, next) => {
  // Your logic here
  next();
};

// Apply to routes
router.use('/protected', customMiddleware);
```

### Frontend Themes

- Modify templates in `src/views/`
- Update CSS in `html-template/css/`
- Add JavaScript in `html-template/js/`

### Admin Panel Customization

- Modify admin templates in `src/views/admin/`
- Update admin CSS in `admin-template/css/`
- Add admin JavaScript in `admin-template/js/`

## 📊 Performance Optimization

- **Database Indexing**: Optimized indexes in Prisma schema
- **Query Optimization**: Efficient Prisma queries with includes
- **Caching**: Can add Redis for session and query caching
- **Image Optimization**: Add image resizing for uploads
- **CDN Integration**: Serve static files from CDN

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="mysql://user:pass@host:3306/database"
JWT_SECRET=strong-random-secret
SESSION_SECRET=strong-random-secret
PORT=3000
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong secrets for JWT and sessions
- [ ] Setup SSL/TLS certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Setup database backups
- [ ] Configure logging and monitoring
- [ ] Setup CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](link-to-issues) page
2. Create a new issue with detailed description
3. Include error logs and environment details

## 🔄 Changelog

### v1.0.0
- Initial release with MVC architecture
- Prisma ORM integration
- Admin panel implementation
- Authentication system
- Blog functionality with comments

---

**Happy Blogging!** 🎉
