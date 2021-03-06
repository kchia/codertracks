'use strict';

var apiRouter = require('../api/api-router.js'); //client-server api
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var dataProcessingRouter = require('../dataProcessing/dataProcessing-router.js');
var helpers = require('./helpers.js'); // our custom middleware
var morgan = require('morgan'); // used for logging incoming request
var path = require('path');

module.exports = function(app, express) {
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
  app.use(express.static(path.join(__dirname + '../../../dist')));
  //api is the router for all of our client-server api endpoints
  app.use('/api', apiRouter);
  //dataProcessing router is for all our internal data processing, and is only used once when we import the data
  app.use('/dataProcessing', dataProcessingRouter);
};
