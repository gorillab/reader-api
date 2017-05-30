'use strict';

var url = require('url');

var Users = require('./UsersService');

module.exports.getSavedPosts = function getSavedPosts (req, res, next) {
  Users.getSavedPosts(req.swagger.params, res, next);
};

module.exports.getSubscriptions = function getSubscriptions (req, res, next) {
  Users.getSubscriptions(req.swagger.params, res, next);
};
