import Fs from 'fs';
import Path from 'path';
import Http from 'http';
import SwaggerTools from 'swagger-tools';
import Jsyaml from 'js-yaml';
import Express from 'express';
import Mongoose from 'mongoose';
import IncludeAll from 'include-all';
import Passport from 'passport';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import ExpressSession from 'express-session';
import Cors from 'cors';
import Helmet from 'helmet';
import ConnectMongo from 'connect-mongo';
import HttpStatus from 'http-status';
import { config } from 'dotenv'

import APIError from './helper/APIError.js';

import mongooseDefaultFields from './middlewares/mongooseDefaultFields.js';
import mongooseDefaultIndexes from './middlewares/mongooseDefaultIndexes.js';
import mongooseDocExtend from './middlewares/mongooseDocExtend.js';
import mongooseDocMethodsOverride from './middlewares/mongooseDocMethodsOverride.js';

config();
const app = Express();
const mongoStore = ConnectMongo(ExpressSession);

// swaggerRouter configuration
const options = {
  swaggerUi: Path.join(__dirname, '/swagger.json'),
  controllers: Path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

const host = process.env.HOST;
const port = process.env.PORT;
const env = process.env.NODE_ENV;

const mongoUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?reconnectTries=10&reconnectInterval=3000`


// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = Fs.readFileSync(Path.join(__dirname, 'api/swagger.yaml'), 'utf8');
const swaggerDoc = Jsyaml.safeLoad(spec);

Mongoose.Promise = require('bluebird');

// mongoose plugins
Mongoose.plugin(mongooseDefaultFields);
Mongoose.plugin(mongooseDefaultIndexes);
Mongoose.plugin(mongooseDocExtend);
Mongoose.plugin(mongooseDocMethodsOverride);


Mongoose.connect(mongoUrl);
Mongoose.connection.on('open', () => {
  console.log('--> Mongoose connected:', mongoUrl);

  const models = IncludeAll({
      dirname: Path.join(__dirname, './models'),
      filter: /^[^\.].*\.js$/
  }) || {};

  for (let model in models) {
      if (models[model].model) {
          models[model].model();
      }
  }

  // Initialize the Swagger middleware
  SwaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {

    app.use(CookieParser());
    app.use(BodyParser.json({
        limit: '1mb'
    }));
    app.use(BodyParser.urlencoded({
        extended: true
    }));

    // session
    app.use(ExpressSession({
        name: process.env.APP_NAME,
        secret: process.env.SESSION_SECRET,
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 86400000 // 1 hour
        },
        resave: false,
        saveUninitialized: true,
        rolling: true,
        store: new mongoStore({
            mongooseConnection: Mongoose.connection
        })
    }));

    // passport
    app.use(Passport.initialize());
    app.use(Passport.session());
    require('./middlewares/authStrategies.js')(app, Passport);

    // security
    app.use(Cors());
    app.use(Helmet());

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
      const err = new APIError('API not found', HttpStatus.NOT_FOUND);
      return next(err);
    });

    app.use((err, req, res, next) => {

      let errorResponse = {
        message: err.isPublic
          ? err.message
          : HttpStatus[err.status]
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
    Http.createServer(app).listen(port, host, () => {
      console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
      console.log('Swagger-ui is available on http://localhost:%d/docs', port);
    });
  });

});
Mongoose.connection.on('error', (err) => {
  console.log('--> Mongoose failed to connect:', mongoUrl, err);
  Mongoose.disconnect();
});
Mongoose.connection.on('close', () => {
  console.log('--> Mongoose connection closed');
});
