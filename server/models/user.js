var mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const _ = require('lodash');
// const bcrypt = require('bcryptjs');

var User = mongoose.model('User',{
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1
  },
  petIds:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[]
  },
  petNames:{
    type:[String],
    default:[]
  }
});

module.exports = {
  User:User
};
