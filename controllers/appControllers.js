const User = require('../models/user');
const Snip = require('../models/snippet');
const createPasswordObject = require('./helpers').createPasswordObject;

module.exports = {
  getSignup: (req, res) => {
    res.render('signup', {});
  },

  getLogin: (req, res) => {
    res.render('login', {});
  },

  createUser: (req, res) => {
    //form validation
    req.checkBody('username', 'Please pick a username').notEmpty();
    req.checkBody('password', 'Please pick a password').notEmpty();
    req.checkBody('passconf', "Oops, your passwords don't match").notEmpty().equals(req.body.password);

    req.getValidationResult().then((result) => {
      //if not errors, create & log in new user
      if (result.isEmpty()) {
        let username = req.body.username
          , firstName = req.body.firstname
          , password = req.body.password
          , newUser = new User ({
            username: username,
            firstName: firstName,
            password: createPasswordObject(password)
          });

        //then create session & move to home page
        newUser.save().then(user => {
          if (user.err) {
            let context = {message: "Sorry, somethign went wrong."}
            res.render('signup', context);
          } else {
            req.session._id = user._id;
            req.session.username = user.username;
            req.session.firstname = user.firstName;

            res.redirect('/app/home');
          }

        });


      //if errors, alert user
//TODO  mess with errors
      } else {
        errors = result.array();
        console.log(errors);
        // message = errors[0].msg;

        let context = {
          username: req.body.username,
          //message: message
        };

        res.render('signup', context);
      };
    });
  },

  login: (req, res) => {
    req.checkBody('username', 'Please pick a username').notEmpty();
    req.checkBody('password', 'Please pick a password').notEmpty();

    req.getValidationResult().then((result) => {
      if (result.isEmpty()) {
        let username = req.body.username
          , password = req.body.password;

        User.findOne({username: username}).then(user => {
          let pwObject = user.password
            , enteredPwObject = createPasswordObject(password, pwObject.salt);

          if (!user || pwObject.hash !== enteredPwObject.hash) {
            res.render('login', {message: 'Something went wrong.'});

          //if no database validation error, create session
          } else {
            req.session._id = user._id;
            req.session.username = user.username;
            req.session.firstname = user.firstName;

            res.redirect('/app/home');
          };
        });


      //if no errors, confirm user is in db
      } else {
        errors = result.array();
        message = errors[0].msg;

        let context = {
          username: req.body.username,
          message: message
        };

        res.render('login', context);
      };
    });
  },

  home: (req, res) => {
    let id = req.session.user;
    Snip.find({userId: id}).then(snips => {
      let context = {
        id: req.session._id,
        user: req.session.username,
        name: req.session.firstname,
        snips: snips
      }
      res.render('home', context);
    });
  },

  logout: (req, res) => {
    delete req.session.user;
    delete req.session.name;
    res.redirect('/app/user/login');
  },

  //end exports
};
