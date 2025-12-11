const User = require('../models/User');
const Blog = require('../models/Blog');

const search = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    let users = [];
    let blogs = [];

    if (type === 'all' || type === 'users') {
      users = await User.searchUsers(query);
    }

    if (type === 'all' || type === 'blogs') {
      blogs = await Blog.searchBlogs(query);
    }

    res.json({
      query,
      type,
      results: {
        users,
        blogs
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

module.exports = { search };