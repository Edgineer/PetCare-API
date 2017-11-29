const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Pet} = require('./models/pet');
var {User} = require('./models/user');
var {Task} = require('./models/task');
var {Retask} = require('./models/retask');

var app = express();
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
  })
});

app.listen(3000, () =>{
  console.log('Started on port 3000');
});

module.exports = {app};
