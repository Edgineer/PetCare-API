const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Pet} = require('./models/pet');
var {User} = require('./models/user');
var {Task} = require('./models/task');
var {Retask} = require('./models/retask');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/tasks',(req, res) => {
  var task = new Task({
    text: req.body.text,
    forPet: req.body.forPet
  });

  task.save().then((doc) =>{
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/tasks',(req, res) => {
  Task.find().then((tasks) => {
    res.send({tasks});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/tasks/:taskid', (req,res) => {
  var taskid = req.params.taskid;

  //validate id using isValid, send back 404 & empty
  if(!ObjectID.isValid(taskid)){
      return res.status(404).send();
  }
  Task.findById(taskid).then( (task) =>{
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send({task});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () =>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
