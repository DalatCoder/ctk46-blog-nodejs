const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const PostController = require('../controllers/PostController');
const AuthController = require('../controllers/AuthController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { validatePost, validateProfileUpdate, validatePasswordChange } = require('../middleware/validation');

// Apply authentication middleware to all admin routes
router.use(requireAuth);
router.use(requireAdmin);

// Dashboard
router.get('/', AdminController.dashboard);

// Posts routes
router.get('/posts', AdminController.posts);
router.get('/posts/create', PostController.create);
router.post('/posts', PostController.uploadMiddleware(), validatePost, PostController.store);
router.get('/posts/edit/:id', PostController.edit);
router.post('/posts/edit/:id', PostController.uploadMiddleware(), validatePost, PostController.update);
router.delete('/posts/:id', PostController.destroy);

// Categories routes
router.get('/categories', AdminController.categories);
router.post('/categories', AdminController.createCategory);
router.put('/categories/:id', AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

// Comments routes
router.get('/comments', AdminController.comments);

// Users routes
router.get('/users', AdminController.users);

// Settings routes
router.get('/settings', AdminController.settings);

// Profile routes
router.get('/profile', AuthController.showProfile);
router.post('/profile', validateProfileUpdate, AuthController.updateProfile);
router.post('/profile/password', validatePasswordChange, AuthController.changePassword);

module.exports = router;
