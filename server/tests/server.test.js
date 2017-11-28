const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Task} = require('./../models/task');
const {User} = require('./../models/user');
const {Retask} = require('./../models/retask');
const {Pet} = require('./../models/pet');

beforeEach((done) => {
  Task.remove({}).then(() => done());
});

describe('POST/tasks', () => {
  it('should create a new task',(done) => {
    var text = 'Test task text';
    var forPet = 'myfluffers';
    request(app)
      .post('/tasks')
      .send({text,forPet})
      .expect(200)
      .expect( (res) => {
        expect(res.body.text).toBe(text);
        expect(res.body.forPet).toBe(forPet);
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }
        Task.find({text,forPet}).then((task) => {
          expect(task.length).toBe(1);
          expect(task[0].text).toBe(text);
          expect(task[0].forPet).toBe(forPet);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should not create a new todo with invalid data',(done) => {
     request(app)
       .post('/tasks')
       .send({})
       .expect(400)
       .end((err,res) => {
         if (err) {
           return done(err);
         }
         Task.find().then((task) => {
           expect(task.length).toBe(0);
           done();
       }).catch((e) => done(e));
     });
   });
});
