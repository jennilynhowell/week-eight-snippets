const express = require('express');
const bodyParser = require('body-parser');
const appControllers = require('./controllers/appControllers.js');
const apiControllers = require('./controllers/apiControllers.js');

module.exports = (app) => {
  const apiRouter = express.Router();
  const appRouter = express.Router();
  //api endpoints
  apiRouter.post('/snip/create', apiControllers.createSnip);
  apiRouter.post('/user/create', apiControllers.createUser);

  apiRouter.get('/snip/viewAll', apiControllers.viewSnips);
  apiRouter.get('/user/viewAll', apiControllers.viewUsers);

  apiRouter.post('/snip/viewOne', apiControllers.viewOneSnip);
  apiRouter.post('/user/viewOne', apiControllers.viewOneUser);

  apiRouter.post('/snip/viewByLang', apiControllers.viewSnipsByLang);

  apiRouter.post('/snip/viewByTag', apiControllers.viewSnipsByTag);

  app.use('/api', apiRouter);

  //app endpoints

  //app.use('/app', appRouter);
};
