const express = require("express");
const { authenticateUser, createUser } = require("./db/sqlDb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Endpoint to track user login
app.post("/login", (req, res) => {
  const { username, password, ipAddress, browser, os, deviceType } = req.body;
console.log('--->',req.body);
  // Define callback function to handle response from authenticateUser
  const callback = (response) => {
    console.log(response);
    // Send response back to the client
    res.status(response.status ? 200 : 400).json(response);
  };

  // Call authenticateUser with callback function
  authenticateUser(
    username,
    password,
    ipAddress,
    browser,
    os,
    deviceType,
    callback
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const callback = (val) => {
    console.log(val);
  };
  // createUser("vishal", "admin", callback);
});
