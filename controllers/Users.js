import MiddelwaresWrapper from '../helpers/RouteMiddlewaresWrapper';
import * as Users from './UsersService';
import isLoggedin from '../middlewares/auth';
import postMockData from '../mock-data/post.json';
import sourceMockData from '../mock-data/source.json';

export const getSavedPosts = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(postMockData.list);
} : MiddelwaresWrapper([
  isLoggedin,
  Users.getSavedPosts,
]);

export const getSubscriptions = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(sourceMockData.list);
} : MiddelwaresWrapper([
  isLoggedin,
  Users.getSubscriptions,
]);

export const forYou = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(postMockData.list);
} : MiddelwaresWrapper([
  isLoggedin,
  Users.forYou,
]);
