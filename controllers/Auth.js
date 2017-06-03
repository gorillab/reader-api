'use strict';

const url = require('url');

const Auth = require('./AuthService');

module.exports.loginByFacebook = (req, res, next) => {
  Auth.loginByFacebook(req.swagger.params, res, next);
};

module.exports.loginByFacebookCallback = (req, res, next) => {
  Auth.loginByFacebookCallback(req.swagger.params, res, next);
};

module.exports.logout = (req, res, next) => {
  Auth.logout(req.swagger.params, res, next);
};
