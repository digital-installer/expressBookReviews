const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const fs = require("fs");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books:books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookListByAuthor = [];
  for (const book in books)
  {
      if (books[book].author === author)
      {
        books[book].isbn = book;
        delete books[book].title;
        bookListByAuthor.push(books[book]);
      }

  }


  res.send({booksbyauthor: bookListByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookListByTitle = [];

  for (const book in books)
  {
    if (books[book].title === title)
    {
      books[book].isbn = book;
      delete books[book].title;
      bookListByTitle.push(books[book]);
    }

  }
  res.send({booksbytitle: bookListByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

let booksAsync;

//function get axios response using Promises and callback function

booksAsync = new Promise((resolve , reject) =>
 {
    try {
      resolve(books);
    }
    catch(err)
    {
      reject(err)
    }
});

//async function get book by ISBN
 const  getBookByISBN = async (isbn) =>
{
  let bookObjectByISBN = {};
  let books = await booksAsync();
  if(books)
  {
    bookObjectByISBN = books[isbn];
    return bookObjectByISBN;
  }
}

//function get book by Author
const getBookByAuthor = async (author) =>
{
  let bookListByAuthor = {};
  let books = await booksAsync();
  if(books)
  {
    for (const book in books)
    {
      if (books[book].author === author)
      {
        bookListByAuthor.push(books[book]);
      }

    }
  }

  return bookListByAuthor;


}

//function get book by Title
const getBookByTitle  =  async (title) =>
{
  const bookListByTitle = [];
  let books = await booksAsync();
  if(books)
  {
    for (const book in books)
    {
      if (books[book].title === title)
      {
        bookListByTitle.push(books[book]);
      }
    }
  }

  return bookListByTitle;

}




module.exports.general = public_users;
