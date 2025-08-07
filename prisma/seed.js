const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        status: 'ACTIVE',
        bio: 'System administrator',
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create demo editor user
    const editorPassword = await bcrypt.hash('editor123456', 10);
    
    const editorUser = await prisma.user.upsert({
      where: { email: 'editor@example.com' },
      update: {},
      create: {
        username: 'editor',
        email: 'editor@example.com',
        password: editorPassword,
        firstName: 'John',
        lastName: 'Editor',
        role: 'EDITOR',
        status: 'ACTIVE',
        bio: 'Content editor and writer',
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Editor user created:', editorUser.email);

    // Create categories
    const categories = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology news and tutorials',
        color: '#2563eb',
        icon: 'fa-laptop-code',
        sortOrder: 1,
        isFeatured: true,
      },
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development guides and best practices',
        color: '#059669',
        icon: 'fa-code',
        sortOrder: 2,
        isFeatured: true,
      },
      {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming languages and frameworks',
        color: '#dc2626',
        icon: 'fa-terminal',
        sortOrder: 3,
        isFeatured: true,
      },
      {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design and inspiration',
        color: '#7c3aed',
        icon: 'fa-palette',
        sortOrder: 4,
        isFeatured: false,
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Business insights and strategies',
        color: '#ea580c',
        icon: 'fa-briefcase',
        sortOrder: 5,
        isFeatured: false,
      },
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData,
      });
      createdCategories.push(category);
      console.log('✅ Category created:', category.name);
    }

    // Create tags
    const tags = [
      { name: 'JavaScript', slug: 'javascript', color: '#f7df1e' },
      { name: 'Node.js', slug: 'nodejs', color: '#339933' },
      { name: 'React', slug: 'react', color: '#61dafb' },
      { name: 'Vue.js', slug: 'vuejs', color: '#4fc08d' },
      { name: 'CSS', slug: 'css', color: '#1572b6' },
      { name: 'HTML', slug: 'html', color: '#e34f26' },
      { name: 'Python', slug: 'python', color: '#3776ab' },
      { name: 'PHP', slug: 'php', color: '#777bb4' },
      { name: 'MySQL', slug: 'mysql', color: '#4479a1' },
      { name: 'MongoDB', slug: 'mongodb', color: '#47a248' },
    ];

    const createdTags = [];
    for (const tagData of tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: tagData.slug },
        update: tagData,
        create: tagData,
      });
      createdTags.push(tag);
      console.log('✅ Tag created:', tag.name);
    }

    // Create sample posts
    const posts = [
      {
        title: 'Getting Started with Node.js and Express',
        slug: 'getting-started-with-nodejs-and-express',
        excerpt: 'Learn how to build web applications using Node.js and Express framework. This comprehensive guide covers everything from setup to deployment.',
        content: `
# Getting Started with Node.js and Express

Node.js has revolutionized backend development with its event-driven, non-blocking I/O model. Combined with Express.js, it provides a powerful platform for building web applications.

## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side, enabling full-stack JavaScript development.

## Setting Up Express

To get started with Express, you first need to install it:

\`\`\`bash
npm install express
\`\`\`

Then create a simple server:

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Key Features

- **Fast & Lightweight**: Built on V8 engine
- **NPM Ecosystem**: Vast package library
- **Event-Driven**: Non-blocking I/O operations
- **Cross-Platform**: Runs on various operating systems

## Conclusion

Node.js and Express provide an excellent foundation for modern web development. Start building your applications today!
        `,
        featuredImage: '/uploads/posts/nodejs-express.jpg',
        status: 'PUBLISHED',
        categoryId: createdCategories[0].id, // Technology
        authorId: adminUser.id,
        isFeatured: true,
        publishedAt: new Date(),
        tags: ['Node.js', 'JavaScript'],
      },
      {
        title: 'Modern CSS Grid Layout Techniques',
        slug: 'modern-css-grid-layout-techniques',
        excerpt: 'Discover the power of CSS Grid and learn how to create complex layouts with ease. Master the modern way of building responsive designs.',
        content: `
# Modern CSS Grid Layout Techniques

CSS Grid Layout is a two-dimensional layout system that has revolutionized how we approach web design. It provides unprecedented control over both rows and columns.

## Basic Grid Setup

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## Advanced Grid Areas

You can define named grid areas for more semantic layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Design

CSS Grid makes responsive design intuitive:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\`

Start using CSS Grid today and transform your layouts!
        `,
        featuredImage: '/uploads/posts/css-grid.jpg',
        status: 'PUBLISHED',
        categoryId: createdCategories[1].id, // Web Development
        authorId: editorUser.id,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        tags: ['CSS', 'HTML'],
      },
      {
        title: 'React Hooks: A Complete Guide',
        slug: 'react-hooks-complete-guide',
        excerpt: 'Master React Hooks and transform your functional components. Learn useState, useEffect, and custom hooks with practical examples.',
        content: `
# React Hooks: A Complete Guide

React Hooks revolutionized functional components by allowing state and lifecycle management without classes.

## useState Hook

The most basic hook for managing component state:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

Handle side effects and lifecycle events:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
\`\`\`

## Custom Hooks

Create reusable logic:

\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  
  return [value, setStoredValue];
}
\`\`\`

Hooks make React development more intuitive and powerful!
        `,
        featuredImage: '/uploads/posts/react-hooks.jpg',
        status: 'PUBLISHED',
        categoryId: createdCategories[2].id, // Programming
        authorId: adminUser.id,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        tags: ['React', 'JavaScript'],
      },
      {
        title: 'Database Design Best Practices',
        slug: 'database-design-best-practices',
        excerpt: 'Learn essential database design principles for building scalable and efficient applications. Cover normalization, indexing, and optimization.',
        content: `
# Database Design Best Practices

Good database design is crucial for application performance and maintainability. Here are key principles to follow.

## Normalization

Organize data to reduce redundancy:

- **First Normal Form (1NF)**: Eliminate repeating groups
- **Second Normal Form (2NF)**: Remove partial dependencies
- **Third Normal Form (3NF)**: Remove transitive dependencies

## Indexing Strategy

Create indexes on frequently queried columns:

\`\`\`sql
-- Single column index
CREATE INDEX idx_user_email ON users(email);

-- Composite index
CREATE INDEX idx_post_category_date ON posts(category_id, created_at);
\`\`\`

## Data Types

Choose appropriate data types:

- Use \`VARCHAR\` with appropriate length limits
- Use \`INT\` for foreign keys
- Use \`DATETIME\` for timestamps
- Consider \`JSON\` for flexible data

## Query Optimization

Write efficient queries:

\`\`\`sql
-- Use LIMIT for pagination
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20;

-- Use EXISTS instead of IN for subqueries
SELECT * FROM users u 
WHERE EXISTS (SELECT 1 FROM posts p WHERE p.author_id = u.id);
\`\`\`

Follow these practices for robust database design!
        `,
        featuredImage: '/uploads/posts/database-design.jpg',
        status: 'PUBLISHED',
        categoryId: createdCategories[0].id, // Technology
        authorId: editorUser.id,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        tags: ['MySQL', 'Database'],
      },
      {
        title: 'Building RESTful APIs with Express',
        slug: 'building-restful-apis-with-express',
        excerpt: 'Learn how to design and implement RESTful APIs using Express.js. Cover routing, middleware, authentication, and best practices.',
        content: `
# Building RESTful APIs with Express

REST APIs are the backbone of modern web applications. Express.js makes it easy to build robust and scalable APIs.

## REST Principles

- **Stateless**: Each request is independent
- **Resource-based**: URLs represent resources
- **HTTP Methods**: Use appropriate verbs (GET, POST, PUT, DELETE)
- **JSON**: Use JSON for data exchange

## Basic API Structure

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user
app.post('/api/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});
\`\`\`

## Middleware

Add authentication and validation:

\`\`\`javascript
// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected routes
app.use('/api/admin', auth);
\`\`\`

## Error Handling

Implement consistent error handling:

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
\`\`\`

Build APIs that are maintainable and scalable!
        `,
        featuredImage: '/uploads/posts/rest-api.jpg',
        status: 'DRAFT',
        categoryId: createdCategories[1].id, // Web Development
        authorId: adminUser.id,
        isFeatured: false,
        tags: ['Node.js', 'Express', 'API'],
      },
    ];

    const createdPosts = [];
    for (const postData of posts) {
      const { tags: postTags, ...postInfo } = postData;
      
      const post = await prisma.post.create({
        data: postInfo,
      });
      
      // Add tags to post
      for (const tagName of postTags) {
        const tag = createdTags.find(t => t.name === tagName);
        if (tag) {
          await prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          });
        }
      }
      
      createdPosts.push(post);
      console.log('✅ Post created:', post.title);
    }

    // Create sample comments
    const comments = [
      {
        postId: createdPosts[0].id,
        authorName: 'Alice Johnson',
        authorEmail: 'alice@example.com',
        content: 'Great tutorial! This really helped me understand Express better.',
        status: 'APPROVED',
        authorIp: '192.168.1.1',
      },
      {
        postId: createdPosts[0].id,
        authorName: 'Bob Smith',
        authorEmail: 'bob@example.com',
        content: 'Thanks for sharing this. Could you do a follow-up on middleware?',
        status: 'APPROVED',
        authorIp: '192.168.1.2',
      },
      {
        postId: createdPosts[1].id,
        authorName: 'Carol Davis',
        authorEmail: 'carol@example.com',
        content: 'CSS Grid is amazing! This guide made it so much clearer.',
        status: 'APPROVED',
        authorIp: '192.168.1.3',
      },
      {
        postId: createdPosts[2].id,
        authorName: 'David Wilson',
        authorEmail: 'david@example.com',
        content: 'React Hooks changed everything for me. Thanks for the examples!',
        status: 'PENDING',
        authorIp: '192.168.1.4',
      },
    ];

    for (const commentData of comments) {
      const comment = await prisma.comment.create({
        data: commentData,
      });
      console.log('✅ Comment created for post:', comment.postId);
    }

    // Create system settings
    const settings = [
      {
        settingKey: 'site_title',
        settingValue: 'Dynamic Blog',
        settingType: 'string',
        category: 'general',
        description: 'Website title',
        isPublic: true,
      },
      {
        settingKey: 'site_description',
        settingValue: 'A modern blog platform built with Node.js, Express, and Prisma',
        settingType: 'text',
        category: 'general',
        description: 'Website description',
        isPublic: true,
      },
      {
        settingKey: 'posts_per_page',
        settingValue: '10',
        settingType: 'number',
        category: 'reading',
        description: 'Number of posts per page',
        isPublic: true,
      },
      {
        settingKey: 'allow_comments',
        settingValue: 'true',
        settingType: 'boolean',
        category: 'discussion',
        description: 'Allow comments on posts',
        isPublic: true,
      },
      {
        settingKey: 'comment_moderation',
        settingValue: 'true',
        settingType: 'boolean',
        category: 'discussion',
        description: 'Moderate comments before publishing',
        isPublic: false,
      },
    ];

    for (const settingData of settings) {
      await prisma.setting.upsert({
        where: { settingKey: settingData.settingKey },
        update: settingData,
        create: settingData,
      });
      console.log('✅ Setting created:', settingData.settingKey);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@example.com / admin123456');
    console.log('Editor: editor@example.com / editor123456');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
