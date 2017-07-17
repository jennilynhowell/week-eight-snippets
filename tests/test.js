const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');
const User = require('../models/user');
const Snip = require('../models/snippet');
const createPasswordObject = require('../controllers/helpers').createPasswordObject;

describe('API User endpoint tests', () => {
  //before & after
  beforeEach((done) => {
    let userOne = new User({username: 'jlo', firstName: 'Jennilyn', password: createPasswordObject('hello')});
    let userTwo = new User({username: 'chopper', firstName: 'Luke', password: createPasswordObject('ball')});
    User.insertMany([userOne, userTwo]).then(done());
  });

  afterEach((done) => {
    User.deleteMany({}).then(done());
  });

  //viewOneUser
  it('can view one user at POST /API/user/viewOne', (done) => {
    let createUser = new User({username: 'bagelhoundz', firstName: 'LukeTheBagel', password: createPasswordObject('dino')});
    createUser.save().then(() => {
      request(app)
        .post('/api/user/viewOne')
        .send({_id: createUser._id})
        .expect(res => {
          expect(302);
          expect(res.body.data.firstName).to.equal('LukeTheBagel');
        }).end(done);
    });
  });

  //viewUsers
  it('can view all users at GET /API/user/viewAll', (done) => {
    request(app)
      .get('/api/user/viewAll')
      .expect(302)
      .expect(res => {
        expect(res.body.data[0].username).to.equal('jlo');
      }).end(done);
  });

  //createUser
  it('can create user at POST /API/user/create', (done) => {
    let createUser = new User({username: 'suzieq', firstName: 'Suzie', password: createPasswordObject('queue')});
    request(app)
      .post('/api/user/create')
      .send(createUser)
      .expect(res => {
        expect(201);
        expect(res.body.data.firstName).to.equal('Suzie');
      }).end(done);
  });

});

//password object creation
describe('password hash function', () => {
  it('can create password object from string', done => {
    let pwObject = createPasswordObject('password', 'a');
    let expectedPwObject = {iterations: 100, salt: 'a', hash: 'pXN2J2eBnwuoYVeJYCTw0PYUnG8qxBl48AnMa94Q8tPxVnH9adPS/Upk314EdPVLk9NGEsET5/5eO0L8KEAIZAZblXsjN/nY0lGeu6dQlu+qagQLtk3jTChiYLQ32w+bPoXEQeMAreJLtqNNLeaT2SY7y4Q8/uU1JGdcDKpXWrR/ZQ8iKEpJ0DKY8BKZEoWk1vYGbLQt6miO8y+zRSzQyN1YRZNkw4XF0AA7stxaRYD/MlL7bcP8rYYHGxVM5dQpsFK3amD4ObCkixeFe982W6JQYD22PpQ3dt2QAzovMFAVgCyxYfMg4FK+cHcSBIzoriIsMUCjO0I2NPyOUesOog=='};
    expect(pwObject).to.deep.equal(expectedPwObject);
    done();
  });
});

describe('sanity test', () => {
  it('is working', (done) => {
    expect(10).to.equal(10);
    done();
  });
});
