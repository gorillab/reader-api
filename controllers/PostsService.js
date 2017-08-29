import httpStatus from 'http-status';
import Post from '../models/post';
import Action from '../models/action';
import APIError from '../helpers/APIError';

export const getPost = async (req, res, next) => {
  const args = req.swagger.params;

  const id = args.id
    ? args.id.value
    : null;

  try {
    req.post = await Post.get(id);
    next();
  } catch (err) {
    next(err);
  }
};

export const showPost = async (req, res) => {
  const post = req.post.securedInfo();
  if (req.user) {
    const options = {
      query: {
        isDeleted: false,
        entity: req.post._id,
        entityType: 'Post',
        type: {
          $in: ['view', 'share', 'save'],
        },
        user: req.user._id,
      },
    };
    const actions = await Action.list(options);

    actions.forEach((action) => {
      if (action.type === 'view') {
        post.isViewed = true;
      } else if (action.type === 'share') {
        post.isShared = true;
      } else {
        post.isSaved = true;
      }
    });
  }

  res.json(post);
};

export const doPost = async (req, res, next) => {
  const args = req.swagger.params;

  if (args.action.value === 'save') {
    if (!req.user) {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    }
  }

  // create action
  try {
    const action = new Action({
      type: args.action.value,
      user: req.user ? req.user._id : null,
      entity: req.post._id,
      entityType: 'Post',
    });
    await action.createByUser(req.user);
  } catch (err) {
    next(err);
  }

  try {
    if (args.action.value === 'view') {
      req.post.meta.numViewed += 1;
    } else if (args.action.value === 'save') {
      req.post.meta.numSaved += 1;
    } else if (args.action.value === 'share') {
      req.post.meta.numShared += 1;
    }

    await req.post.extend({
      meta: req.post.meta,
    }).updateByUser(req.user);
  } catch (err) {
    return next(err);
  }

  return res.json(req.post.securedInfo());
};

export const getPosts = async (req, res, next) => {
  const args = req.swagger.params;

  const limit = args.limit.value || 25;
  const page = args.page.value
    ? (args.page.value > 0
      ? args.page.value
      : 1) - 1
    : 0;

  const sort = args.sort.value === 'best' ? '-meta.numViewed' : '-created.at';
  const query = {};

  if (args.sort.value === 'daily') {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    query['created.at'] = {
      $gte: startOfToday,
    };
  }

  if (args.query.value) {
    query.$or = [
      {
        title: RegExp(args.query.value, 'i'),
      },
    ];
  }

  if (args.source && args.source.value) {
    query.source = args.source.value;
  }

  try {
    req.posts = await Post.list({
      limit,
      page,
      sort,
      query,
    });
  } catch (err) {
    return next(err);
  }

  let posts = req.posts;
  if (req.user) {
    posts = await Promise.all(req.posts.map(async (post) => {
      // get actions
      const options = {
        query: {
          isDeleted: false,
          entity: post._id,
          entityType: 'Post',
          type: {
            $in: ['view', 'share', 'save'],
          },
          user: req.user._id,
        },
      };
      const actions = await Action.list(options);
      post = post.toJSON();
      actions.forEach((action) => {
        if (action.type === 'view') {
          post.isViewed = true;
        } else if (action.type === 'share') {
          post.isShared = true;
        } else {
          post.isSaved = true;
        }
      });

      return post;
    }));
  }

  return res.json(posts);
};

export const removeActivity = async (req, res, next) => {
  const args = req.swagger.params;

  // update action
  try {
    const options = {
      query: {
        isDeleted: false,
        entity: req.post._id,
        entityType: 'Post',
        type: {
          $in: ['view', 'share', 'save'],
        },
        user: req.user._id,
      },
    };
    req.action = await Action.get(options);

    if (req.action) {
      req.action.extend({
        isDeleted: true,
      }).updateByUser(req.user);
    }
  } catch (err) {
    return next(err);
  }

  // update post
  if (args.action.value === 'save') {
    req.post.meta.numSaved -= 1;
  }

  try {
    req.post.extend({
      meta: req.post.meta,
    }).updateByUser(req.user);
  } catch (err) {
    return next(err);
  }

  return res.json(req.post.securedInfo());
};
