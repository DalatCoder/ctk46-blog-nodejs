const moment = require('moment');

module.exports = {
  // Format date helper
  formatDate: function(date, format = 'MMM DD, YYYY') {
    if (!date) return '';
    return moment(date).format(format);
  },

  // Pluralize helper
  pluralize: function(count, singular, plural) {
    return count === 1 ? singular : plural;
  },

  // Truncate text helper
  truncate: function(text, length = 150) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Check equality helper
  eq: function(a, b) {
    return a === b;
  },

  // Check if value is in array
  inArray: function(value, array) {
    return array && array.includes(value);
  },

  // Generate excerpt from content
  excerpt: function(content, length = 200) {
    if (!content) return '';
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Format number with commas
  formatNumber: function(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Get current year
  currentYear: function() {
    return new Date().getFullYear();
  },

  // Check if user is authenticated
  isAuthenticated: function(user) {
    return user && user.id;
  },

  // Check if user is admin
  isAdmin: function(user) {
    return user && user.role === 'ADMIN';
  },

  // JSON stringify helper
  json: function(obj) {
    return JSON.stringify(obj);
  }
};
