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

    req.getValidationResult.then((result) => {
      if (result) {
        errors = result.array();
        message = errors[0].msg;

        let context = {
          username: req.body.username,
          message: message
        };

        res.render('signup', context);

      //if no errors, create user in db
      } else {
        let username = req.body.username
          , password = req.body.password
          , newUser = new User ({
            username: username,
            password: createPasswordObject(password)
          });

        //then create session & move to home page
        newUser.save().then(user => {
          req.session.user = user._id;
          req.session.name = user.username;

          res.redirect('/app/home');
        });
      };
    });
  },

  login: (req, res) => {
    req.checkBody('username', 'Please pick a username').notEmpty();
    req.checkBody('password', 'Please pick a password').notEmpty();

    req.getValidationResult.then((result) => {
      if (result) {
        errors = result.array();
        message = errors[0].msg;

        let context = {
          username: req.body.username,
          message: message
        };

        res.render('login', context);

      //if no errors, confirm user is in db
      } else {
        let username = req.body.username
          , password = req.body.password;

        User.findOne({username: username}).then(user => {
          let pwObject = user.password
            , enteredPwObject = createPasswordObject(password, pwObject.salt);

          if (!user || pwObject.hash !== enteredPwObject.hash) {
            res.render('login', {message: 'Something went wrong.'});

          //if no database validation error, create session
          } else {
            req.session.user = user._id;
            req.session.name = user.username;

            res.redirect('/app/home');
          };
        });
      };
    });
  },

  home: (req, res) => {
    let id = req.session.user;
    Snip.find({userId: id}).then(snips => {
      let context = {
        user: req.session.username,
        snips: snips
      }
      res.render('home', context);
    });
  },

  //end exports
};
