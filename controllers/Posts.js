import url from 'url';

import * as Posts from './PostsService';

export function doPost(req, res, next) {
  Posts.doPost(req, res, next);
};

export function getPosts(req, res, next) {
  Posts.getPosts(req, res, next);
};

export function removeActivity(req, res, next) {
  Posts.removeActivity(req, res, next);
};
