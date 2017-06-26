import Url from 'url';

import * as Auth from './AuthService';

export function loginByFacebook(req, res, next) {
  Auth.loginByFacebook(req, res, next);
};

export function loginByFacebookCallback(req, res, next) {
  Auth.loginByFacebookCallback(req, res, next);
};

export function logout(req, res, next) {
  Auth.logout(req, res, next);
};
