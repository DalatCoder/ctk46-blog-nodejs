const PostModel = require('../models/PostModel');
const CategoryModel = require('../models/CategoryModel');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/posts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

class PostController {
  // Frontend - Display posts list
  static async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;
      const filters = {
        status: 'PUBLISHED',
        search: req.query.search,
        categoryId: req.query.category,
      };

      const result = await PostModel.getAll(page, limit, filters);
      const categories = await CategoryModel.getFeatured();

      res.render('frontend/posts/index', {
        title: 'Blog Posts',
        posts: result.posts,
        categories,
        pagination: result.pagination,
        currentCategory: req.query.category,
        searchQuery: req.query.search,
      });
    } catch (error) {
      console.error('Posts index error:', error);
      res.status(500).render('frontend/error', { error });
    }
  }

  // Frontend - Display single post
  static async show(req, res) {
    try {
      const post = await PostModel.findBySlug(req.params.slug, true);

      if (!post || post.status !== 'PUBLISHED') {
        return res.status(404).render('frontend/404');
      }

      // Increment view count
      await PostModel.incrementViews(post.id, {
        ipAddress: req.ip,
        userId: req.user?.id,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        sessionId: req.sessionID,
      });

      // Get related posts
      const relatedPosts = await PostModel.getRelated(post.id, post.categoryId, 3);

      res.render('frontend/posts/show', {
        title: post.title,
        post,
        relatedPosts,
        metaDescription: post.metaDescription || post.excerpt,
        metaKeywords: post.metaKeywords,
      });
    } catch (error) {
      console.error('Post show error:', error);
      res.status(500).render('frontend/error', { error });
    }
  }

  // Admin - Create post form
  static async create(req, res) {
    try {
      const categories = await CategoryModel.getAll();

      res.render('admin/posts/create', {
        title: 'Create New Post',
        layout: 'admin',
        categories,
        currentPage: 'posts',
        user: req.user,
      });
    } catch (error) {
      console.error('Post create form error:', error);
      req.flash('error', 'Error loading create form');
      res.redirect('/admin/posts');
    }
  }

  // Admin - Store new post
  static async store(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/admin/posts/create');
      }

      const { title, excerpt, content, categoryId, tags, status, metaTitle, metaDescription, metaKeywords } = req.body;
      
      const postData = {
        title,
        excerpt,
        content,
        categoryId: parseInt(categoryId),
        authorId: req.user.id,
        status,
        metaTitle,
        metaDescription,
        metaKeywords,
      };

      // Handle featured image upload
      if (req.file) {
        postData.featuredImage = `/uploads/posts/${req.file.filename}`;
      }

      // Parse tags
      const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      const post = await PostModel.create(postData);

      // Add tags if provided
      if (tagArray.length > 0) {
        await PostModel.addTags(post.id, tagArray);
      }

      req.flash('success', 'Post created successfully');
      res.redirect('/admin/posts');
    } catch (error) {
      console.error('Post store error:', error);
      req.flash('error', 'Error creating post');
      res.redirect('/admin/posts/create');
    }
  }

  // Admin - Edit post form
  static async edit(req, res) {
    try {
      const post = await PostModel.findById(req.params.id, true);

      if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/admin/posts');
      }

      const categories = await CategoryModel.getAll();

      // Extract tags
      const tags = post.postTags ? post.postTags.map(pt => pt.tag.name).join(', ') : '';

      res.render('admin/posts/edit', {
        title: 'Edit Post',
        layout: 'admin',
        post: { ...post, tags },
        categories,
        currentPage: 'posts',
        user: req.user,
      });
    } catch (error) {
      console.error('Post edit form error:', error);
      req.flash('error', 'Error loading post');
      res.redirect('/admin/posts');
    }
  }

  // Admin - Update post
  static async update(req, res) {
    try {
      const post = await PostModel.findById(req.params.id);
      
      if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/admin/posts');
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect(`/admin/posts/${req.params.id}/edit`);
      }

      const { title, excerpt, content, categoryId, tags, status, metaTitle, metaDescription, metaKeywords } = req.body;
      
      const updateData = {
        title,
        excerpt,
        content,
        categoryId: parseInt(categoryId),
        status,
        metaTitle,
        metaDescription,
        metaKeywords,
      };

      // Handle featured image upload
      if (req.file) {
        updateData.featuredImage = `/uploads/posts/${req.file.filename}`;
      }

      // Parse tags
      const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

      await PostModel.update(req.params.id, updateData);

      // Update tags
      await PostModel.addTags(req.params.id, tagArray);

      req.flash('success', 'Post updated successfully');
      res.redirect('/admin/posts');
    } catch (error) {
      console.error('Post update error:', error);
      req.flash('error', 'Error updating post');
      res.redirect(`/admin/posts/${req.params.id}/edit`);
    }
  }

  // Admin - Delete post
  static async destroy(req, res) {
    try {
      const post = await PostModel.findById(req.params.id);
      
      if (!post) {
        return res.json({ success: false, message: 'Post not found' });
      }

      await PostModel.delete(req.params.id);
      
      res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Post delete error:', error);
      res.json({ success: false, message: 'Error deleting post' });
    }
  }

  // Get posts by category (Frontend)
  static async byCategory(req, res) {
    try {
      const category = await CategoryModel.findBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).render('frontend/404');
      }

      const page = parseInt(req.query.page) || 1;
      const result = await CategoryModel.getPosts(category.id, page, 6);

      res.render('frontend/posts/category', {
        title: `Posts in ${category.name}`,
        category,
        posts: result.posts,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Posts by category error:', error);
      res.status(500).render('frontend/error', { error });
    }
  }

  // Upload middleware
  static uploadMiddleware() {
    return upload.single('featuredImage');
  }
}

module.exports = PostController;
