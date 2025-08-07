const CommentModel = require('../models/CommentModel');
const PostModel = require('../models/PostModel');
const { validationResult } = require('express-validator');

class CommentController {
  // Admin - Display comments list
  static async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const filters = {
        status: req.query.status,
        postId: req.query.post,
        search: req.query.search,
      };

      const result = await CommentModel.getAll(page, limit, filters);
      const posts = await PostModel.getAll(1, 100); // Get all posts for filter
      
      // Get comment statistics
      const stats = await CommentModel.getStatistics();

      res.render('admin/comments', {
        title: 'Manage Comments',
        layout: 'admin',
        comments: result.comments,
        posts: posts.posts,
        pagination: result.pagination,
        currentPage: 'comments',
        user: req.user,
        filters,
        stats,
      });
    } catch (error) {
      console.error('Comments index error:', error);
      req.flash('error', 'Error loading comments');
      res.status(500).render('admin/error', { 
        error, 
        layout: 'admin',
        user: req.user,
        status: 500 
      });
    }
  }

  // Admin - Show single comment
  static async show(req, res) {
    try {
      const comment = await CommentModel.findById(req.params.id);

      if (!comment) {
        req.flash('error', 'Comment not found');
        return res.redirect('/admin/comments');
      }

      res.render('admin/comments/show', {
        title: 'Comment Details',
        layout: 'admin',
        comment,
        currentPage: 'comments',
        user: req.user,
      });
    } catch (error) {
      console.error('Comment show error:', error);
      req.flash('error', 'Error loading comment');
      res.redirect('/admin/comments');
    }
  }

  // Admin - Update comment status
  static async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const commentId = req.params.id;

      if (!['PENDING', 'APPROVED', 'TRASH', 'SPAM'].includes(status)) {
        return res.json({ success: false, message: 'Invalid status' });
      }

      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.json({ success: false, message: 'Comment not found' });
      }

      await CommentModel.updateStatus(commentId, status);

      res.json({ 
        success: true, 
        message: `Comment ${status.toLowerCase()} successfully`,
        newStatus: status 
      });
    } catch (error) {
      console.error('Comment status update error:', error);
      res.json({ success: false, message: 'Error updating comment status' });
    }
  }

  // Admin - Bulk update comments
  static async bulkUpdate(req, res) {
    try {
      const { action, commentIds } = req.body;

      if (!commentIds || commentIds.length === 0) {
        return res.json({ success: false, message: 'No comments selected' });
      }

      const validActions = ['approve', 'trash', 'spam', 'delete'];
      if (!validActions.includes(action)) {
        return res.json({ success: false, message: 'Invalid action' });
      }

      let result;
      switch (action) {
        case 'approve':
          result = await CommentModel.bulkUpdateStatus(commentIds, 'APPROVED');
          break;
        case 'trash':
          result = await CommentModel.bulkUpdateStatus(commentIds, 'TRASH');
          break;
        case 'spam':
          result = await CommentModel.bulkUpdateStatus(commentIds, 'SPAM');
          break;
        case 'delete':
          result = await CommentModel.bulkDelete(commentIds);
          break;
      }

      res.json({ 
        success: true, 
        message: `${result.count} comments ${action === 'delete' ? 'deleted' : 'updated'} successfully` 
      });
    } catch (error) {
      console.error('Bulk update error:', error);
      res.json({ success: false, message: 'Error performing bulk action' });
    }
  }

  // Admin - Delete comment
  static async destroy(req, res) {
    try {
      const comment = await CommentModel.findById(req.params.id);
      
      if (!comment) {
        return res.json({ success: false, message: 'Comment not found' });
      }

      await CommentModel.delete(req.params.id);
      
      res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Comment delete error:', error);
      res.json({ success: false, message: 'Error deleting comment' });
    }
  }

  // Admin - Reply to comment
  static async reply(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ success: false, message: errors.array()[0].msg });
      }

      const { content } = req.body;
      const parentComment = await CommentModel.findById(req.params.id);

      if (!parentComment) {
        return res.json({ success: false, message: 'Parent comment not found' });
      }

      const replyData = {
        content,
        postId: parentComment.postId,
        parentId: parentComment.id,
        authorName: `${req.user.firstName} ${req.user.lastName}`,
        authorEmail: req.user.email,
        authorIp: req.ip || req.connection.remoteAddress || '127.0.0.1',
        userId: req.user.id,
        status: 'APPROVED',
      };

      const reply = await CommentModel.create(replyData);

      res.json({ 
        success: true, 
        message: 'Reply posted successfully',
        reply: reply 
      });
    } catch (error) {
      console.error('Comment reply error:', error);
      res.json({ success: false, message: 'Error posting reply' });
    }
  }

  // Frontend - Store new comment
  static async store(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('back');
      }

      const { content, postId, parentId } = req.body;
      
      // Check if post exists
      const post = await PostModel.findById(postId);
      if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/');
      }

      const commentData = {
        content,
        postId: parseInt(postId),
        parentId: parentId ? parseInt(parentId) : null,
        authorIp: req.ip || req.connection.remoteAddress || '127.0.0.1',
        status: 'PENDING', // Default to pending for moderation
      };

      // If user is logged in
      if (req.user) {
        commentData.userId = req.user.id;
        commentData.authorName = `${req.user.firstName} ${req.user.lastName}`;
        commentData.authorEmail = req.user.email;
      } else {
        // Guest comment
        const { authorName, authorEmail, authorWebsite } = req.body;
        commentData.authorName = authorName;
        commentData.authorEmail = authorEmail;
        commentData.authorWebsite = authorWebsite;
      }

      await CommentModel.create(commentData);

      req.flash('success', 'Comment submitted successfully and is pending approval');
      res.redirect(`/posts/${post.slug}#comments`);
    } catch (error) {
      console.error('Comment store error:', error);
      req.flash('error', 'Error submitting comment');
      res.redirect('back');
    }
  }

  // Frontend - Get comments for a post (AJAX)
  static async getByPost(req, res) {
    try {
      const { postId } = req.params;
      const comments = await CommentModel.getByPost(postId, 'APPROVED');

      res.json({ success: true, comments });
    } catch (error) {
      console.error('Get comments error:', error);
      res.json({ success: false, message: 'Error loading comments' });
    }
  }
}

module.exports = CommentController;
