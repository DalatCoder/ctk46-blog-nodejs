const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

// Require authentication
const requireAuth = async (req, res, next) => {
  try {
    const token = req.session.token;
    
    console.log('🔐 Auth middleware - checking token for path:', req.path);
    console.log('🎫 Token exists:', !!token);
    console.log('📋 Session ID:', req.sessionID);
    console.log('🗂️ Session data:', JSON.stringify(req.session, null, 2));
    
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      req.flash('error', 'Please login to access this page');
      req.session.returnTo = req.originalUrl;
      return res.redirect('/auth/login');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', { id: decoded.id, email: decoded.email, role: decoded.role });
    
    // Get user details
    const user = await UserModel.findById(decoded.id);
    console.log('👤 User found:', user ? { id: user.id, email: user.email, role: user.role, status: user.status } : 'null');
    
    if (!user || user.status !== 'ACTIVE') {
      console.log('❌ User not found or inactive');
      req.session.token = null;
      req.flash('error', 'Invalid session. Please login again');
      return res.redirect('/auth/login');
    }

    // Add user to request object
    req.user = user;
    res.locals.user = user;
    
    console.log('✅ Auth middleware - user authenticated successfully');
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    req.session.token = null;
    req.flash('error', 'Invalid session. Please login again');
    res.redirect('/auth/login');
  }
};

// Require admin role
const requireAdmin = (req, res, next) => {
  console.log('👮 Admin middleware - checking user role');
  console.log('👤 Current user:', req.user ? { id: req.user.id, email: req.user.email, role: req.user.role } : 'null');
  
  if (!req.user) {
    console.log('❌ No user in request');
    req.flash('error', 'Authentication required');
    return res.redirect('/auth/login');
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'EDITOR') {
    console.log('❌ User role not sufficient:', req.user.role);
    req.flash('error', 'Access denied. Admin privileges required');
    return res.redirect('/');
  }

  console.log('✅ Admin access granted for user:', req.user.email);
  next();
};

// Require specific role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      req.flash('error', 'Authentication required');
      return res.redirect('/auth/login');
    }

    if (!roles.includes(req.user.role)) {
      req.flash('error', 'Access denied. Insufficient privileges');
      return res.redirect('/');
    }

    next();
  };
};

// Optional authentication (for frontend pages that can work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.session.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id);
      
      if (user && user.status === 'ACTIVE') {
        req.user = user;
        res.locals.user = user;
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
    console.log('Optional auth error (ignored):', error.message);
  }
  
  next();
};

// Redirect if already authenticated
const redirectIfAuth = (req, res, next) => {
  if (req.session.token) {
    return res.redirect('/admin');
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireRole,
  optionalAuth,
  redirectIfAuth,
};
