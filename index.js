import fs from 'fs';
import path from 'path';
import http from 'http';
import swaggerTools from 'swagger-tools';
import jsyaml from 'js-yaml';
import connect from 'connect';
import db from './config/database.js';
import mongoose from 'mongoose';

const app = connect();
const serverPort = 3000;

// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

mongoose.connect(db.mongodb.url);
mongoose.connection.on('open', () => {
  console.log('--> Mongoose connected:', db.mongodb.url);

  const models = path.join(__dirname, './models');
  fs.readdirSync(models).filter(file => ~ file.search(/^[^\.].*\.js$/)).forEach(file => require(path.join(models, file)));

  // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {

    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // Start the server
    http.createServer(app).listen(serverPort, () => {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
      console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
  });

});
mongoose.connection.on('error', (err) => {
  console.log('--> Mongoose failed to connect:', db_mongo.mongodb.url, err);
  mongoose.disconnect();
});
mongoose.connection.on('close', () => {
  console.log('--> Mongoose connection closed');
});
