const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a username is valid (exists in the users array)
const isValid = (username) => {
  const userWithSameName = users.filter((user) => user.username === username);
  return userWithSameName.length > 0;
};

// Authenticate user by checking username and password
const authenticatedUser = (username, password) => {
  const validUsers = users.filter((user) => user.username === username && user.password === password);
  return validUsers.length > 0;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ Msg: "Error logging in: Username or password missing" });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate Access Token
    const accessToken = jwt.sign(
      { data: username },
      "access", // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Store token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).json({ Msg: "User successfully logged in", accessToken });
  } else {
    return res.status(401).json({ Msg: "Invalid login: Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if user is logged in
  if (!req.session.authorization) {
    return res.status(403).json({ Msg: "You need to log in to post a review." });
  }

  const username = req.session.authorization.username;

  // Check if book with the given ISBN exists
  const book = Object.values(books).find((b) => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ Msg: "Book not found" });
  }

  // Add or modify the review
  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review; // Add or update the user's review
  return res.status(200).json({
    Msg: "Review successfully added/modified",
    reviews: book.reviews,
  });
});

// Remove a review (Optional Feature)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  if (!req.session.authorization) {
    return res.status(403).json({ Msg: "You need to log in to delete a review." });
  }

  const username = req.session.authorization.username;

  const book = Object.values(books).find((b) => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ Msg: "Book not found" });
  }

  if (book.reviews && book.reviews[username]) {
    delete book.reviews[username]; // Remove the user's review
    return res.status(200).json({ Msg: "Review successfully deleted", reviews: book.reviews });
  } else {
    return res.status(404).json({ Msg: "Review not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;