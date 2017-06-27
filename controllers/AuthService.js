import HttpStatus from 'http-status';
import Passport from 'passport';

import APIError from '../helper/APIError';

export function loginByFacebook(req, res, next) {
  Passport.authenticate('facebook')(req, res, next);
}

export function loginByFacebookCallback(req, res, next) {
  Passport.authenticate('facebook', {
    failureFlash: false,
  }, (err, user) => {
    if (err) { return new APIError('Authentication error', HttpStatus.UNAUTHORIZED, true); }

    return req.logIn(user, (error) => {
      if (error) { return new APIError('Authentication error', HttpStatus.UNAUTHORIZED, true); }

      return res.json(req.user.securedInfo());
    });
  })(req, res, next);
}

export function logout(req, res) {
  req.logout();
  res.json({ message: 'Done' });
}
