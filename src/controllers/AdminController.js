const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const CategoryModel = require('../models/CategoryModel');
const CommentModel = require('../models/CommentModel');

class AdminController {
  // Dashboard
  static async dashboard(req, res) {
    try {
      // Simplified dashboard for testing
      console.log('🏠 Loading dashboard for user:', req.user.email);
      
      res.render('admin/dashboard', {
        title: 'Dashboard',
        layout: 'admin', // Enable admin layout
        stats: {
          users: { totalUsers: 1, activeUsers: 1 },
          posts: { totalPosts: 0, publishedPosts: 0 },
          comments: { totalComments: 0, pendingComments: 0 },
          categories: { totalCategories: 0 }
        },
        recentPosts: [],
        recentComments: [],
        currentPage: 'dashboard',
        user: req.user,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      req.flash('error', 'Error loading dashboard');
      res.status(500).json({ error: 'Dashboard error', details: error.message });
    }
  }

  // Posts management page
  static async posts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const filters = {
        status: req.query.status,
        categoryId: req.query.category,
        search: req.query.search,
      };

      const result = await PostModel.getAll(page, limit, filters);
      const categories = await CategoryModel.getAll();

      res.render('admin/posts', {
        title: 'Posts Management',
        layout: 'admin',
        posts: result.posts,
        categories,
        pagination: result.pagination,
        filters,
        currentPage: 'posts',
        user: req.user,
      });
    } catch (error) {
      console.error('Posts page error:', error);
      req.flash('error', 'Error loading posts');
      res.redirect('/admin');
    }
  }

  // Categories management page
  static async categories(req, res) {
    try {
      const categories = await CategoryModel.getAllWithPostCount();

      // Add published posts count for each category
      const categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const publishedPosts = await CategoryModel.getPostCount(category.id);
          return {
            ...category,
            publishedPosts
          };
        })
      );

      res.render('admin/categories', {
        title: 'Quản lý danh mục',
        layout: 'admin',
        categories: categoriesWithStats,
        currentPage: 'categories',
        user: req.user,
      });
    } catch (error) {
      console.error('Categories page error:', error);
      req.flash('error', 'Error loading categories');
      res.redirect('/admin');
    }
  }

  // Comments management page
  static async comments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const filters = {
        status: req.query.status,
        search: req.query.search,
      };

      const result = await CommentModel.getAll(page, limit, filters);

      res.render('admin/comments', {
        title: 'Comments Management',
        layout: 'admin',
        comments: result.comments,
        pagination: result.pagination,
        filters,
        currentPage: 'comments',
        user: req.user,
      });
    } catch (error) {
      console.error('Comments page error:', error);
      req.flash('error', 'Error loading comments');
      res.redirect('/admin');
    }
  }

  // Settings page
  static async settings(req, res) {
    try {
      res.render('admin/settings', {
        title: 'Settings',
        layout: 'admin',
        currentPage: 'settings',
        user: req.user,
      });
    } catch (error) {
      console.error('Settings page error:', error);
      req.flash('error', 'Error loading settings');
      res.redirect('/admin');
    }
  }

  // Users management page
  static async users(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const filters = {
        role: req.query.role,
        status: req.query.status,
        search: req.query.search,
      };

      const result = await UserModel.getAll(page, limit, filters);

      res.render('admin/users', {
        title: 'Users Management',
        layout: 'admin',
        users: result.users,
        pagination: result.pagination,
        filters,
        currentPage: 'users',
        user: req.user,
      });
    } catch (error) {
      console.error('Users page error:', error);
      req.flash('error', 'Error loading users');
      res.redirect('/admin');
    }
  }

  // Category CRUD API endpoints
  static async createCategory(req, res) {
    try {
      const { name, slug, description, isFeatured } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc' });
      }

      const categoryData = {
        name,
        slug: slug || null,
        description: description || null,
        isFeatured: isFeatured === 'true',
      };

      const category = await CategoryModel.create(categoryData);
      
      res.json({ success: true, category });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.code === 'P2002' ? 'Danh mục đã tồn tại' : 'Lỗi tạo danh mục' 
      });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, slug, description, isFeatured } = req.body;
      
      if (!name) {
        return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc' });
      }

      const updateData = {
        name,
        slug: slug || null,
        description: description || null,
        isFeatured: isFeatured === 'true',
      };

      const category = await CategoryModel.update(parseInt(id), updateData);
      
      res.json({ success: true, category });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.code === 'P2002' ? 'Danh mục đã tồn tại' : 'Lỗi cập nhật danh mục' 
      });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      // Check if category has posts
      const category = await CategoryModel.findById(parseInt(id));
      if (!category) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
      }

      // Check if category has posts
      const postCount = await CategoryModel.getPostCount(parseInt(id));
      if (postCount > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Không thể xóa danh mục này vì còn ${postCount} bài viết` 
        });
      }

      await CategoryModel.delete(parseInt(id));
      
      res.json({ success: true, message: 'Xóa danh mục thành công' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ success: false, message: 'Lỗi xóa danh mục' });
    }
  }
}

module.exports = AdminController;
