import Fs from 'fs';
import Path from 'path';
import Http from 'http';
import SwaggerTools from 'swagger-tools';
import Jsyaml from 'js-yaml';
import Express from 'express';
import Mongoose from 'mongoose';
import IncludeAll from 'include-all';
import Passport from 'passport';
import Logger from 'morgan';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import ExpressSession from 'express-session';
import Cors from 'cors';
import Helmet from 'helmet';
import ConnectMongo from 'connect-mongo';
import HttpStatus from 'http-status';
import bluebird from 'bluebird';
import { config } from 'dotenv';

import APIError from './helpers/APIError';
import mongooseDefaultFields from './middlewares/mongooseDefaultFields';
import mongooseDefaultIndexes from './middlewares/mongooseDefaultIndexes';
import mongooseDocExtend from './middlewares/mongooseDocExtend';
import mongooseDocMethodsOverride from './middlewares/mongooseDocMethodsOverride';

// Load .env
config();

// Load NewRelic
require('newrelic');

// Mongoose config
Mongoose.Promise = bluebird;
Mongoose.plugin(mongooseDefaultFields);
Mongoose.plugin(mongooseDefaultIndexes);
Mongoose.plugin(mongooseDocExtend);
Mongoose.plugin(mongooseDocMethodsOverride);

// Connect mongo
const mongoUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?reconnectTries=10&reconnectInterval=3000`;
Mongoose.connect(mongoUrl);
Mongoose.connection.on('open', () => {
  console.log(`Mongoose connected at ${mongoUrl}`);               // eslint-disable-line no-console
  // Bootstrap mongoose models
  const models = IncludeAll({
    dirname: Path.join(__dirname, './models'),
    filter: /^[^.].*\.js$/,
  }) || {};
  Object.keys(models).forEach((key) => {
    if (models[key].model) {
      models[key].model();
    }
  });

  // Initialize the Swagger middleware
  SwaggerTools.initializeMiddleware(Jsyaml.safeLoad(Fs.readFileSync(Path.join(__dirname, '/api/swagger.yaml'), 'utf8')), (middleware) => {
    // Init the server
    const app = Express();
    app.use(Logger('combined'));
    app.use(CookieParser());
    app.use(BodyParser.json({ limit: '1mb' }));
    app.use(BodyParser.urlencoded({ extended: true }));
    app.use(ExpressSession({
      name: process.env.APP_NAME,
      secret: process.env.SESSION_SECRET,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 86400000,
      },
      resave: false,
      saveUninitialized: true,
      rolling: true,
      store: new (ConnectMongo(ExpressSession))({
        mongooseConnection: Mongoose.connection,
      }),
    }));
    app.use(Passport.initialize());
    app.use(Passport.session());
    require('./middlewares/authStrategies')(app, Passport);       // eslint-disable-line global-require
    app.use(Cors());
    app.use(Helmet());
    app.use(middleware.swaggerMetadata());                        // Interpret Swagger resources
    app.use(middleware.swaggerValidator());                       // Validate Swagger requests
    app.use(middleware.swaggerRouter({                            // Route validated requests
      swaggerUi: Path.join(__dirname, '/swagger.json'),
      controllers: Path.join(__dirname, './controllers'),
      useStubs: process.env.NODE_ENV === 'development',
    }));
    app.use(middleware.swaggerUi());                              // Swagger UI
    app.use((req, res, next) => next(new APIError('API not found', HttpStatus.NOT_FOUND)));
    app.use((err, req, res, next) => {                            // eslint-disable-line
      console.log(err.stack);                                     // eslint-disable-line no-console
      const errorResponse = {
        message: err.isPublic ? err.message : HttpStatus[err.status],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      };
      res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
    });

    // Start the server
    Http.createServer(app).listen(process.env.PORT, process.env.HOST, () => {
      console.log(`Your server is running at http://${process.env.HOST}:${process.env.PORT}`);        // eslint-disable-line no-console
      console.log(`Swagger-ui is available at http://${process.env.HOST}:${process.env.PORT}/docs`);  // eslint-disable-line no-console
    });
  });
});

// Mongoose connection error handler
Mongoose.connection.on('error', (err) => {
  console.log('Mongoose failed to connect:', mongoUrl, err);      // eslint-disable-line no-console
  Mongoose.disconnect();
});

// Mongoose connection close handler
Mongoose.connection.on('close', () => {
  console.log('Mongoose connection closed');                      // eslint-disable-line no-console
});
