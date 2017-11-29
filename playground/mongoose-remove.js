const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Delete multiple records
// Task.remove({}).then((result) => {
//   console.log(result);
// });

//returns the document
Task.findOneAndRemove({
  _id: '5a1b8a6aa4914bfa0619e522'
}).then((task) => {
  console.log(task);
});

Task.findByIdAndRemove('5a1b8a6aa4914bfa0619e522').then((task) => {
  console.log(task);
});
