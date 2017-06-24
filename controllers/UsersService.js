import httpStatus from 'http-status';

import APIError from '../helper/APIError.js';

import User from '../models/user.js';
import Post from '../models/post.js';
import Source from '../models/source.js';
import Action from '../models/action.js';

import {isLoggedin} from '../middlewares/auth.js';

export async function getSavedPosts(req, res, next) {
  await isLoggedin(req, res, next);

  const args = req.swagger.params;
  let query = {
    type: 'save',
    entityType: 'Post',
    user: req.user._id
  };

  let options = {
    select: 'entity',
    query: query
  };

  let postIds = await Action.list(options).then(actions => {
    return actions.map(action => {
      return action.entity.toString();
    });
  }).catch(e => next(e));

  // get posts
  const limit = args.limit.value || 25;
  const page = args.page.value
    ? (args.page.value > 0
      ? args.page.value
      : 1) - 1
    : 0;
  const sort = args.sort.value || 'title';
  query = {
    isDeleted: false,
    _id: {
      $in: postIds
    }
  };

  console.log(query);

  if (args.query.value) {
    query['$or'] = [
      {
        title: RegExp(args.query.value, 'i')
      }
    ];
  }

  options = {
    limit: limit,
    page: page,
    sort: sort,
    query: query
  };

  Post.list(options).then(posts => res.json(posts)).catch(e => next(e));
}

export async function getSubscriptions(req, res, next) {
  await isLoggedin(req, res, next);

  const args = req.swagger.params;

  let sourceIds = req.user.sources.map(sourceId => {
    return sourceId.toString();
  });

  const limit = args.limit.value || 25;
  const page = args.page.value
    ? (args.page.value > 0
      ? args.page.value
      : 1) - 1
    : 0;
  const sort = args.sort.value || 'title';
  const query = {
    isDeleted: false,
    _id: {
      $in: sourceIds
    }
  };

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

  Source.list(options).then(sources => res.json(sources)).catch(e => next(e));
}
