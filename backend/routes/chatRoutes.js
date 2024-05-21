const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatControllers = require('../controllers/chatControllers');

router.get('/chat/:anotherUserId', authMiddleware, chatControllers.accessChat);
router.get('/all-chats', authMiddleware, chatControllers.fetchChat);

module.exports = router;