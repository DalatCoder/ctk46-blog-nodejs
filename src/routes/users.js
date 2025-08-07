const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Apply authentication and admin middleware to all routes
router.use(requireAuth);
router.use(requireAdmin);

// Get all users (with pagination and filters)
router.get('/', UserController.getAllUsers);

// Get user statistics
router.get('/stats', UserController.getUserStats);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Create new user
router.post('/', UserController.createUser);

// Update user
router.put('/:id', UserController.updateUser);

// Delete user
router.delete('/:id', UserController.deleteUser);

// Toggle user status (active/inactive)
router.patch('/:id/toggle-status', UserController.toggleUserStatus);

// Reset user password
router.patch('/:id/reset-password', UserController.resetUserPassword);

// Bulk operations
router.post('/bulk-update', UserController.bulkUpdateUsers);

module.exports = router;
