const db = require('../config/database');

class Like {
  static async toggle(likeData) {
    const { userId, blogId } = likeData;
    
    const checkQuery = 'SELECT * FROM Likes WHERE UserID = $1 AND BlogID = $2';
    const checkResult = await db.query(checkQuery, [userId, blogId]);
    
    if (checkResult.rows.length > 0) {
   
      await db.query('DELETE FROM Likes WHERE UserID = $1 AND BlogID = $2', [userId, blogId]);
      return { liked: false };
    } else {
      // Like
      const query = 'INSERT INTO Likes (UserID, BlogID) VALUES ($1, $2) RETURNING *';
      const result = await db.query(query, [userId, blogId]);
      return { liked: true, like: result.rows[0] };
    }
  }

  static async getLikesCount(blogId) {
    const query = 'SELECT COUNT(*) as count FROM Likes WHERE BlogID = $1';
    const result = await db.query(query, [blogId]);
    return parseInt(result.rows[0].count);
  }

  static async getUserLikes(userId, blogId) {
    const query = 'SELECT * FROM Likes WHERE UserID = $1 AND BlogID = $2';
    const result = await db.query(query, [userId, blogId]);
    return result.rows[0];
  }

  static async getUserAllLikes(userId) {
    const query = `
      SELECT l.*, b.Title, b.UserID as BlogAuthorId
      FROM Likes l
      JOIN Blogs b ON l.BlogID = b.BlogID
      WHERE l.UserID = $1
      ORDER BY l.CreatedAt DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Like;