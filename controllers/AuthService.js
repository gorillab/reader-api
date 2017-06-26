import HttpStatus from 'http-status';
import Passport from 'passport';

import APIError from '../helper/APIError.js'

export function loginByFacebook(req, res, next) {
  Passport.authenticate('facebook')(req, res, next);
}

export function loginByFacebookCallback(req, res, next) {
  Passport.authenticate('facebook', {
    failureFlash: false
  }, function(err, user, info) {
    if (err)
      return new APIError('Authentication error', HttpStatus.UNAUTHORIZED, true);
    req.logIn(user, err => {
      if (err)
        return new APIError('Authentication error', HttpStatus.UNAUTHORIZED, true);
      return res.json(req.user.securedInfo());
    });
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout();
  res.json({message: 'Done'});
}
