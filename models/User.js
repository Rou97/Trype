'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  books: [{
    item: {
      type: ObjectId,
      ref: 'Book'
    },
    status: {
      type: String
    }
  }],
  location: {
    type: String
  },
  Image: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
