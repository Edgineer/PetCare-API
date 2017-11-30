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
// POST SIGN UP feature
app.post('/users/signup/:username/:password', (req,res) => {

  var user = new User({
    username:req.params.username,
    password:req.params.password
  });

  user.save().then((user) => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//GET LOGIN feature
app.get('/users/login/:username/:password', (req,res) => {
  User.findOne({
    username:req.params.username,
    password:req.params.password
  }).then( (user) =>{
    if (!user) {
      res.status(404).send();
    }
    res.status(200).send(user); //may need to return only petIds and Object ID
  }).catch((e) => {
    res.status(400).send();
  });
});

//PUT  Add an exsisting pet to the user petIds array
app.put('/users/addpet/:userid/:petid',(req,res) => {
  var petid = req.params.petid;
  var userid = req.params.userid;

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid)){
      return res.status(404).send();
  }

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(userid)){
      return res.status(404).send();
  }

  //make sure petid is in the Pet collection
  Pet.findById(petid).then( (pet) => {
    if(!pet){
      res.status(404).send();
    }
  }).catch((e) => {
    res.status(400).send();
  });

  //add the pet to the user petIds array
  User.findOneAndUpdate( {_id:userid}, {$push:{petIds:petid}}, {new: true}).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  }).catch((e) => {
    res.status(400).send();
  });
});

// POST
app.post('/users/createpet/:userid/:petname', (req,res) => {
  var petname = req.params.petname;
  var userid = req.params.userid;

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(userid)){
      return res.status(404).send();
  }

  var pet = new Pet({
    name:petname
  });

  pet.save().then((pet) => {
    var petid = pet._id;
    User.findOneAndUpdate( {_id:userid}, {$push:{petIds:petid}}, {new: true}).then((user) => {
      if (!user) {
         return res.status(404).send();
      }
      res.status(200).send(user);
    }).catch((e) => {
       res.status(400).send();
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});
//////////////////////////////////////////////////
/*           PET Collection Routes             */
//////////////////////////////////////////////////
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
//POST
app.post('/tasks/create/:petid/:text',(req, res) => {
  var petid = req.params.petid;
  var text = req.params.text;

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid)){
      return res.status(404).send();
  }

  //petid must already exists
  Pet.findById(petid).then( (pet) =>{
    if (!pet) {
      return res.status(404).send();
    }
  }).catch((e) => {
    return res.status(400).send();
  });

  var task = new Task({
    text: text,
    forPet: petid
  });

  task.save().then((doc) =>{
    res.send(doc);
  }).catch((e) => {
    res.status(400).send();
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
