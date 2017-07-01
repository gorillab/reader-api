import Post from '../models/post';
import Action from '../models/action';

import { isLoggedin } from '../middlewares/auth';

const getPost = async (req, res, next) => {
  const args = req.swagger.params;

  const id = args.id
    ? args.id.value
    : null;

  await Post.get(id).then((post) => {
    req.post = post;
  }).catch(e => next(e));
};

export const doPost = async (req, res, next) => {
  await isLoggedin(req, res, next);

  const args = req.swagger.params;
  await getPost(req, res, next);
  const post = req.post;
  const action = args.action.value;

  // create action
  req.action = new Action({ type: action, user: req.user._id, entity: post._id, entityType: 'Post' });
  await req.action.createByUser(req.user).then().catch(e => next(e));

  switch (action) {
    case 'save':
      post.meta.numSaved += 1;
      break;
    case 'share':
      post.meta.numShared += 1;
      break;
    case 'view':
      post.meta.numViewed += 1;
      break;
    default:
      post.meta.numViewed += 1;
      break;
  }

  await post.extend(post).updateByUser(req.user).then().catch(e => next(e));

  res.json(post.securedInfo());
};

export const getPosts = async (req, res, next) => {
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

  Post.list(options).then(posts => res.json(posts)).catch(e => next(e));
};

export const removeActivity = async (req, res, next) => {
  await isLoggedin(req, res, next);

  const args = req.swagger.params;
  await getPost(req, res, next);
  const post = req.post;
  const action = args.action.value;

  if (action === 'save') {
    post.meta.numSaved -= 1;
  }

  await post.extend(post).updateByUser(req.user).then().catch(e => next(e));

  res.json(post.securedInfo());
};
