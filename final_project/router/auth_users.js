const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
	{
		username: 'user1',
		password: 'password1',
	},
	{
		username: 'user2',
		password: 'password2',
	},
	{
		username: 'user3',
		password: 'password3',
	}
]


const isValid = (username)=>{ //returns boolean
	const userMatches = users.filter(user => user.username === username)
	return userMatches.length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
	//returns boolean
	const matchingUsers = users.filter(
		user => user.username === username && user.password === password
	)
	return matchingUsers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in'})
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{expiresIn: 60 * 60}
		)

		req.session.authorization = {
			accessToken,
			username,
		}
		return res.status(200).send('User successfully logged in')
	} else {
		return res
			.status(208)
			.json({message: 'Invalid Login. Check username and password'})
	}
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
