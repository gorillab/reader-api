import * as Auth from './AuthService';

export const loginByFacebook = (req, res, next) => {
  Auth.loginByFacebook(req, res, next);
};

export const loginByFacebookCallback = (req, res, next) => {
  Auth.loginByFacebookCallback(req, res, next);
};

export const logout = (req, res, next) => {
  Auth.logout(req, res, next);
};
