import * as Users from './UsersService';

export function getSavedPosts(req, res, next) {
  Users.getSavedPosts(req, res, next);
};

export function getSubscriptions(req, res, next) {
  Users.getSubscriptions(req, res, next);
};
