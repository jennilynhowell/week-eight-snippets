const express = require('express');
const app = express();
const mustache = require('mustache-express');
const path = require('path');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const session = require('express-session');
const parseurl = require('parseurl');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const routes = require('./router');

//models
const User = require('./models/user');
const Snip = require('./models/snippet');

//mongo setup
const env = process.env.NODE_ENV || 'development';
const mongoUrl = require('./config.json')[env].mongoUrl;
mongoose.connect(mongoUrl);

//templates
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

//middleware
app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
//
// app.use(session({
//   secret: 'keyboard cats',
//   resave: false,
//   saveUninitialized: true
// }));
//
// //require user to be logged in
// app.use(function(req, res, next){
//   let pathname = parseurl(req).pathname
//     , sess = req.session;
//
//   if (!sess.user && (!pathname.includes('/user/login'))){
//     res.redirect('/user/login');
//   } else {
//     next();
//   }
//
// });
module.exports = app;

routes(app);

app.listen(3000);
