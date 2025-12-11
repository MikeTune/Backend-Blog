const db = require('../config/database');

class Comment {

  static async create(commentData) {
    console.log("comment data",commentData )
    const { userId, blogId, content } = commentData;
    const query = `
      INSERT INTO Comments (UserID, BlogID, Content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [userId, blogId, content]);
    return result.rows[0];
  }

  static async findById(commentId) {
    const query = `
      SELECT c.*, u.Username, u.Name
      FROM Comments c
      JOIN Users u ON c.UserID = u.UserID
      WHERE c.CommentID = $1
    `;
    const result = await db.query(query, [commentId]);
    return result.rows[0];
  }

  static async findByBlog(blogId) {
    const query = `
      SELECT c.*, u.Username, u.Name
      FROM Comments c
      JOIN Users u ON c.UserID = u.UserID
      WHERE c.BlogID = $1
      ORDER BY c.CreatedAt ASC
    `;
    const result = await db.query(query, [blogId]);
    return result.rows;
  }

  static async update(commentId, content) {
    const query = `
      UPDATE Comments 
      SET Content = $1, UpdatedAt = CURRENT_TIMESTAMP
      WHERE CommentID = $2
      RETURNING *
    `;
    const result = await db.query(query, [content, commentId]);
    return result.rows[0];
  }

  static async delete(commentId) {
    const query = 'DELETE FROM Comments WHERE CommentID = $1';
    await db.query(query, [commentId]);
  }

  static async isOwner(commentId, userId) {
    const query = 'SELECT * FROM Comments WHERE CommentID = $1 AND UserID = $2';
    const result = await db.query(query, [commentId, userId]);
    return result.rows.length > 0;
  }
}

module.exports = Comment;