const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db/login_history_db.db");

// Create users table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
});

// Function to insert a new user into the database
const createUser = (username, password, callback) => {
  const insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.run(insertQuery, [username, password], function (err) {
    if (err) {
      console.error("Error inserting user:", err.message);
      callback({ status: false, message: err.message });
    } else {
      console.log("User inserted successfully with ID:", this.lastID);
      callback({
        status: true,
        message: "User inserted successfully",
        data: { userId: this.lastID },
      });
    }
  });
};

// Create user_login_history table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user_login_history (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      browser TEXT,
      os TEXT,
      device TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

// Function to authenticate user login
const authenticateUser = (
  username,
  password,
  ipAddress,
  browser,
  os,
  deviceType,
  callback
) => {
  console.log("Attempting to log in with username:", username);
  const selectQuery = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.get(selectQuery, [username, password], (err, row) => {
    if (err) {
      console.error("Error logging in user:", err.message);
      callback({ status: false, message: err.message });
    } else if (!row) {
      console.log("Invalid username or password");
      callback({ status: false, message: "Invalid username or password" });
    } else {
      const userId = row.id;
      const insertQuery =
        "INSERT INTO user_login_history (user_id, ip_address, browser, os, device) VALUES (?, ?, ?, ?, ?)";

      // Insert login history
      db.run(
        insertQuery,
        [userId, ipAddress, browser, os, deviceType],
        function (err) {
          if (err) {
            console.error("Error inserting login history:", err.message);
            callback({ status: false, message: err.message });
          } else {
            // Retrieve all user login history
            db.all(
              "SELECT * FROM user_login_history WHERE user_id = ? ",
              [userId],
              (err, rows) => {
                if (err) {
                  console.error("Error retrieving login history:", err.message);
                  callback({ status: false, message: err.message });
                } else {
                  console.log("User login history:", rows);
                  callback({
                    status: true,
                    message: "user login successfully",
                    data: rows,
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};

// Function to retrieve a user by username and password (for testing purposes)
const getUserByUsernameAndPassword = (username, password) => {
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        console.error("Error retrieving user:", err.message);
      } else {
        console.log("Retrieved user:", row);
      }
    }
  );
};

module.exports = { createUser, authenticateUser, getUserByUsernameAndPassword };
