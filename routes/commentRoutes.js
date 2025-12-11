const express = require('express');
const router = express.Router();
const { 
  createComment, 
  getBlogComments, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');


router.get('/blog/:blogId', getBlogComments);
router.post('/blog/:blogId', authenticate, createComment);
router.put('/:commentId', authenticate, updateComment);
router.delete('/:commentId', authenticate, deleteComment);

module.exports = router;