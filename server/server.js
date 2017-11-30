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

app.post('/users/createpet/:userid/:petname', (req,res) => {
  var petname = req.params.petname;
  var userid = req.params.userid;

  //validate userid using isValid, send back 404 & empty
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

app.post('/pets/createtask/:petid/:text',(req, res) => {
  var petid = req.params.petid;
  var text = req.params.text;

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid)){
      return res.status(404).send();
  }

  var task = new Task({
    text: text,
  });

  task.save().then((task) => {
    var taskid = task._id;
    Pet.findOneAndUpdate( {_id:petid}, {$push:{taskIds:taskid}}, {new: true}).then((pet) => {
      if (!pet) {
         return res.status(404).send();
      }
      res.status(200).send(pet);
    }).catch((e) => {
      res.status(400).send();
    });
  }).catch((e) =>{
    res.status(400).send(e);
  });
});

app.delete('/pets/deletetask/:petid/:taskid',(req, res) => {
  var petid = req.params.petid;
  var taskid = req.params.taskid;

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid) || !ObjectID.isValid(taskid)){
      return res.status(404).send();
  }

  Task.findOneAndRemove({_id:taskid}).then( (task) =>{
    if (!task) {
      return res.status(404).send();
    }
    //remove taskid from the pets taskid array
    Pet.findOneAndUpdate( {_id:petid}, {$pullAll:{taskIds:[taskid]}}, {new: true}).then((pet) => {
      if (!pet) {
         return res.status(404).send();
      }
      res.status(200).send(pet);
    }).catch((e) => {
      res.status(400).send();
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/pets/createretask/:petid/:text',(req, res) => {
  var petid = req.params.petid;
  var text = req.params.text;

  //validate petid using isValid, send back 404 & empty
  if(!ObjectID.isValid(petid)){
      return res.status(404).send();
  }

  var retask = new Retask({
    text: text,
  });

  retask.save().then((retask) => {
    var retaskid = retask._id;
    Pet.findOneAndUpdate( {_id:petid}, {$push:{retaskIds:retaskid}}, {new: true}).then((pet) => {
      if (!pet) {
         return res.status(404).send();
      }
      res.status(200).send(pet);
    }).catch((e) => {
      res.status(400).send();
    });
  }).catch((e) =>{
    res.status(400).send(e);
  });
});


//////////////////////////////////////////////////
/*           TASK Collection Routes             */
//////////////////////////////////////////////////
app.get('/tasks/:taskid',(req, res) => {
   var taskid = req.params.taskid;

   //validate id using isValid, send back 404 & empty
   if(!ObjectID.isValid(taskid)){
      return res.status(404).send();
   }

   //taskid must already exists
   Task.findById(taskid).then( (task) =>{
      if (!task) {
        return res.status(404).send();
      }
      res.status(200).send(task);
    }).catch((e) => {
      return res.status(400).send();
    });
});

//////////////////////////////////////////////////
/*         RETASK Collection Routes             */
//////////////////////////////////////////////////
app.get('/retasks/:retaskid',(req, res) => {
   var retaskid = req.params.retaskid;

   //validate id using isValid, send back 404 & empty
   if(!ObjectID.isValid(retaskid)){
      return res.status(404).send();
   }

   //retaskid must already exists
   Retask.findById(retaskid).then( (retask) =>{
      if (!retask) {
        return res.status(404).send();
      }
      res.status(200).send(retask);
    }).catch((e) => {
      return res.status(400).send();
    });
});

app.put('/retasks/reset',(req,res) => {
  // Update multiple documents using the multi option
  Retask.update({},{$set:{completed:false}},{multi:true}).then( () => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send(e);
  });
});

////////////////////////////////////////////////////////////////////////////////
app.listen(port, () =>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
