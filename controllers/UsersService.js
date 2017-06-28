import Post from '../models/post';
import Source from '../models/source';
import Action from '../models/action';

import { isLoggedin } from '../middlewares/auth';

export async function getSavedPosts(req, res, next) {
  await isLoggedin(req, res, next);

  const args = req.swagger.params;
  let query = {
    type: 'save',
    entityType: 'Post',
    user: req.user._id,
  };

  let options = {
    select: 'entity',
    query,
  };

  const postIds = await Action.list(options)
  .then(actions => actions.map(action => action.entity.toString()))
  .catch(e => next(e));

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
      $in: postIds,
    },
  };

  if (args.query.value) {
    query.$or = [
      {
        title: RegExp(args.query.value, 'i'),
      },
    ];
  }

  options = {
    limit,
    page,
    sort,
    query,
  };

  Post.list(options).then(posts => res.json(posts)).catch(e => next(e));
}

export async function getSubscriptions(req, res, next) {
  await isLoggedin(req, res, next);

  const args = req.swagger.params;

  const sourceIds = req.user.sources.map(sourceId => sourceId.toString());

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
      $in: sourceIds,
    },
  };

  if (args.query.value) {
    query.$or = [
      {
        title: RegExp(args.query.value, 'i'),
      },
    ];
  }

  const options = {
    limit,
    page,
    sort,
    query,
  };

  Source.list(options).then(sources => res.json(sources)).catch(e => next(e));
}
