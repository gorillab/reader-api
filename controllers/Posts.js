import MiddelwaresWrapper from '../helpers/RouteMiddlewaresWrapper';
import * as Posts from './PostsService';
import isLoggedin from '../middlewares/auth';
import postMockData from '../mock-data/post.json';

export const doPost = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(postMockData.item);
} : MiddelwaresWrapper([
  isLoggedin,
  Posts.getPost,
  Posts.doPost,
]);

export const getPosts = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(postMockData.list);
} : MiddelwaresWrapper(Posts.getPosts);

export const removeActivity = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(postMockData.item);
} : MiddelwaresWrapper([
  isLoggedin,
  Posts.getPost,
  Posts.removeActivity,
]);
