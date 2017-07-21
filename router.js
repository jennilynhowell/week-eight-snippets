const express = require('express');
const bodyParser = require('body-parser');
const appControllers = require('./controllers/appControllers.js');
const apiControllers = require('./controllers/apiControllers.js');

module.exports = (app) => {
  const apiRouter = express.Router();
  const appRouter = express.Router();

  app.get('/', (req, res) => {
    res.redirect('/app/user/signup');
  });

  //api endpoints
  apiRouter.post('/snip/create', apiControllers.createSnip);
  apiRouter.post('/user/create', apiControllers.createUser);

  apiRouter.get('/snip/viewAll', apiControllers.viewSnips);
  apiRouter.get('/user/viewAll', apiControllers.viewUsers);

  apiRouter.post('/snip/viewOne', apiControllers.viewOneSnip);
  apiRouter.post('/user/viewOne', apiControllers.viewOneUser);

  apiRouter.get('/snip/:language', apiControllers.viewSnipsByLang);

  apiRouter.get('/snip/tag/:tag', apiControllers.viewSnipsByTag);

  app.use('/api', apiRouter);

  //app endpoints
  appRouter.get('/user/signup', appControllers.getSignup),
  appRouter.post('/user/signup', appControllers.createUser);

  appRouter.get('/user/login', appControllers.getLogin),
  appRouter.post('/user/login', appControllers.login);

  appRouter.get('/home', appControllers.home);

  appRouter.post('/addsnip', appControllers.addSnip);

  appRouter.get('/user/logout', appControllers.logout);

  app.use('/app', appRouter);
};
