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
//TODO catch mongo rejection error!
          if (user.err) {
            console.log(user.err);
            let context = {message: "Sorry, something went wrong."}
            res.render('signup', context);
          } else {
            req.session._id = user._id;
            req.session.username = user.username;
            req.session.firstname = user.firstName;

            res.redirect('/app/home');
          }

        });

      //if errors, alert user
      } else {
        errors = result.array();
        message = errors[0].msg;

        let context = {
          username: req.body.username,
          message: message
        };

        res.render('signup', context);
      };
    });
  },

  login: (req, res) => {
    req.checkBody('username', 'Please enter your username').notEmpty();
    req.checkBody('password', 'Please enter your password').notEmpty();

    req.getValidationResult().then((result) => {
      if (result.isEmpty()) {
        let username = req.body.username
          , password = req.body.password;

        User.findOne({username: username}).then(user => {
          if (!user) {
            res.render('login', {message: 'Something went wrong.'});
          };

          let pwObject = user.password
            , enteredPwObject = createPasswordObject(password, pwObject.salt);

          if (pwObject.hash !== enteredPwObject.hash) {
            res.render('login', {message: 'Something went wrong.'});

          //if no database validation errors, create session
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
    let id = req.session._id
      , holding = [];
    Snip.find({userId: id}).then(snips => {
      for (let i = 0; i < snips.length; i++) {
          holding.push("Language: " + snips[i].language);
          for (let j = 0; j < snips[i].tags.length; j++) {
            holding.push("Tag: " + snips[i].tags[j]);
          };
        };

      let languages = Array.from(new Set(holding));
      languages = languages.sort();

      let context = {
        id: req.session._id,
        user: req.session.username,
        name: req.session.firstname,
        languages: languages,
        snips: snips
      }
      res.render('home', context);
    });
  },

  addSnip: (req, res) => {
    let userId = req.body.userId
      , title = req.body.title
      , body = req.body.body
      , language = req.body.language
      , tagsString = req.body.tags
      , tagsArray = tagsString.split(",")
      , notes = req.body.notes;

    let newSnip = new Snip({
      userId: userId,
      title: title,
      body: body,
      language: language,
      tags: tagsArray,
      notes: notes
    });

    newSnip.save().then(() => {
      res.redirect('/app/home');
    });

  },

  editSnip: (req, res) => {
    let id = req.params._id;
    Snip.findById(id).then(snip => {
      let context = {
        id: req.session._id,
        user: req.session.username,
        name: req.session.firstname,
        snip: snip
      };

      res.render('snip', context);
    });
  },

  viewBy: (req, res) => {
    let search = req.body.filter
      , userId = req.session._id
      , isLangSearch = false;

    if(search.includes("Language: ")){
      search = search.slice(10);
      isLangSearch = true;
    } else {
      search = search.slice(5);
    }

    if(isLangSearch){
      Snip.find({$and:
        [{userId: userId},
        {language: search}]
      }).then(snips => {
        let context = {
          id: req.session._id,
          user: req.session.username,
          name: req.session.firstname,
          snips: snips
        };

        res.render('snips-filtered', context);
      });
    } else {
      Snip.find({$and:
        [{userId: userId},
        {tags: {$in: [search]}}]
      }).then(snips => {
        let context = {
          id: req.session._id,
          user: req.session.username,
          name: req.session.firstname,
          snips: snips
        };

        res.render('snips-filtered', context);
      });
    }

  },

  postSnipEdit: (req, res) => {
    let id = req.params._id
      , title = req.body.title
      , body = req.body.body
      , language = req.body.language
      , tagsString = req.body.tags
      , tagsArray = tagsString.split(", ")
      , notes = req.body.notes;

    Snip.findById(id).then(snip => {
      snip.title = title;
      snip.body = body;
      snip.language = language;
      for (let i = 0; i < tagsArray.length; i++) {
        snip.tags.push(tagsArray[i]);
      };
      snip.notes.push(notes);

      snip.save().then(() => {
        res.redirect('/app/editSnip/' + id);
      });
    });

  },

  deleteSnip: (req, res) => {
    let id = req.body.id;

    Snip.remove({_id: id}).then(() => {
      res.redirect('/app/home');
    });
  },

  logout: (req, res) => {
    delete req.session.user;
    delete req.session.name;
    res.redirect('/app/user/login');
  },

  //end exports
};
