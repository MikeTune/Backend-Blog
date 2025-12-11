const db = require('../config/database');

class User {
  static async create(userData) {
    const { username, email, password, name } = userData;
    console.log("username -- " , username);
    
    const query = `
      INSERT INTO Users (Username, Email, Password, Name)
      VALUES ($1, $2, $3, $4)
      RETURNING UserID, Username, Email, Name
    `;

    const values = [username, email, password, name];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM Users WHERE Email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM Users WHERE Username = $1';
    const result = await db.query(query, [username]);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = 'SELECT UserID, Username, Email, Name Role, CreatedAt FROM Users WHERE UserID = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async update(userId, updateData) {
    const { name, bio } = updateData;
    const query = `
      UPDATE Users 
      SET Name = COALESCE($1, Name), 
          Bio = COALESCE($2, Bio), 
          UpdatedAt = CURRENT_TIMESTAMP
      WHERE UserID = $4
      RETURNING UserID, Username, Email, Name, Role
    `;
    const values = [name, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async follow(followerId, followingId) {
    const query = `
      INSERT INTO Follows (FollowerID, FollowingID)
      VALUES ($1, $2)
      ON CONFLICT (FollowerID, FollowingID) DO NOTHING
      RETURNING *
    `;
    const result = await db.query(query, [followerId, followingId]);
    return result.rows[0];
  }

  static async unfollow(followerId, followingId) {
    const query = 'DELETE FROM Follows WHERE FollowerID = $1 AND FollowingID = $2';
    await db.query(query, [followerId, followingId]);
  }

  static async searchUsers(query) {
    const searchQuery = `
      SELECT UserID, Username, Name, CreatedAt
      FROM Users 
      WHERE to_tsvector('english', Username || ' ' || Name) @@ plainto_tsquery('english', $1)
      OR Username ILIKE $2 OR Name ILIKE $2
      LIMIT 50
    `;
    const likeQuery = `%${query}%`;
    const result = await db.query(searchQuery, [query, likeQuery]);
    return result.rows;
  }
}

module.exports = User;