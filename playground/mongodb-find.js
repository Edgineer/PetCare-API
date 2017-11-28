// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//two arguements
//1: URL where database lives
//2: callback function firing after connection succeed/fail
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  //find returns a MongoDB cursor, pointer to the documents
  //find takes an arguement known as the querey, specify which values to find
  //toArray gives us the documents as an array and attaches a promise so we can use then and error handle
  db.collection('Todos').find({ //querey by ObjectID
    _id: new ObjectID('5a19ea3aa4914bfa0619781b')
  }).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos',err);
  });

  db.collection('Users').find({username: 'Alma'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch user',err);
  });


  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos',err);
  // });

  //db.close();
});
