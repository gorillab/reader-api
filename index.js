import fs from 'fs';
import path from 'path';
import http from 'http';
import swaggerTools from 'swagger-tools';
import jsyaml from 'js-yaml';
import express from 'express';
import mongoose from 'mongoose';
import includeAll from 'include-all';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import connectMongo from 'connect-mongo';
import httpStatus from 'http-status';

import {db} from './config/database.js';
import {host, port, env} from './config/index.js';
import {session} from './config/session.js';
import APIError from './helper/APIError.js';

const app = express();
const mongoStore = connectMongo(expressSession);

// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

mongoose.Promise = require('bluebird');

// mongoose plugins
mongoose.plugin(require('./middlewares/mongooseDefaultFields.js'));
mongoose.plugin(require('./middlewares/mongooseDefaultIndexes.js'));
mongoose.plugin(require('./middlewares/mongooseDocExtend.js'));
mongoose.plugin(require('./middlewares/mongooseDocMethodsOverride.js'));

mongoose.connect(db.mongodb.url);
mongoose.connection.on('open', () => {
  console.log('--> Mongoose connected:', db.mongodb.url);

  const models = includeAll({
      dirname: path.join(__dirname, './models'),
      filter: /^[^\.].*\.js$/
  }) || {};

  for (let model in models) {
      if (models[model].model) {
          models[model].model();
      }
  }

  // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {

    app.use(cookieParser());
    app.use(bodyParser.json({
        limit: '1mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // session
    app.use(expressSession({
        name: session.name,
        secret: session.secret,
        cookie: session.cookie,
        resave: session.resave,
        saveUninitialized: session.saveUninitialized,
        rolling: session.rolling,
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }));

    // passport
    app.use(passport.initialize());
    app.use(passport.session());
    require('./middlewares/authStrategies.js')(app, passport);

    // security
    app.use(cors());
    app.use(helmet());

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new APIError('API not found', httpStatus.NOT_FOUND);
      return next(err);
    });

    app.use((err, req, res, next) => {

      let errorResponse = {
        message: err.isPublic
          ? err.message
          : httpStatus[err.status]
      }

      if(env == 'development') {
        console.log(err.stack);
        errorResponse.stack = err.stack || {}
      }

      res.status(err.status).json(errorResponse);
    });

    // if error is not an instanceOf APIError, convert it.
    app.use((err, req, res, next) => {
      if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status, err.isPublic);
        return next(apiError);
      }
      return next(err);
    });

    // Start the server
    http.createServer(app).listen(port, host, () => {
      console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
      console.log('Swagger-ui is available on http://localhost:%d/docs', port);
    });
  });

});
mongoose.connection.on('error', (err) => {
  console.log('--> Mongoose failed to connect:', db.mongodb.url, err);
  mongoose.disconnect();
});
mongoose.connection.on('close', () => {
  console.log('--> Mongoose connection closed');
});
