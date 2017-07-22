const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');
const User = require('../models/user');
const Snip = require('../models/snippet');
const createPasswordObject = require('../controllers/helpers').createPasswordObject;

describe('APP User endpoint tests', () => {
  beforeEach((done) => {
    let userOne = new User({username: 'jlo', firstName: 'Jennilyn', password: createPasswordObject('hello')});
    let userTwo = new User({username: 'chopper', firstName: 'Luke', password: createPasswordObject('ball')});
    User.insertMany([userOne, userTwo]).then(done());
  });

  afterEach((done) => {
    User.deleteMany({}).then(done());
  });

  it('can create user at POST /APP/user/signup', (done) => {
    let createUser = new User({username: 'suzieq', firstName: 'Suzie', password: createPasswordObject('queue')});
    request(app)
      .post('/app/user/signup')
      .send(createUser)
      .expect(res => {
        expect(201);
      }).end(done);
  });

  it('can log user in at POST /APP/user/login', (done) => {
    request(app)
      .post('/app/user/signup')
      .send({username: 'chopper', password: createPasswordObject('ball')})
      .expect(res => {
        expect(201);
      }).end(done);
  });


});

describe('APP Snip endpoint tests', () => {
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
      tags: ['JavaScript', 'HelloWorld'],
      notes: ['My first JS snippet', 'How cool is JavaScript!']
    });
    let snipThree = new Snip({
      userId: "54cd7171d3e0fb1b302e56f7",
      title: 'oh snip',
      body: 'const EVERYTHING = require("EVERYTHING");',
      language: 'JS',
      tags: ['JavaScript', 'Node'],
      notes: ['Oh Node', 'Oh, oh Node']
    });
    Snip.insertMany([snipOne, snipTwo, snipThree]).then(snips => {
      done();
    });
  });

  afterEach((done) => {
    Snip.deleteMany({}).then(done());
  });

  it('can add a snip at POST /APP/addsnip', (done) => {
    let createSnip = new Snip ({
      userId: "54cd6669d3e0fb1b302e57g8",
      title: 'gettin snippy',
      body: 'let pizza = "delicious";',
      language: 'JS',
      tags: ['JavaScript', 'pizza'],
      notes: ['My second JS snippet']
    });
    request(app)
      .post('/app/addsnip')
      .send(createSnip)
      .expect(res => {
        expect(201);
      }).end(done);
  });

  it('can view snips by tag or lang at POST /APP/snip/viewBy', (done) => {
    request(app)
      .post('/app/snip/viewBy')
      .send({userId: "54cd6669d3e0fb1b302e56f7", filter: "Language: JS"})
      .expect(200)
      .end(done);
  });

  it('can delete a snip at POST /APP/snip/deleteSnip', (done) => {
    let createSnip = new Snip ({
      userId: "54cd6669d3e0fb1b302e57g8",
      title: 'gettin snippy',
      body: 'let pizza = "delicious";',
      language: 'JS',
      tags: ['JavaScript', 'pizza'],
      notes: ['My second JS snippet']
    });
    request(app)
      .post('/app/snip/deleteSnip')
      .send({id: createSnip._id})
      .expect(302)
      .end(done);
  });

});

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
      tags: ['JavaScript', 'HelloWorld'],
      notes: ['My first JS snippet', 'How cool is JavaScript!']
    });
    let snipThree = new Snip({
      userId: "54cd7171d3e0fb1b302e56f7",
      title: 'oh snip',
      body: 'const EVERYTHING = require("EVERYTHING");',
      language: 'JS',
      tags: ['JavaScript', 'Node'],
      notes: ['Oh Node', 'Oh, oh Node']
    });
    Snip.insertMany([snipOne, snipTwo, snipThree]).then(snips => {
      done();
    });
  });

  afterEach((done) => {
    Snip.deleteMany({}).then(done());
  });

  //view snips by tag
  it('can view snips by tag at GET /API/snip/tag/:tag', (done) => {
    request(app)
      .get('/api/snip/tag/JavaScript')
      .expect(302)
      .expect(res => {
        expect(res.body.data.length).to.equal(2);
      }).end(done);
  });

  //view snips by language
  it('can view all snips by language at GET /API/snip/:language', (done) => {
    request(app)
      .get('/api/snip/HTML')
      .expect(302)
      .expect(res => {
        expect(res.body.data.length).to.equal(1);
      }).end(done);
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
    let snipOne = new Snip({
      userId: "54cd6669d3e0fb1b302e55e6",
      title: 'Hello Snip',
      body: '<h1> Hello World </h1>',
      language: 'HTML',
      tags: ['HelloWorld', 'HTML'],
      notes: ['How cool is HTML!']
    });
    snipOne.save().then(() => {
      request(app)
        .post('/api/snip/viewOne')
        .send({_id: snipOne._id})
        .expect(res => {
          expect(302);
          expect(res.body.data.language).to.equal('HTML');
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
