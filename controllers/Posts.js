import * as Posts from './PostsService';

export const doPost = (req, res, next) => {
  Posts.doPost(req, res, next);
};

export const getPosts = (req, res, next) => {
  Posts.getPosts(req, res, next);
};

export const removeActivity = (req, res, next) => {
  Posts.removeActivity(req, res, next);
};
