const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const comment = await Comment.create({
      userId,
      blogId,
      content
    });

    const fullComment = await Comment.findById(comment.commentid);

    res.status(201).json({
      message: 'Comment created successfully',
      comment: fullComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const comments = await Comment.findByBlog(blogId);
    
    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const isOwner = await Comment.isOwner(commentId, userId);
    if (!isOwner && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }

    const updatedComment = await Comment.update(commentId, content);
    
    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const isOwner = await Comment.isOwner(commentId, userId);
    if (!isOwner && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.delete(commentId);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

module.exports = {
  createComment,
  getBlogComments,
  updateComment,
  deleteComment
};