const url = require('url');

const Users = require('./UsersService');

export function getSavedPosts(req, res, next) {
  Users.getSavedPosts(req.swagger.params, res, next);
};

export function getSubscriptions(req, res, next) {
  Users.getSubscriptions(req.swagger.params, res, next);
};
