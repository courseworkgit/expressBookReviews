const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
	const username = req.body.username
	const password = req.body.password

	if (username && password) {
		if (!isValid(username)) {
			users.push({username: username, password: password})
			return res.status(200).json({
				message: 'User successfully registered. Now you can login',
			})
		} else {
			return res.status(404).json({message: 'User already exists!'})
		}
	}
	return res.status(404).json({message: 'Unable to register user.'})
})
 

const getAllBooksPromise = async () => {
	try {
		const allBooksPromise = await Promise.resolve(books)
		if (allBooksPromise) {
			return allBooksPromise
		} else {
			return Promise.reject(new Error('No books found.'))
		}
	} catch (err) {
		console.log(err)
	}
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get the book list available in the shop
public_users.get('/asyncget',async function (req, res) {
	const data = await getAllBooksPromise()
	res.json(data)
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn]; 
    res.send(JSON.stringify(book));
 });
 
 const getIsbnPromise = async book => {
	try {
		const IsbnPromise = await Promise.resolve(book)
		if (IsbnPromise) {
			return IsbnPromise
		} else {
			return Promise.reject(new Error('No isbn found.'))
		}
	} catch (err) {
		console.log(err)
	}
}
// Get book details based on ISBN
public_users.get('/isbnsynch/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]; 

	const data = await getIsbnPromise(book);
	res.json(data);
})

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    const booksFromAuthor = [];  
  
  for (const book in books) {  
    if (books[book].author === author) {  
        booksFromAuthor.push(books[book]);
    }
  }
    res.send(JSON.stringify(booksFromAuthor));
 });
 
 const getAuthorPromise = async author => {
	try {

        if (author) {
            const authorArray = []
			Object.values(books).map(book => {
				if (book.author === author) {
					authorArray.push(book)
				}
			})
			return Promise.resolve(authorArray)
		} else {
			return Promise.reject(new Error('Could not retrieve Author Promise.'))
		}
	} catch (err) {
		console.log(err)
	}
}
// Get book details based on author
public_users.get('/asynchauthor/:author', async function (req, res) {
    const author = req.params.author
    

	const data = await getAuthorPromise(author);
    
	res.json(data);
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

    res.send(JSON.stringify(filteredBooks));
 });
 
 const getTitlePromise = async title => {
	try {

        if (title) {
            const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
			Object.values(title).map(book => {
				if (book.title === title) {
					filteredBooks.push(title)
				}
			})
			return Promise.resolve(filteredBooks)
		} else {
			return Promise.reject(new Error('Could not retrieve Title Promise.'))
		}
	} catch (err) {
		console.log(err)
	}
}
// Get all books based on title
public_users.get('/asynchtitle/:title', async function (req, res) {
    const author = req.params.author
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
    

	const data = await getTitlePromise(title);
    
	res.json(data);
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const reviews = books[isbn].reviews;
    res.send(JSON.stringify(reviews));
 });

module.exports.general = public_users;
