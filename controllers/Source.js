'use strict';

var url = require('url');

var Source = require('./SourceService');

module.exports.allSource = function allSource (req, res, next) {
  Source.allSource(req.swagger.params, res, next);
};

module.exports.subscribeSource = function subscribeSource (req, res, next) {
  Source.subscribeSource(req.swagger.params, res, next);
};

module.exports.unSubscribe = function unSubscribe (req, res, next) {
  Source.unSubscribe(req.swagger.params, res, next);
};
