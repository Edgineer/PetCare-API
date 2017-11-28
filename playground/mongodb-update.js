const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }

  // //findOneAndUpdate
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5a1a000ea4914bfa0619812a')
  },  {
    $set: {
        completed: true
    }
  },{
    returnOriginal: false
  }).then( (result) => {
    console.log(result);
  });

  //findOneAndUpdate (parameters include filter which is a querey, update look in mongoDB update operators)
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a19e363c5f7942e880a41fc') //what to querey for
  },  {
    $inc: {age: 1}, //what to update using update operators, see docs for arrays
    $set: {
        username: 'Esperanza'
    }
  },{
    returnOriginal: false
  }).then( (result) => {
    console.log(result);
  });

  //db.close();
});
