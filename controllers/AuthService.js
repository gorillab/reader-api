import httpStatus from 'http-status';
var passport = require('passport');

import APIError from '../helper/APIError.js'

export function loginByFacebook(req, res, next) {
  passport.authenticate('facebook')(req, res, next);
}

export function loginByFacebookCallback(req, res, next) {
  passport.authenticate('facebook', {
    failureFlash: false
  }, function(err, user, info) {
    if (err)
      return new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    req.logIn(user, err => {
      if (err)
        return new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return res.json(req.user);
    });
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout();
  res.json({message: 'Done'});
}
