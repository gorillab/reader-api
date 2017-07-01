import * as Users from './UsersService';

export const getSavedPosts = (req, res, next) => {
  Users.getSavedPosts(req, res, next);
};

export const getSubscriptions = (req, res, next) => {
  Users.getSubscriptions(req, res, next);
};
