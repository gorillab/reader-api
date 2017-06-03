'use strict';

const url = require('url');

const Sources = require('./SourcesService');

module.exports.getSources = (req, res, next) => {
  Sources.getSources(req.swagger.params, res, next);
};

module.exports.subscribe = (req, res, next) => {
  Sources.subscribe(req.swagger.params, res, next);
};

module.exports.unsubscribe = (req, res, next) => {
  Sources.unsubscribe(req.swagger.params, res, next);
};
