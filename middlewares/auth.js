import APIError from '../helper/APIError.js';
import httpStatus from 'http-status';

export function isLoggedin (req, res, next) {
    if (!req.isAuthenticated()) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
};
