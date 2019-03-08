'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  ISBN: {
    type: String,
    required: true,
    unique: true
  },
  Title: {
    type: String,
    required: true
  },
  Author: {
    type: Array
  },
  Image: {
    type: String
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
