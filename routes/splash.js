// Raúl Miguel acuerdate de poner los putos flash
const express = require('express');
const User = require('../models/User');

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

router.get('/books', (req, res, next) => {
  res.render('main/books');
});

router.get('/matches', (req, res, next) => {
  res.render('main/matches');
});

module.exports = router;
