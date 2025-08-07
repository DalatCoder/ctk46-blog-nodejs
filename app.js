const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const { engine } = require('express-handlebars');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const moment = require('moment');
require('dotenv').config();

// Import routes
const adminRoutes = require('./src/routes/admin');
const authRoutes = require('./src/routes/auth');
const frontendRoutes = require('./src/routes/frontend');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false,
}));

app.use(cors());

// Trust proxy (important for getting real IP addresses)
app.set('trust proxy', 1);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin-template', express.static(path.join(__dirname, 'admin-template')));
app.use('/html-template', express.static(path.join(__dirname, 'html-template')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for development (even in HTTP)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  name: 'sessionId', // Custom session name
}));

// Flash messages
app.use(flash());

// Debug session middleware (commented out for cleaner logs)
// app.use((req, res, next) => {
//   console.log('🌐 Request:', req.method, req.path);
//   console.log('🆔 Session ID:', req.sessionID);
//   console.log('📦 Session data:', JSON.stringify(req.session, null, 2));
//   console.log('🍪 Cookies:', req.headers.cookie);
//   console.log('---');
//   next();
// });

// View engine setup (Handlebars)
const hbs = engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src/views/layouts'),
  partialsDir: [
    path.join(__dirname, 'src/views/partials'),
    path.join(__dirname, 'src/views/partials/admin'),
    path.join(__dirname, 'src/views/partials/frontend'),
  ],
  helpers: {
    // Date formatting
    formatDate: function(date, format) {
      if (!date) return '';
      
      // Handle Handlebars context - if format is an object, use default format
      if (typeof format === 'object' || format === undefined) {
        format = 'MMMM DD, YYYY';
      }
      
      // Ensure format is a string
      if (typeof format !== 'string') {
        format = 'MMMM DD, YYYY';
      }
      
      return moment(date).format(format);
    },
    
    // Current year
    currentYear: function() {
      return new Date().getFullYear();
    },
    
    // Time ago
    timeAgo: function(date) {
      if (!date) return '';
      return moment(date).fromNow();
    },
    
    // Equality check
    eq: function(a, b) {
      return a === b;
    },
    
    // Not equal check
    neq: function(a, b) {
      return a !== b;
    },
    
    // Greater than
    gt: function(a, b) {
      return a > b;
    },
    
    // Less than
    lt: function(a, b) {
      return a < b;
    },
    
    // Logical AND
    and: function(a, b) {
      return a && b;
    },
    
    // Logical OR
    or: function(a, b) {
      return a || b;
    },
    
    // Conditional helper
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
    
    // JSON stringify
    json: function(context) {
      return JSON.stringify(context);
    },
    
    // Truncate text
    truncate: function(text, length) {
      if (typeof length === 'object' || length === undefined) {
        length = 100;
      }
      if (text && text.length > length) {
        return text.substring(0, length) + '...';
      }
      return text;
    },
    
    // Substring
    substring: function(text, start, end) {
      if (!text) return '';
      if (typeof start === 'object') start = 0;
      if (typeof end === 'object') end = text.length;
      return text.substring(start, end);
    },
    
    // Strip HTML tags
    stripTags: function(html) {
      return html ? html.replace(/<[^>]*>/g, '') : '';
    },
    
    // Capitalize first letter
    capitalize: function(text) {
      return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
    },
    
    // Pluralize
    pluralize: function(count, singular, plural) {
      return count === 1 ? singular : plural;
    },
    
    // Generate pagination
    pagination: function(current, total, baseUrl) {
      const pages = [];
      const range = 2; // Show 2 pages before and after current
      
      for (let i = Math.max(1, current - range); i <= Math.min(total, current + range); i++) {
        pages.push({
          number: i,
          url: `${baseUrl}?page=${i}`,
          current: i === current
        });
      }
      
      return pages;
    }
  }
});

app.engine('hbs', hbs);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// Global variables for templates
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.currentUrl = req.originalUrl;
  res.locals.currentPath = req.path;
  res.locals.query = req.query;
  next();
});

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', frontendRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('frontend/404', {
    title: 'Page Not Found',
    layout: 'main',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Application error:', err);
  
  // Set default error status
  const status = err.status || 500;
  
  // Render appropriate error page based on route
  if (req.path.startsWith('/admin')) {
    res.status(status).render('admin/error', {
      title: 'Error',
      layout: 'layouts/admin',
      error: process.env.NODE_ENV === 'development' ? err : null,
      isDevelopment: process.env.NODE_ENV === 'development',
      message: err.message || 'An error occurred',
    });
  } else {
    res.status(status).render('frontend/error', {
      title: 'Error',
      layout: 'main',
      error: process.env.NODE_ENV === 'development' ? err : null,
      isDevelopment: process.env.NODE_ENV === 'development',
      message: err.message || 'An error occurred',
    });
  }
});

module.exports = app;
