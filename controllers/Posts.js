import MiddelwaresWrapper from '../helpers/middlewaresWrapper';
import * as Posts from './PostsService';
import isLoggedIn from '../middlewares/auth';

import mock from '../middlewares/mock';
import mockPost from '../data/mock/post.json';

const getPosts = MiddelwaresWrapper([
  mock(mockPost.list),
  Posts.getPosts,
]);

const showPost = MiddelwaresWrapper([
  mock(mockPost.item),
  Posts.getPost,
  Posts.showPost,
]);

const createActivity = MiddelwaresWrapper([
  mock(mockPost.item),
  Posts.getPost,
  Posts.createActivity,
  Posts.showPost,
]);

const removeActivity = MiddelwaresWrapper([
  mock(mockPost.item),
  isLoggedIn,
  Posts.getPost,
  Posts.removeActivity,
  Posts.showPost,
]);

export {
  getPosts,
  showPost,
  createActivity,
  removeActivity,
};
