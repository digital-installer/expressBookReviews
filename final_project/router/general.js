const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
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
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
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
        bookListByAuthor.push(books[book]);
      }

  }
  res.send(bookListByAuthor);
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
      bookListByTitle.push(books[book]);
    }

  }
  res.send(bookListByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});


//function get axios response using Promises and callback function
async function getBooksList()
{
  const url = "https://akinbamigben-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/";
  let listOfAllBooks = [];

  const response  = await axios.get(url);
  listOfAllBooks = response.data;
  return listOfAllBooks;
}

//function get book by ISBN
 function getBookByISBN()
{
  const isbn = 1;
  const url = `https://akinbamigben-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`;
  let bookObjectByISBN = {};

  axios.get(url).then((response) => {
    bookObjectByISBN = response.data;
    return bookObjectByISBN;
  }).catch((error) => {
    console.log(error);
    bookObjectByISBN = {};
    return bookObjectByISBN;
  });
}

//function get book by Author
function getBookByAuthor()
{
  const author = "Chinua Achebe";
  const url = `https://akinbamigben-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`;
  let bookObjectByAuthor = {};

  axios.get(url).then((response) => {
    bookObjectByAuthor = response.data;
    return bookObjectByAuthor;
  }).catch((error) => {
    console.log(error);
    bookObjectByAuthor = {};
    return bookObjectByAuthor;
  });
}

//function get book by Title
function getBookByTitle()
{
  const title = "Fairy tales";
  const url = `https://akinbamigben-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`;
  let bookObjectByTitle = {};

   axios.get(url).then((response) => {
    bookObjectByTitle = response.data;
    return bookObjectByTitle;
  }).catch((error) => {
    console.log(error);
    bookObjectByTitle = {};
    return bookObjectByTitle;
  });
}




module.exports.general = public_users;
