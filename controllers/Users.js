import url from 'url';

import Users from './UsersService';

export function getSavedPosts(req, res, next) {
  Users.getSavedPosts(req.swagger.params, res, next);
};

export function getSubscriptions(req, res, next) {
  Users.getSubscriptions(req.swagger.params, res, next);
};
