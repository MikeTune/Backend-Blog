const express = require('express');
const router = express.Router();
const { 
  createBlog, 
  getBlog, 
  getAllBlogs, 
  getUserBlogs, 
  updateBlog, 
  deleteBlog 
} = require('../controllers/blogController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', getAllBlogs);
router.get('/user/:userId?', authenticate, getUserBlogs);
router.get('/:blogId', getBlog);
router.post('/', authenticate, createBlog);
router.put('/:blogId', authenticate, updateBlog);
router.delete('/:blogId', authenticate, deleteBlog);

module.exports = router;