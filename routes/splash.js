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
  try {
    const user = req.session.currentUser;
    res.render('main/profile', { user });
  } catch (error) {
    next(error);
  }
});

router.get('/profile-edit-view', requireUser, (req, res, next) => {
  const user = req.session.currentUser;
  res.render('main/profile-edit', { user });
});

router.post('/profile-edit-action', requireUser, async (req, res, next) => {
  console.log('entra');
  const { _id } = req.session.currentUser;
  const { username, email, location } = req.body;
  const updatedUser = await User.findByIdAndUpdate(_id, { username: username, email: email, location: location }, { new: true });
  req.session.currentUser = updatedUser;
  console.log(updatedUser);
  res.redirect('/splash/profile');
});

router.get('/books', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const user = await User.findById(_id).populate('books.item');
    res.render('main/books', { user });
  } catch (error) {
    next(error);
  }
});

router.post('/books/:id/delete', requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, { $pull: { books: { item: id } } }, { new: true });
    req.session.currentUser = updatedUser;
    // const deleteMatch = await User.findByIdAndUpdate(_id, { $pull: { match: { otherUserId: id } } }, { new: true });
    res.redirect('/splash/books');
  } catch (error) {
    next(error);
  }
});

router.get('/books/add-book-wants', requireUser, (req, res, next) => {
  res.render('main/add-book-wants');
});

router.post('/books/add-book-wants/search', requireUser, (req, res, next) => {
  const { title } = req.body;
  api.search(title, function (error, results) {
    if (!error) {
      res.render('main/add-book-wants', { results });
    } else {
    }
  });
});

router.post('/books/add-book-got/search', requireUser, (req, res, next) => {
  const { title } = req.body;
  api.search(title, function (error, results) {
    if (!error) {
      res.render('main/add-book-got', { results });
    } else {
    }
  });
});

router.post('/books/add-book-got/new', requireUser, async (req, res, next) => {
  const { title, authors, ISBN, image } = req.body;
  const newBook = {
    ISBN,
    title,
    authors,
    image
  };
  try {
    let book = await Book.findOne({ ISBN });

    if (!book) {
      book = await Book.create(newBook);
    }

    const { books, _id } = req.session.currentUser;

    const isInFavorites = books.some((userBooks) => {
      return book._id.equals(userBooks._id);
    });

    if (!isInFavorites) {
      const updatedUser = await User.findByIdAndUpdate(_id, { $push: { books: { item: book._id, status: 'got' } } }, { new: true });
      req.session.currentUser = updatedUser;
    }

    res.redirect('/splash/books');
  } catch (error) {
    next(error);
  }
});

router.post('/books/add-book-wants/new', requireUser, async (req, res, next) => {
  const { title, authors, ISBN, image } = req.body;
  const newBook = {
    ISBN,
    title,
    authors,
    image
  };
  try {
    let book = await Book.findOne({ ISBN });

    if (!book) {
      book = await Book.create(newBook);
    }

    const { books, _id } = req.session.currentUser;

    const isInFavorites = books.some((userBooks) => {
      return book._id.equals(userBooks.item);
    });

    if (!isInFavorites) {
      const updatedUser = await User.findByIdAndUpdate(_id, { $push: { books: { item: book._id, status: 'wants' } } }, { new: true });
      req.session.currentUser = updatedUser;
    }

    // match
    const user = req.session.currentUser;
    const test = await User.find();

    for (let i = 0; i < test.length; i++) {
      console.log(test[i].books);
      for (let j = 0; j < test[i].books.length; j++) {
        console.log(test[i].books[j]);
        if ((book._id.toString() === test[i].books[j].item.toString()) && test[i].books[j].status.toString() === 'got') {
          for (let k = 0; k < user.books.length; k++) {
            for (let l = 0; l < test[i].books.length; l++) {
              if ((user.books[k].item.toString() === test[i].books[l].item.toString()) && test[i].books[l].status.toString() === 'wants') {
                const updatedMatch = await User.findByIdAndUpdate(_id, { $push: { match: { otherUserId: test[i]._id, bookId: book._id, otherBookId: user.books[k].item } } }, { new: true });

                const updatedMatch2 = await User.findByIdAndUpdate(test[i]._id, { $push: { match: { otherUserId: user._id, bookId: user.books[k].item, otherBookId: book._id } } }, { new: true });
                req.session.currentUser = updatedMatch;
              }
            }
          }
        }
      }
    }

    res.redirect('/splash/books');
  } catch (error) {
    next(error);
  }
});

router.get('/matches', requireUser, async (req, res, next) => {
  const user = req.session.currentUser;
  let userMatch = [];
  let bookMatch = [];
  let bookId = [];
  for (let i = 0; i < user.match.length; i++) {
    userMatch = await User.findById(user.match[i].otherUserId);

    bookMatch = user.match[i].bookId;
    bookMatch = await Book.findById(bookMatch);
    bookId = user.match[i].otherBookId;
  }
  const imgBook = await Book.findById(bookId);
  console.log(imgBook);
  res.render('main/matches', { userMatch, bookMatch, user, imgBook });
});

// -------------------------------Route to view a details book ------------------------------//
router.get('/books/:id', requireUser, async (req, res, next) => {
  const { id } = req.params;
  // const { _id } = req.session.currentUser;
  try {
    const book = await Book.findById(id);
    console.log(book.author[0]);
    res.render('main/detail', { book });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
