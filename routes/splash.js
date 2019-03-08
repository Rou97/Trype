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

router.get('/books', async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findById(_id);
    res.render('main/books', { user });
  } catch (error) {
    next(error);
  }
});

router.get('/books/add-book', (req, res, next) => {
  res.render('main/add-book');
});

router.post('/books/add-book/search', (req, res, next) => {
  const { title } = req.body;
  api.search(title, function (error, results) {
    if (!error) {
      console.log(results[0].authors);
      res.render('main/add-book', { results });
    } else {
    }
  });
});

router.post('/books/add-book/new', (req, res, next) => {
  const { title, authors, ISBN, image } = req.body;
  console.log(title);
  res.render('main/add-book');
});

router.get('/matches', (req, res, next) => {
  res.render('main/matches');
});

module.exports = router;
