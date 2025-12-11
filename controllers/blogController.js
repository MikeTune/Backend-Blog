const Blog = require('../models/Blog');
const db = require('../config/database');

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;

    const blog = await Blog.create({
      userId,
      title,
      content
     
    });

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

const getBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Failed to get blog' });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.getAll();
    res.json({ blogs });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ error: 'Failed to get blogs' });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const blogs = await Blog.findByUser(userId);
    res.json({ blogs });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ error: 'Failed to get user blogs' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    // Check if blog exists and user is owner
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.userid !== userId && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to update this blog' });
    }


    const updatedBlog = await Blog.update(blogId, updateData);
    
    res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.userId;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.userid !== userId && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to delete this blog' });
    }

    await Blog.delete(blogId);
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

module.exports = {
  createBlog,
  getBlog,
  getAllBlogs,
  getUserBlogs,
  updateBlog,
  deleteBlog
};