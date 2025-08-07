const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateLogin, validateRegister, validateForgotPassword } = require('../middleware/validation');
const { redirectIfAuth } = require('../middleware/auth');

// Login routes
router.get('/login', redirectIfAuth, AuthController.showLogin);
router.post('/login', validateLogin, AuthController.login);

// Register routes
router.get('/register', redirectIfAuth, AuthController.showRegister);
router.post('/register', validateRegister, AuthController.register);

// Logout route
router.post('/logout', AuthController.logout);
router.get('/logout', AuthController.logout);

// Forgot password routes
router.get('/forgot-password', redirectIfAuth, AuthController.showForgotPassword);
router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);

module.exports = router;
