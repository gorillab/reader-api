const url = require('url');

const Auth = require('./AuthService');

export function loginByFacebook(req, res, next) {
  Auth.loginByFacebook(req.swagger.params, res, next);
};

export function loginByFacebookCallback(req, res, next) {
  Auth.loginByFacebookCallback(req.swagger.params, res, next);
};

export function logout(req, res, next) {
  Auth.logout(req.swagger.params, res, next);
};
