const express = require('express');
const router = express.Router();
const { 
  toggleLike, 
  checkUserLike, 
  getUserLikes 
} = require('../controllers/likeController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/:blogId/toggle', authenticate, toggleLike);
router.get('/:blogId/check', authenticate, checkUserLike);
router.get('/user/likes', authenticate, getUserLikes);

module.exports = router;