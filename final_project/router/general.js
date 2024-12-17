const express = require('express');
const axois = require('axios')
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const baseUrl = 'http://localhost:8080/'
public_users.post("/register", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password })
      return res.status(200).json({ Msg: "User successfully registered,Now you can login" })
    } else {
      return res.status(404).json({ Msg: "User already exists" })
    }
  }
})

// Get the book list available in the shop
public_users.get('/books', async function (req, res) {
  try {
    return res.status(300).json(books);
  } catch (error) {
    console.error('Error fetching Books', error.message)
    return res.status(500).json({ Msg: "Failed to fetch books" })
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbnNumber = req.params.isbn
  try {
    const booksArray = Object.values(books);
    const FilteredBookIsbn = booksArray.filter((book) => book.isbn === isbnNumber)
    return res.status(300).json(FilteredBookIsbn[0])
  } catch (error) {
    console.error('Error fetching book:', error.message);
    return res.status(500).json({ Msg: 'Failed to fetch book details' })
  }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author
  try {
    const booksArray = Object.values(books);
    const FilteredBookAuthor = booksArray.filter((book) => book.author === author)
    return res.status(300).json(FilteredBookAuthor[0])
  } catch (error) {
    console.error('Error fetching book:', error.message);
    return res.status(500).json({ Msg: 'Failed to fetch book details' })
  }

})

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title
  try {
    const booksArray = Object.values(books);
    const FilteredBookTitle = booksArray.filter((book) => book.title === title)
      return res.status(300).json(FilteredBookTitle);
  } catch (error) {
    console.error('Error fetching book:', error.message);
    return res.status(500).json({ Msg: 'Failed to fetch book details' })
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbnNumber = req.params.isbn
  const booksArray = Object.values(books);
  const FilteredBookIsbn = booksArray.filter((book) => book.isbn === isbnNumber)
  return res.status(300).json(FilteredBookIsbn[0]);
});

module.exports.general = public_users;
