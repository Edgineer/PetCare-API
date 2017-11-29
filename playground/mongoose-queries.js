const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Task} = require('./../server/models/task');
const {Pet} = require('./../server/models/pet');
const {Retask} = require('./../server/models/retask');
const {User} = require('./../server/models/user');

// var id = '5a1b4e780df40c35d851ecf000';

//   if(!ObjectID.isValid(id)){
//     console.log('invalid id');
//   }

// Todo.find({
//   _id: id
// }).then( (todos) =>{
//   console.log('Todos',todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then( (todo) =>{
//   console.log('Todo',todo);
// });

// Todo.findById(id).then( (todo) =>{
//   if (!todo) {
//     return console.log('id not found');
//   }
//   console.log('Todo By Id',todo);
// }).catch((e) => console.log(e));

// var id = '5a1a3cee7272192e40b7431d';
// User.findById(id).then( (user) => {
//   if(!user){
//     return console.log('user not found');
//   }
//   console.log('User found:',user);
// }).catch( (e) => console.log(e));
