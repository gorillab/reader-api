import { UNAUTHORIZED } from 'http-status';
import Passport from 'passport';

import APIError from '../helpers/APIError';

const loginByFacebook = Passport.authenticate('facebook');

const loginByFacebookCallback = (req, res, next) => Passport.authenticate('facebook', {
  failureFlash: false,
}, (err1, user) => {
  if (err1) {
    return new APIError('Authentication error', UNAUTHORIZED, true);
  }

  return req.logIn(user, (err2) => {
    if (err2) {
      return new APIError('Authentication error', UNAUTHORIZED, true);
    }

    return res.redirect(process.env.REDIRECT_URL);
  });
})(req, res, next);

const logout = (req, res, next) => {
  try {
    req.logout();

    res.json({
      message: 'Done',
    });
  } catch (err) {
    next(err);
  }
};

export {
  loginByFacebook,
  loginByFacebookCallback,
  logout,
};
