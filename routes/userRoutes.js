const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  followUser, 
  unfollowUser 
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/profile/:userId?', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/follow/:followingId', authenticate, followUser);
router.delete('/unfollow/:followingId', authenticate, unfollowUser);

module.exports = router;