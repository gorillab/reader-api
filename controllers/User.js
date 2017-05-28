'use strict';

var url = require('url');

var User = require('./UserService');

module.exports.getUserSavedPost = function getUserSavedPost (req, res, next) {
  User.getUserSavedPost(req.swagger.params, res, next);
};

module.exports.getUserSource = function getUserSource (req, res, next) {
  User.getUserSource(req.swagger.params, res, next);
};
