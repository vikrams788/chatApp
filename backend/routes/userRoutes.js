const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { upload } = require('../middleware/multerMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', upload.single("pic"), userController.signup);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.get('/search', authMiddleware, userController.searchUsers);

module.exports = router;