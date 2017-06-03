'use strict';

const url = require('url');

const Posts = require('./PostsService');

module.exports.doPost = (req, res, next) => {
  Posts.doPost(req.swagger.params, res, next);
};

module.exports.getPosts = (req, res, next) => {
  Posts.getPosts(req.swagger.params, res, next);
};

module.exports.removeActivity = (req, res, next) => {
  Posts.removeActivity(req.swagger.params, res, next);
};
