var mongoose = require('mongoose');

var Task = mongoose.model('Task',{
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:  {
    type: Boolean,
    default: false
  }
});

module.exports = {
  Task:Task
};
