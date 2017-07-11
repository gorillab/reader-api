import HttpStatus from 'http-status';
import Passport from 'passport';

import APIError from '../helpers/APIError';

export const loginByFacebook = (req, res, next) => {
  Passport.authenticate('facebook')(req, res, next);
};

export const loginByFacebookCallback = (req, res, next) => {
  Passport.authenticate('facebook', {
    failureFlash: false,
  }, (err1, user) => {
    if (err1) {
      return new APIError('Authentication error', HttpStatus.UNAUTHORIZED, true);
    }

    return req.logIn(user, (err2) => {
      if (err2) {
        return new APIError('Authentication error', HttpStatus.UNAUTHORIZED, true);
      }
      return res.redirect(`${process.env.REDIRECT_URL}?loggedInUser=${JSON.stringify(user.securedInfo())}`);
    });
  })(req, res, next);
};

export const logout = (req, res, next) => {
  try {
    req.logout();
    res.json({
      message: 'Done',
    });
  } catch (err) {
    next(err);
  }
};
