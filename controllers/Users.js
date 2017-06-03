'use strict';

const url = require('url');

const Users = require('./UsersService');

module.exports.getSavedPosts = (req, res, next) => {
  Users.getSavedPosts(req.swagger.params, res, next);
};

module.exports.getSubscriptions = (req, res, next) => {
  Users.getSubscriptions(req.swagger.params, res, next);
};
