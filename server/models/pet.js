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
  taskNames:{
    type:[String],
    default:[]
  },
  retaskIds:{
    type:[mongoose.Schema.Types.ObjectId],
    default:[]
  },
  retaskNames:{
    type:[String],
    default:[]
  }
});

module.exports = {
  Pet:Pet
};
