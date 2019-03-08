'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: Array
  },
  image: {
    type: String
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
