require('dotenv').config();


const bodyParser = require('body-parser');
const express = require('express');
const debugLogger = require('./debugLogger').init();
const CONSTANTS = require('./constants');

/*
 * CONFIGURE EXPRESS SERVER
 */
var app = express();

app.enable('trust proxy');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('Strict-Transport-Security', 'max-age=200'); 
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'deny');
  res.set('X-Powered-By', '');
  res.set('X-XSS-Protection', '1; mode=block');
  next();
});

/*
 * DEFINE ERROR HANDLER
 */
app.use((error, req, res, next) => {
  const response = {...CONSTANTS.RESPONSE_OBJECT};
  response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
  response.error.message = error.message || 'Internal Server Error';
  response.error.status = error.status || 500;
  response.success = false;

  res.status(error.status || 500).send(response);
});

/*
 * IMPORT ROUTES
 */
require('./routes/inventory')(app, debugLogger);
require('./routes/sfcc_inventory')(app, debugLogger);
require('./routes/order')(app, debugLogger);
require('./routes/checkoutDiscount')(app, debugLogger);
require('./routes/sso')(app, debugLogger);
require('./routes/orderCompositeRequest')(app, debugLogger);

/*
 * INSTANTIATE EXPRESS SERVER
 */
const server = app.listen(process.env.PORT || 5000);

module.exports = server;
