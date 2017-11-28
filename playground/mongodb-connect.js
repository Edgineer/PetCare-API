const {MongoClient, ObjectID} = require('mongodb');

//two arguements
//1: URL where database lives
//2: callback function firing after connection succeed/fail
MongoClient.connect('mongodb://localhost:27017/PetCareApp',(err,db) =>{
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }

  var obj = new ObjectID();
  var obj2 = new ObjectID();
  //db.collection takes a single string specifying which collection to add the document to
  //insertOne takes two parameters, the document and a callback function
  db.collection('Users').insertOne({
    username:"Edgineer",
    password:"letmein",
    petIds:[obj,obj2]
  }, (err,result) => {
    if (err) {
      return console.log('unable to insert to user', err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
    //console.log(result.ops[0]._id.getTimestamp());
  });
  db.close();
});
