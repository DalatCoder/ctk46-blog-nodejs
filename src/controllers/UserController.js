const UserModel = require('../models/UserModel');

class UserController {
  // Get all users with pagination and filters
  static async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        role: req.query.role,
        status: req.query.status,
        search: req.query.search,
      };

      const result = await UserModel.getAll(page, limit, filters);
      
      // Get statistics for users
      const stats = await UserModel.getStats();

      res.json({
        success: true,
        users: result.users,
        pagination: result.pagination,
        stats,
        filters
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching users' 
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(parseInt(id));
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching user' 
      });
    }
  }

  // Create new user
  static async createUser(req, res) {
    try {
      const { username, email, firstName, lastName, role, status, password } = req.body;
      
      // Validate required fields
      if (!username || !email || !firstName || !lastName || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields must be filled (username, email, firstName, lastName, password)' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email format' 
        });
      }

      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 6 characters long' 
        });
      }

      // Check if user already exists
      const existingUserByEmail = await UserModel.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      }

      const existingUserByUsername = await UserModel.findByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this username already exists' 
        });
      }

      const userData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: role || 'USER',
        status: status || 'ACTIVE',
        password
      };

      const newUser = await UserModel.create(userData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({ 
        success: true, 
        message: 'User created successfully',
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.code === 'P2002' ? 'User already exists' : 'Error creating user' 
      });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, firstName, lastName, role, status, password } = req.body;
      
      // Validate required fields
      if (!username || !email || !firstName || !lastName) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields must be filled (username, email, firstName, lastName)' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email format' 
        });
      }

      // Check if user exists
      const existingUser = await UserModel.findById(parseInt(id));
      if (!existingUser) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Check for email conflicts (excluding current user)
      const userWithEmail = await UserModel.findByEmail(email.trim().toLowerCase());
      if (userWithEmail && userWithEmail.id !== parseInt(id)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already exists' 
        });
      }

      // Check for username conflicts (excluding current user)
      const userWithUsername = await UserModel.findByUsername(username.trim());
      if (userWithUsername && userWithUsername.id !== parseInt(id)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username already exists' 
        });
      }

      const updateData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
        status
      };

      // Only update password if provided
      if (password && password.trim()) {
        if (password.length < 6) {
          return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 6 characters long' 
          });
        }
        updateData.password = password;
      }

      const updatedUser = await UserModel.update(parseInt(id), updateData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.json({ 
        success: true, 
        message: 'User updated successfully',
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ 
        success: false, 
        message: error.code === 'P2002' ? 'Email or username already exists' : 'Error updating user' 
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Prevent deleting current user
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete your own account' 
        });
      }

      const user = await UserModel.findById(parseInt(id));
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Check if user is a super admin (optional protection)
      if (user.role === 'SUPER_ADMIN') {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete super admin account' 
        });
      }

      await UserModel.delete(parseInt(id));
      
      res.json({ 
        success: true, 
        message: 'User deleted successfully' 
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting user' 
      });
    }
  }

  // Bulk update users
  static async bulkUpdateUsers(req, res) {
    try {
      const { action, userIds, value } = req.body;

      if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request. Action and user IDs are required.'
        });
      }

      const numericIds = userIds.map(id => parseInt(id)).filter(id => !isNaN(id));

      if (numericIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid user IDs provided.'
        });
      }

      // Prevent updating current user
      if (numericIds.includes(req.user.id)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot perform bulk actions on your own account.'
        });
      }

      // Check for super admin protection
      const usersToUpdate = await Promise.all(
        numericIds.map(id => UserModel.findById(id))
      );
      
      const hasSuperAdmin = usersToUpdate.some(user => user && user.role === 'SUPER_ADMIN');
      if (hasSuperAdmin && (action === 'delete' || action === 'demote')) {
        return res.status(400).json({
          success: false,
          message: 'Cannot perform this action on super admin accounts.'
        });
      }

      let result;
      let message;

      switch (action) {
        case 'activate':
          result = await UserModel.bulkUpdateStatus(numericIds, 'ACTIVE');
          message = `${numericIds.length} user(s) activated successfully.`;
          break;
        case 'deactivate':
          result = await UserModel.bulkUpdateStatus(numericIds, 'INACTIVE');
          message = `${numericIds.length} user(s) deactivated successfully.`;
          break;
        case 'promote':
          result = await UserModel.bulkUpdateRole(numericIds, 'ADMIN');
          message = `${numericIds.length} user(s) promoted to admin successfully.`;
          break;
        case 'demote':
          result = await UserModel.bulkUpdateRole(numericIds, 'USER');
          message = `${numericIds.length} user(s) demoted to user successfully.`;
          break;
        case 'delete':
          result = await UserModel.bulkDelete(numericIds);
          message = `${numericIds.length} user(s) deleted successfully.`;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid action. Valid actions: activate, deactivate, promote, demote, delete'
          });
      }

      res.json({
        success: true,
        message,
        updatedCount: numericIds.length
      });

    } catch (error) {
      console.error('Bulk update users error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating users.'
      });
    }
  }

  // Get user statistics
  static async getUserStats(req, res) {
    try {
      const stats = await UserModel.getStats();
      
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user statistics'
      });
    }
  }

  // Toggle user status (active/inactive)
  static async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;
      
      // Prevent toggling current user
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot change status of your own account' 
        });
      }

      const user = await UserModel.findById(parseInt(id));
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const updatedUser = await UserModel.update(parseInt(id), { status: newStatus });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({ 
        success: true, 
        message: `User ${newStatus.toLowerCase()} successfully`,
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Toggle user status error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating user status' 
      });
    }
  }

  // Reset user password
  static async resetUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ 
          success: false, 
          message: 'New password must be at least 6 characters long' 
        });
      }

      const user = await UserModel.findById(parseInt(id));
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      await UserModel.update(parseInt(id), { password: newPassword });
      
      res.json({ 
        success: true, 
        message: 'Password reset successfully' 
      });
    } catch (error) {
      console.error('Reset user password error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error resetting password' 
      });
    }
  }
}

module.exports = UserController;
