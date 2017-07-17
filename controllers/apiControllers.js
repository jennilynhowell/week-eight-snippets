const User = require('../models/user');
const Snip = require('../models/snippet');
const createPasswordObject = require('./helpers').createPasswordObject;

module.exports = {
  //USERS
  createUser: (req, res) => {
    let newUser = new User(req.body);
    newUser.save().then(user => {
      res.status(201).json({data: user});
    });
  },

  viewUsers: (req, res) => {
    User.find().then(users => {
      res.status(302).json({data: users});
    });
  },

  viewOneUser: (req, res) => {
    let id = req.body._id;
    User.findById(id).then(user => {
      res.status(302).json({data: user});
    });
  },

  //SNIPS
  createSnip: (req, res) => {
    let newSnip = new Snip(req.body);
    newSnip.save().then(snip => {
      res.status(201).json({data: snip});
    });
  },

  viewSnips: (req, res) => {
    Snip.find().then(snips => {
      res.status(302).json({data: snips});
    });
  },

  viewOneSnip: (req, res) => {
    let id = req.body._id;
    Snip.findById(id).then(snip => {
      res.status(302).json({data: snip});
    });
  },

  viewSnipsByLang: (req, res) => {},

  viewSnipsByTag: (req, res) => {}
};
