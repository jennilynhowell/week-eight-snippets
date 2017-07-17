const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');
const User = require('../models/user');
const Snip = require('../models/snippet');
const createPasswordObject = require('../controllers/helpers').createPasswordObject;

describe('API Snip endpoint tests', () => {
  //before & after
  beforeEach((done) => {
    let snipOne = new Snip({
      userId: "54cd6669d3e0fb1b302e55e6",
      title: 'snipOne',
      body: '<h1> Hello World </h1>',
      language: 'HTML',
      tags: ['HelloWorld', 'HTML'],
      notes: ['My first HTML snippet', 'How cool is HTML!']
    });
    let snipTwo = new Snip({
      userId: "54cd6669d3e0fb1b302e56f7",
      title: 'snipTwo',
      body: 'let cool = true;',
      language: 'JS',
      tags: ['JavaScript'],
      notes: ['My first JS snippet', 'How cool is JavaScript!']
    });
    Snip.insertMany([snipOne, snipTwo]).then(done());
  });

  afterEach((done) => {
    Snip.deleteMany({}).then(done());
  });

  //createSnip
  it('can create snip at POST /API/snip/create', (done) => {
    let createSnip = new Snip ({
      userId: "54cd6669d3e0fb1b302e57g8",
      title: 'gettin snippy',
      body: 'let pizza = "delicious";',
      language: 'JS',
      tags: ['JavaScript', 'pizza'],
      notes: ['My second JS snippet']
    });
    request(app)
      .post('/api/snip/create')
      .send(createSnip)
      .expect(res => {
        expect(201);
        expect(res.body.data.title).to.equal('gettin snippy');
      }).end(done);
  });

  //view all snips
  it('can view all snips at GET /API/snip/viewAll', (done) => {
    request(app)
      .get('/api/snip/viewAll')
      .expect(302)
      .expect(res => {
        expect(res.body.data[0].title).to.equal('snipOne');
      }).end(done);
  });

  //view one snip
  it('can view one snip at POST /API/snip/viewOne', (done) => {
    let createSnip = new Snip({
      userId: "54cd7779d3e0fb1b302e57g8",
      title: 'oh snip',
      body: 'let pizza = "delicious";',
      language: 'JS',
      tags: ['JavaScript', 'pizza'],
      notes: ['My second JS snippet']
    });
    createSnip.save().then(() => {
      request(app)
        .post('/api/snip/viewOne')
        .send({_id: createSnip._id})
        .expect(res => {
          expect(302);
          expect(res.body.data.language).to.equal('CSS');
        }).end(done);
    });
  });

});

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
