import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);

    return next(err);
  }

  return next();
};

export default isLoggedin;
