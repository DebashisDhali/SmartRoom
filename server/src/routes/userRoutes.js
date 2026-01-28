const express = require('express');
const { registerUser, loginUser, logout, getUserDetails, updateProfile } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router = express.Router();

const upload = require('../middlewares/multer');

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/me/update', isAuthenticatedUser, upload.single('avatar'), updateProfile);

module.exports = router;
