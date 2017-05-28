'use strict';

var url = require('url');

var Auth = require('./AuthService');

module.exports.loginByFacebook = function loginByFacebook (req, res, next) {
  Auth.loginByFacebook(req.swagger.params, res, next);
};

module.exports.loginByFacebookCallback = function loginByFacebookCallback (req, res, next) {
  Auth.loginByFacebookCallback(req.swagger.params, res, next);
};

module.exports.logout = function logout (req, res, next) {
  Auth.logout(req.swagger.params, res, next);
};
