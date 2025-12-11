const express = require('express');
const router = express.Router();
const { 
  rateBlog, 
  getUserRating, 
  getBlogRatings 
} = require('../controllers/ratingController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, rateBlog);
router.get('/:blogId/user', authenticate, getUserRating);
router.get('/:blogId', getBlogRatings);

module.exports = router;