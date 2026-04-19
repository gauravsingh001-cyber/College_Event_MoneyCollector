const express = require('express');
const { register, login, googleLogin, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/profile', authenticate, getProfile);

module.exports = router;
