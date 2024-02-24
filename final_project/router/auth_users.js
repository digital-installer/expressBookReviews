const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>
{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user)=>
                    {
                      return (user.username === username && user.password === password)
                    });
      if(validUsers.length > 0)
      {
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
      //Write your code here
      const username = req.body.username;
      const password = req.body.password;

      if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
      }

      if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: username,
          username: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
          accessToken,username
        }
        return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const user = req.user;
    const username = user.username;
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) { //Check is book exists
        let review = req.body.review;
        books[isbn].reviews[username] = {"review":review};

        res.status(200).json({book: books[isbn],  message: `Book with isbn ${isbn} updated.` });
    }
    else{
        res.send("Unable to find and update book!");
    }
});

// Delete a review by logged in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const user = req.user;
    const username = user.username;
    const isbn = req.params.isbn;
    if (books[isbn]) { //Check is book exists
        let review = req.body.review;
        delete books[isbn].reviews[username];
        res.status(200).json({book: books[isbn],  message: `Book with isbn ${isbn} updated.` });
    }
    else{
        res.send("Unable to find and update book!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
