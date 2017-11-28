var mongoose = require('mongoose');

var Pet = mongoose.model('Pet',{
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  ownerIds:  {
    type:[mongoose.Schema.Types.ObjectId]//,
    //required: true
  }
});

module.exports = {
  Pet:Pet
};
