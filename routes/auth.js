// Raúl Miguel acuerdate de poner los putos flash
const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');

const saltRounds = 10;

router.get('/signup', requireAnon, (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  // Extraer body
  const { username, password, email, location } = req.body;
  // Comprar que el usuario no existe en la base de datos
  try {
    const resultUsername = await User.findOne({ username });
    const resultEmail = await User.findOne({ email });
    if (resultUsername && resultEmail) {
      res.redirect('/auth/signup');
      return;
    }
    // Encryptar password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear el usuario
    const newUser = {
      username,
      password: hashedPassword,
      email,
      location
    };
    const createdUser = await User.create(newUser);
    // Guardamos el usuario en la session
    req.session.currentUser = createdUser;
    // Redirigimos para la homepage
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/login', requireAnon, (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  // Extraer información del body
  const { username, password } = req.body;
  try {
    // comprobar que el usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      res.redirect('/auth/login');
      return;
    }
    // comparar contrasena
    if (bcrypt.compareSync(password, user.password)) {
      // guardar la session
      req.session.currentUser = user;
      // redirigir
      res.redirect('/splash');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireUser, async (req, res, next) => {
  delete req.session.currentUser;

  res.redirect('/');
});

module.exports = router;
