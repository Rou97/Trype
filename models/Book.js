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
  subtitle: {
    type: String
  },
  authors: {
    type: Array
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  language: {
    type: String
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
