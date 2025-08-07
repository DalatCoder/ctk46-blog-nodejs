const UserModel = require('../models/UserModel');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

class AuthController {
  // Show login form
  static async showLogin(req, res) {
    // Redirect if already logged in
    if (req.session.token) {
      return res.redirect('/admin');
    }

    res.render('auth/login', {
      title: 'Login',
      layout: false,
    });
  }

  // Process login
  static async login(req, res) {
    console.log('🚀 AuthController.login called');
    console.log('📝 Request body:', req.body);
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/auth/login');
      }

      const { email, password, remember } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/auth/login');
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        req.flash('error', 'Your account is not active');
        return res.redirect('/auth/login');
      }

      // Validate password
      const isValidPassword = await UserModel.validatePassword(password, user.password);
      if (!isValidPassword) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/auth/login');
      }

      // Update last login
      await UserModel.updateLastLogin(user.id);

      console.log('🔐 Login attempt for user:', {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: remember ? '30d' : '1d' }
      );

      console.log('🎫 Generated JWT token for user:', user.email);

      // Store token in session
      req.session.token = token;

      // Set cookie expiration based on remember me
      if (remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      }

      console.log('💾 Stored token in session');

      // Save session before redirect
      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save error:', err);
          req.flash('error', 'Session save failed');
          return res.redirect('/auth/login');
        }

        console.log('✅ Session saved successfully');
        req.flash('success', 'Login successful');
        
        // Redirect to intended page or admin dashboard
        const redirectTo = req.session.returnTo || '/admin';
        delete req.session.returnTo;
        
        console.log('🔄 Redirecting to:', redirectTo);
        
        res.redirect(redirectTo);
      });
    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'An error occurred during login');
      res.redirect('/auth/login');
    }
  }

  // Show register form
  static async showRegister(req, res) {
    // Redirect if already logged in
    if (req.session.token) {
      return res.redirect('/admin');
    }

    res.render('auth/register', {
      title: 'Register',
      layout: 'layouts/auth',
    });
  }

  // Process registration
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/auth/register');
      }

      const { username, email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        req.flash('error', 'Email already exists');
        return res.redirect('/auth/register');
      }

      // Create new user
      const userData = {
        username,
        email,
        password,
        firstName,
        lastName,
        role: 'USER', // Default role
        status: 'ACTIVE',
      };

      await UserModel.create(userData);

      req.flash('success', 'Registration successful. You can now login.');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      req.flash('error', 'An error occurred during registration');
      res.redirect('/auth/register');
    }
  }

  // Process logout
  static async logout(req, res) {
    try {
      // Clear session
      req.session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err);
          req.flash('error', 'Error during logout');
          return res.redirect('/admin');
        }

        // Clear cookie
        res.clearCookie('connect.sid');
        
        // Redirect to login with success message
        res.redirect('/auth/login?message=Logged out successfully');
      });
    } catch (error) {
      console.error('Logout error:', error);
      req.flash('error', 'Error during logout');
      res.redirect('/admin');
    }
  }

  // Show forgot password form
  static async showForgotPassword(req, res) {
    res.render('auth/forgot-password', {
      title: 'Forgot Password',
      layout: 'layouts/auth',
    });
  }

  // Process forgot password
  static async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/auth/forgot-password');
      }

      const { email } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        req.flash('success', 'If your email exists in our system, you will receive a reset link.');
        return res.redirect('/auth/forgot-password');
      }

      // TODO: Implement email sending for password reset
      // For now, just show success message
      req.flash('success', 'Password reset link sent to your email.');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Forgot password error:', error);
      req.flash('error', 'An error occurred. Please try again.');
      res.redirect('/auth/forgot-password');
    }
  }

  // Show profile page
  static async showProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/admin');
      }

      res.render('admin/profile', {
        title: 'My Profile',
        layout: 'layouts/admin',
        profileUser: user,
        currentPage: 'profile',
        user: req.user,
      });
    } catch (error) {
      console.error('Profile error:', error);
      req.flash('error', 'Error loading profile');
      res.redirect('/admin');
    }
  }

  // Update profile
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/admin/profile');
      }

      const { firstName, lastName, bio, website } = req.body;
      const updateData = {
        firstName,
        lastName,
        bio,
        website,
      };

      await UserModel.update(req.user.id, updateData);

      req.flash('success', 'Profile updated successfully');
      res.redirect('/admin/profile');
    } catch (error) {
      console.error('Profile update error:', error);
      req.flash('error', 'Error updating profile');
      res.redirect('/admin/profile');
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/admin/profile');
      }

      const { currentPassword, newPassword } = req.body;

      // Get current user with password
      const user = await UserModel.findByEmail(req.user.email);
      
      // Validate current password
      const isValidPassword = await UserModel.validatePassword(currentPassword, user.password);
      if (!isValidPassword) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect('/admin/profile');
      }

      // Update password
      await UserModel.update(req.user.id, { password: newPassword });

      req.flash('success', 'Password changed successfully');
      res.redirect('/admin/profile');
    } catch (error) {
      console.error('Change password error:', error);
      req.flash('error', 'Error changing password');
      res.redirect('/admin/profile');
    }
  }
}

module.exports = AuthController;
