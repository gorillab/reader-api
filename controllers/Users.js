import MiddelwaresWrapper from '../helpers/RouteMiddlewaresWrapper';
import * as Users from './UsersService';
import isLoggedin from '../middlewares/auth';

export const getSavedPosts = MiddelwaresWrapper([
  isLoggedin,
  Users.getSavedPosts,
]);

export const getSubscriptions = MiddelwaresWrapper([
  isLoggedin,
  Users.getSubscriptions,
]);
