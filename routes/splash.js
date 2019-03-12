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
    res.render('main/books', { user });
  } catch (error) {
    next(error);
  }
});

// router.post('/books/:id', requireUser, async (req, res, next) => {
//   const { _id } = req.session.currentUser;
//   let { select } = req.body;
//   const bookId = req.params.id;
//   const user = await User.findById(_id);
//   const book = await Book.findById(bookId);

//   const user2 = await User.findOneAndUpdate({ _id: user, 'books.item': book }, { $set: { 'books.$.status': select } });

//   res.render('main/books');
// });

router.post('/books/:id/delete', requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  const user = await User.findById(_id);
  try {
    const deleteBookOnList = await User.findByIdAndUpdate(_id, { $pull: { books: { item: id } } }, { new: true });
    res.redirect('/splash/books');
  } catch (error) {
    next(error);
  }
});

router.get('/books/add-book-wants', requireUser, (req, res, next) => {
  res.render('main/add-book-wants');
});

router.get('/books/add-book-got', requireUser, (req, res, next) => {
  res.render('main/add-book-got');
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
      return book._id.equals(userBooks._id);
    });

    if (!isInFavorites) {
      const updatedUser = await User.findByIdAndUpdate(_id, { $push: { books: { item: book._id, status: 'wants' } } }, { new: true });
      req.session.currentUser = updatedUser;
    }

    // aqui
    const user = await User.findById(_id);

    const test = await User.find();

    // entra en un loop para comprobar cada usuario
    for (let i = 0; i < test.length; i++) {
      for (let j = 0; j < test.length; j++) {
        // console.log(test[i].books[j].status.toString());
        if ((book._id.toString() === test[i].books[j].item.toString()) && test[i].books[j].status.toString() === 'got') {
          // Aqui entra solo si es got
          console.log(test[i].email);
        }
      }
    }

    res.redirect('/splash/books');
  } catch (error) {
    next(error);
  }
});

router.get('/matches', requireUser, (req, res, next) => {
  res.render('/main/matches');
});

router.post('/matches', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;

  const user = await User.findById(_id);
  // const arr = [];
  // for (let i = 0; i < user.books.length; i++) {
  //   if (user.books[i].status === 'wants') {
  //     const itemForSwap = user.books[i].item;

  //     const test = await Book.findById(itemForSwap);

  //     const test2 = test._id;

  //     const test3 = await User.find({ 'books.item': test2 });

  //     for (let j = 0; j < test3.length; j++) {
  //       arr.push(test3[j]._id);
  //       arr.push(test3[j].books[j].status);
  //       console.log(arr);
  //       console.log('                 ');
  //     }

  //     if (arr[1] !== arr[3]) {
  //       console.log('Match!');
  //     }
  //   }
  // }

  res.redirect('/splash/matches');
});

module.exports = router;
