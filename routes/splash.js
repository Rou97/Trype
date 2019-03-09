// Raúl Miguel acuerdate de poner los putos flash
const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const api = require('google-books-search');

const { requireUser } = require('../middlewares/auth');

const router = express.Router();

router.get('/', requireUser, (req, res, next) => {
  res.render('main/splash');
});

router.get('/profile', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findById(_id);
    res.render('main/profile', { user });
  } catch (error) {
    next(error);
  }
});

router.get('/books', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findById(_id).populate('books.item');
    console.log(user);
    res.render('main/books', { user });
  } catch (error) {
    next(error);
  }
});

router.get('/books/add-book', requireUser, (req, res, next) => {
  res.render('main/add-book');
});

router.post('/books/add-book/search', requireUser, (req, res, next) => {
  const { title } = req.body;
  api.search(title, function (error, results) {
    if (!error) {
      console.log(results[0].authors);
      res.render('main/add-book', { results });
    } else {
    }
  });
});

router.post('/books/add-book/new', requireUser, async (req, res, next) => {
  const { title, authors, ISBN, image } = req.body;
  const { _id } = req.session.currentUser;
  const newBook = {
    ISBN,
    title,
    authors,
    image
  };
  try {
    // console.log(req.session.currentUser.username);
    if (await Book.findOne({ ISBN: true })) {
      console.log('ya esta creado');
    } else {
      const newBookCreated = new Book(newBook);
      const book = await newBookCreated.save();
      const userUpdated = await User.findByIdAndUpdate(_id, { $push: { books: { item: book._id, status: 'haves' } } }, { new: true });

      console.log(userUpdated);
    }
    res.render('main/add-book');
  } catch (error) {
    next(error);
  }
});

router.get('/matches', requireUser, (req, res, next) => {
  res.render('main/matches');
});

module.exports = router;
