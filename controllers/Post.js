'use strict';

var url = require('url');

var Post = require('./PostService');

module.exports.actionPost = function actionPost (req, res, next) {
  Post.actionPost(req.swagger.params, res, next);
};

module.exports.allPost = function allPost (req, res, next) {
  Post.allPost(req.swagger.params, res, next);
};

module.exports.removeActionPost = function removeActionPost (req, res, next) {
  Post.removeActionPost(req.swagger.params, res, next);
};
