'use strict';

var url = require('url');

var Posts = require('./PostsService');

module.exports.doPost = function doPost (req, res, next) {
  Posts.doPost(req.swagger.params, res, next);
};

module.exports.getPosts = function getPosts (req, res, next) {
  Posts.getPosts(req.swagger.params, res, next);
};

module.exports.removeActivity = function removeActivity (req, res, next) {
  Posts.removeActivity(req.swagger.params, res, next);
};
