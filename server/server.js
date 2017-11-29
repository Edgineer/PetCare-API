require('./config/config.js')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Pet} = require('./models/pet');
var {User} = require('./models/user');
var {Task} = require('./models/task');
var {Retask} = require('./models/retask');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//////////////////////////////////////////////////
/*           USER Collection Routes             */
//////////////////////////////////////////////////

// POST /users/signup SIGN UP feature
app.post('/users/signup', (req,res) => {
  var body = _.pick(req.body,['username','password']);
  var user = new User(body);

  user.save().then((user) => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//POST(really a get) /users/login {email, password}
app.post('/users/login', (req,res) => {
  var body = _.pick(req.body,['username','password']);
  User.findOne({
    username:body.username,
    password:body.password
  }).then( (user) =>{
    if (!user) {
      res.status(404).send();
    }
    res.status(200).send({user}); //may need to return only petIds and Object ID
  }).catch((e) => {
    res.status(400).send();
  });
});

//PATCH /users/newpet add an exsisting pet to the user petIds array pass in userid in the body
app.patch('/users/newpet/:petid',(req,res) => {
  var petid = req.params.petid;
  var body = _.pick(req.body,['userid']);

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid)){
      return res.status(404).send();
  }

  User.findOneAndUpdate( {_id:body.userid}, {$push:{petIds:petid}}, {new: true}).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send({user});
  }).catch((e) => {
    res.status(400).send();
  });
});

//////////////////////////////////////////////////
/*           PET Collection Routes             */
//////////////////////////////////////////////////
// POST /pets/create
//perhaps instead of requiring the userid to be sent as an array in an ownerIds array we can find a way
//to create the default array and pass in the array using push
app.post('/pets/create', (req,res) => {
  var body = _.pick(req.body,['name','ownerIds']);
  var pet = new Pet(body);

  pet.save().then((pet) => {
    res.send(pet);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//Add a new owner to the Pet ownerIds
//requires adding the petId to the user petIds array

//Remove an owner from the Pet ownerIds
//DELETE an owner from the pets owner group
//would require deleting the pet from the owners petIds

//give me my pet information
//GET pet document based on a pet ID
app.get('/pets/me/:petid',(req,res) => {
  var petid = req.params.petid;

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid)){
      return res.status(404).send();
  }

  Pet.findById(petid).then( (pet) =>{
    if (!pet) {
      res.status(404).send();
    }
    res.status(200).send(pet);
  }).catch((e) => {
    res.status(400).send();
  });
});

//////////////////////////////////////////////////
/*           TASK Collection Routes             */
//////////////////////////////////////////////////
//create a new task
//POST
app.post('/tasks/create/:petid',(req, res) => {
  var petid = req.params.petid;
  var body = _.pick(req.body,['text']);

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid)){
      return res.status(404).send();
  }

  var task = new Task({
    text: req.body.text,
    forPet: petid
  });

  task.save().then((doc) =>{
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//complete a task
//PATCH set the completed field to true
app.patch('/tasks/complete/:taskid',(req,res) => {
  var taskid = req.params.taskid;

  //validate id using isValid, send back 404 & empty
  if(!ObjectID.isValid(taskid)){
      return res.status(404).send();
  }
                       // { $set: { "details.make": "zzz" } }
  Task.findOneAndUpdate({_id: taskid}, {$set: {completed:true}}, {new: true}).then((task) => {
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send({task});
  }).catch((e) => {
    res.status(400).send();
  });
});

//get all tasks for a pet that are not completed
//GET
 app.get('/tasks/:petid',(req, res) => {
   var petid = req.params.petid;

   //validate id using isValid, send back 404 & empty
   if(!ObjectID.isValid(petid)){
       return res.status(404).send();
   }

   Task.find({
     forPet:petid,
     completed:false
   }).then((tasks) => {
     res.send({tasks});
   }, (e) => {
     res.status(400).send(e);
   });
});

//delete completed tasks
// app.get('/tasks/:taskid', (req,res) => {
//   var taskid = req.params.taskid;
//
//   //validate id using isValid, send back 404 & empty
//   if(!ObjectID.isValid(taskid)){
//       return res.status(404).send();
//   }
//   Task.findById(taskid).then( (task) =>{
//     if (!task) {
//       res.status(404).send();
//     }
//     res.status(200).send({task});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

//////////////////////////////////////////////////
/*         RETASK Collection Routes             */
//////////////////////////////////////////////////

//create a new task
//complete a task
//uncomplete a tasks
//delete completed tasks
//get all tasks for a pet that are not completed

////////////////////////////////////////////////////////////////////////////////
app.listen(port, () =>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
