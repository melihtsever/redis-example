const express = require('express');
const routes = require('../routes');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const methodOverride = require('method-override');
const error = require('../middleware/error');
const morgan = require('morgan');
const helmet = require('helmet');
const { logs } = require('./vars');


/**
* Express instance
* @public
*/
const app = express()

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());


// mount api routes
app.use('/api', routes);

app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);





module.exports = app