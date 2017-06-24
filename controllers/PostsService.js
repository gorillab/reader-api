import httpStatus from 'http-status';

import APIError from '../helper/APIError.js';

import Post from '../models/post.js';
import Action from '../models/action.js';

import {isLoggedin} from '../middlewares/auth.js';

async function getPost(req, res, next) {
  const args = req.swagger.params;

  let id = args.id
    ? args.id.value
    : null;

  return await Post.get(id).then((post) => {
    req.post = post;
    return post;
  }).catch(e => next(e));
}

export async function doPost(req, res, next) {
  await isLoggedin(req, res, next);

  const args = req.swagger.params;
  let post = await getPost(req, res, next);
  let action = args.action.value;

  // create action
  req.action = new Action({type: action, user: req.user._id, entity: post._id, entityType: 'Post'});
  await req.action.createByUser(req.user).then().catch(e => next(e));

  switch (action) {
    case 'save':
      post.meta.numSaved++;
      break;
    case 'share':
      post.meta.numShared++;
      break;
    case 'view':
      post.meta.numViewed++;
      break;
  }

  await post.extend(post).updateByUser(req.user).then().catch(e => next(e));

  res.json(post.securedInfo());
}

export async function getPosts(req, res, next) {
  const args = req.swagger.params;

  const limit = args.limit.value || 25;
  const page = args.page.value
    ? (args.page.value > 0
      ? args.page.value
      : 1) - 1
    : 0;
  const sort = args.sort.value || 'title';
  const query = {};

  if (args.query.value) {
    query['$or'] = [
      {
        title: RegExp(args.query.value, 'i')
      }
    ];
  }

  const options = {
    limit: limit,
    page: page,
    sort: sort,
    query: query
  };

  Post.list(options).then(posts => res.json(posts)).catch(e => next(e));
}

export async function removeActivity(req, res, next) {
  await isLoggedin(req, res, next);
  
  const args = req.swagger.params;
  let post = await getPost(req, res, next);
  let action = args.action.value;

  switch (action) {
    case 'save':
      post.meta.numSaved--;
      break;
  }

  await post.extend(post).updateByUser(req.user).then().catch(e => next(e));

  res.json(post.securedInfo());
}
