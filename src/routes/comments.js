const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const { body } = require('express-validator');

// Validation rules
const commentValidation = [
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
];

const guestCommentValidation = [
  ...commentValidation,
  body('authorName')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('authorEmail')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('authorWebsite')
    .optional()
    .isURL()
    .withMessage('Please enter a valid website URL'),
];

const replyValidation = [
  body('content')
    .notEmpty()
    .withMessage('Reply content is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Reply must be between 5 and 500 characters'),
];

// Admin routes
router.get('/', CommentController.index);
router.get('/:id', CommentController.show);
router.patch('/:id/status', CommentController.updateStatus);
router.post('/bulk-update', CommentController.bulkUpdate);
router.delete('/:id', CommentController.destroy);
router.post('/:id/reply', replyValidation, CommentController.reply);

// Frontend routes
router.post('/store', commentValidation, CommentController.store);
router.get('/post/:postId', CommentController.getByPost);

module.exports = router;
