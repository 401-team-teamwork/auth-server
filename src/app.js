'use strict';

// 3rd Party Resources

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require( './middleware/error.js');
const notFound = require( './middleware/404.js' );

// Prepare the express app
const app = express();

//Route files
const authRouter = require( './auth/router.js' );

// App Level MW
app.use(cors());
app.use(morgan('dev'));
app.use('/docs', express.static('./docs'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Home Route
app.get('/', (request, response) => {
  response.status(200).send('App is up!');
});

app.use(authRouter);

// Catchalls
app.use('/*', notFound);
app.use(errorHandler);

//swagger

const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
    info: {
      description: 'API Server',
      title: 'SuperType Revolution Docs!',
      version: '1.0.1',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      'application/json',
    ],
    schemes: ['http'],
    securityDefinitions: {
      basicAuth: {
        type: 'basic',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['./auth/router.js'], //Path to the API handle folder
};
expressSwagger(options);

module.exports = {
  server: app,
  start: (port) => app.listen(port || 3000, () => console.log(`Server up on port ${port}`) ),
};



