const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models');
const appController = require('./controllers/appControllers.js');
const apiController = require('./controllers/apiControllers.js');

module.exports = (app) => {
  //api endpoints
  apiRouter.post('/snip/create', apiControllers.createSnip);
  apiRouter.post('/user/create', apiControllers.createUser);

  apiRouter.get('/snip/viewAll', apiControllers.viewSnips);
  apiRouter.get('/user/viewAll', apiControllers.viewUsers);

  apiRouter.get('/snip', apiControllers.viewOneSnip);
  apiRouter.get('/user', apiControllers.viewOneUser);

  apiRouter.post('/snip/viewByLang', apiControllers.viewSnipsByLang);

  apiRouter.post('/snip/viewByTag', apiControllers.viewSnipsByTag);

  app.use('/api', apiRouter);

  //app endpoints

  //app.use('/app', appRouter);
};
