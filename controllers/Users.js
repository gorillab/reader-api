import MiddelwaresWrapper from '../helpers/middlewaresWrapper';
import * as Users from './UsersService';
import isLoggedIn from '../middlewares/auth';

import mock from '../middlewares/mock';
import mockPost from '../data/mock/post.json';
import mockSource from '../data/mock/source.json';
import mockUser from '../data/mock/user.json';

const getUser = MiddelwaresWrapper([
  mock(mockUser.item),
  isLoggedIn,
  Users.getUser,
]);

const getForYouPosts = MiddelwaresWrapper([
  mock(mockPost.list),
  isLoggedIn,
  Users.getForYouPosts,
]);

const getSavedPosts = MiddelwaresWrapper([
  mock(mockPost.list),
  isLoggedIn,
  Users.getSavedPosts,
]);

const getSubscriptions = MiddelwaresWrapper([
  mock(mockSource.list),
  isLoggedIn,
  Users.getSubscriptions,
]);

export {
  getUser,
  getForYouPosts,
  getSavedPosts,
  getSubscriptions,
};
