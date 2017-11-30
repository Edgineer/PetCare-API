var mongoose = require('mongoose');

var Pet = mongoose.model('Pet',{
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  taskIds:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[]
  },
  retaskIds:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[]
  }
});

module.exports = {
  Pet:Pet
};
