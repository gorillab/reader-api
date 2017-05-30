'use strict';

var url = require('url');

var Sources = require('./SourcesService');

module.exports.getSources = function getSources (req, res, next) {
  Sources.getSources(req.swagger.params, res, next);
};

module.exports.subscribe = function subscribe (req, res, next) {
  Sources.subscribe(req.swagger.params, res, next);
};

module.exports.unsubscribe = function unsubscribe (req, res, next) {
  Sources.unsubscribe(req.swagger.params, res, next);
};
