const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const CategoryModel = require('../models/CategoryModel');
const { optionalAuth } = require('../middleware/auth');

// Apply optional authentication to all frontend routes
router.use(optionalAuth);

// Home page
router.get('/', async (req, res) => {
  try {
    const PostModel = require('../models/PostModel');
    
    // Get featured posts
    const featuredPosts = await PostModel.getAll(1, 3, { 
      status: 'PUBLISHED', 
      isFeatured: true 
    });
    
    // Get recent posts
    const recentPosts = await PostModel.getAll(1, 6, { 
      status: 'PUBLISHED' 
    });
    
    // Get categories
    const categories = await CategoryModel.getFeatured();

    res.render('frontend/home', {
      title: 'Welcome to Dynamic Blog',
      featuredPosts: featuredPosts.posts,
      recentPosts: recentPosts.posts,
      categories,
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).render('frontend/error', { error });
  }
});

// Blog posts routes
router.get('/posts', PostController.index);
router.get('/posts/:slug', PostController.show);

// Category routes
router.get('/categories/:slug', PostController.byCategory);

// About page
router.get('/about', (req, res) => {
  res.render('frontend/about', {
    title: 'About Us',
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('frontend/contact', {
    title: 'Contact Us',
  });
});

// Search route
router.get('/search', async (req, res) => {
  try {
    const PostModel = require('../models/PostModel');
    const query = req.query.q;
    
    if (!query) {
      return res.render('frontend/search', {
        title: 'Search',
        query: '',
        posts: [],
        pagination: null,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const result = await PostModel.getAll(page, 10, {
      status: 'PUBLISHED',
      search: query,
    });

    res.render('frontend/search', {
      title: `Search Results for "${query}"`,
      query,
      posts: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).render('frontend/error', { error });
  }
});

module.exports = router;
