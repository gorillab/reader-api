import { BAD_REQUEST, NOT_FOUND, FORBIDDEN } from 'http-status';

import Post from '../models/post';
import Action from '../models/action';
import Source from '../models/source';
import APIError from '../helpers/APIError';

const addUserData = async (user, post) => {
  const actions = await Action.list({
    query: {
      isDeleted: false,
      entity: post.id,
      entityType: 'Post',
      type: {
        $in: ['view', 'share', 'save'],
      },
      user: user._id,
    },
  });

  return actions.reduce((result, { type }) => {
    switch (type) {
      case 'view':
        return {
          ...result,
          isViewed: true,
        };
      case 'share':
        return {
          ...result,
          isShared: true,
        };
      default:
        return {
          ...result,
          isSaved: true,
        };
    }
  }, post);
};

const mergePosts = (threeDPostArray) => {
  const posts = [];
  const max = [].concat(...threeDPostArray).length;
  while (posts.length < max) {
    threeDPostArray.forEach((sourcePosts) => {
      if (sourcePosts.length > 0) posts.push(sourcePosts.shift());
    });
  }

  return posts;
};

const getDefaultPosts = async ({ limit, page, query, sort }) => {
  // get sources
  const sources = await Source.list({
    query: {
      isDeleted: false,
    },
    select: '_id',
  });

  const promises = sources.map(async ({ _id }, index) => {
    query.source = _id;

    const post = await Post.list({
      page,
      sort,
      query: query ? { ...query, source: _id } : undefined,
      limit: index === sources.length - 1
      ? limit - (index * Math.floor(limit / sources.length))
      : Math.floor((limit / sources.length)),
    });
    return post;
  });
  const result = await Promise.all(promises);

  return mergePosts(result);
};


const getPosts = async (req, res, next) => {
  const params = req.swagger.params;
  let posts = [];

  // get posts
  try {
    const limit = params.limit.value || 25;
    const page = params.page.value
      ? (params.page.value > 0
        ? params.page.value
        : 1) - 1
      : 0;
    const sort = params.sort.value === 'best' ? '-meta.numViewed' : '-created.at';
    const query = {};

    if (params.sort.value === 'daily') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query['created.at'] = {
        $gte: startOfToday,
      };
    }

    if (params.query.value) {
      query.$or = [
        {
          title: RegExp(params.query.value, 'i'),
        },
      ];
    }

    if (params.source && params.source.value) {
      query.source = params.source.value;
    }

    posts = (!params.sort.value || params.sort.value === 'new') && !query.source ? await getDefaultPosts({
      limit,
      page,
      sort,
      query,
    }) : await Post.list({
      limit,
      page,
      sort,
      query,
    });
  } catch (error) {
    return next(error);
  }
  // return if not logged in yet
  if (!req.user) {
    return res.json(posts.map(post => post.securedInfo()));
  }

  // add user data to each post
  try {
    posts = await Promise.all(posts.map(post => addUserData(req.user, post.securedInfo())));
  } catch (error) {
    return next(error);
  }
  return res.json(posts);
};


const getPost = async (req, res, next) => {
  const params = req.swagger.params;

  if (!params.id) {
    return next(new APIError('Invalid id', BAD_REQUEST));
  }

  try {
    const post = await Post.get(params.id.value);
    if (!post) {
      return next(new APIError('Post not found', NOT_FOUND));
    }

    req.post = post;
  } catch (err) {
    return next(err);
  }

  return next();
};

const showPost = async (req, res, next) => {
  // return if not logged in yet
  if (!req.user) {
    return res.json(req.post.securedInfo());
  }

  // add user data
  try {
    req.post = await addUserData(req.user, req.post.securedInfo());
  } catch (error) {
    return next(error);
  }

  return res.json(req.post);
};

const createActivity = async (req, res, next) => {
  const params = req.swagger.params;

  // if user logged in
  if (req.user) {
    // create action for user
    try {
      const action = new Action({
        type: params.action.value,
        user: req.user ? req.user._id : null,
        entity: req.post._id,
        entityType: 'Post',
      });

      await action.createByUser(req.user);
    } catch (error) {
      return next(error);
    }
  } else if (params.action.value === 'save') {
    // validate action requires logged in
    return next(new APIError('Forbidden', FORBIDDEN));
  }

  // update meta data
  try {
    const numViewed = params.action.value === 'view' ? req.post.meta.numViewed + 1 : req.post.meta.numViewed;
    const numShared = params.action.value === 'share' ? req.post.meta.numShared + 1 : req.post.meta.numShared;
    const numSaved = params.action.value === 'save' ? req.post.meta.numSaved + 1 : req.post.meta.numSaved;

    await req.post.extend({
      meta: {
        numViewed,
        numShared,
        numSaved,
      },
    }).updateByUser(req.user);
  } catch (err) {
    return next(err);
  }

  return next();
};

const removeActivity = async (req, res, next) => {
  const params = req.swagger.params;

  // validate action
  if (params.action.value === 'view' || params.action.value === 'share') {
    return next(new APIError('Forbidden', FORBIDDEN));
  }

  // update action
  try {
    const action = await Action.get({
      query: {
        isDeleted: false,
        entity: req.post._id,
        entityType: 'Post',
        type: params.action.value,
        user: req.user._id,
      },
    });

    if (action) {
      await action.extend({
        isDeleted: true,
      }).updateByUser(req.user);
    }
  } catch (err) {
    return next(err);
  }

  // update post
  try {
    const numViewed = req.post.meta.numViewed;
    const numShared = req.post.meta.numShared;
    const numSaved = params.action.value === 'save' ? req.post.meta.numSaved - 1 : req.post.meta.numSaved;

    await req.post.extend({
      meta: {
        numViewed,
        numShared,
        numSaved,
      },
    }).updateByUser(req.user);
  } catch (err) {
    return next(err);
  }

  return next();
};

export {
  addUserData,
  getPost,
  showPost,
  createActivity,
  getPosts,
  removeActivity,
};
