import MiddelwaresWrapper from '../helpers/RouteMiddlewaresWrapper';
import * as Posts from './PostsService';
import isLoggedin from '../middlewares/auth';

export const doPost = MiddelwaresWrapper([
  isLoggedin,
  Posts.getPost,
  Posts.doPost,
]);

export const getPosts = MiddelwaresWrapper(Posts.getPosts);

export const removeActivity = MiddelwaresWrapper([
  isLoggedin,
  Posts.getPost,
  Posts.removeActivity,
]);
