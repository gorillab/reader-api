import Post from '../models/post';
import Source from '../models/source';
import Action from '../models/action';
import { addUserData, getDefaultPosts } from './PostsService';

const getUser = (req, res) => {
  res.json(req.user.securedInfo());
};

const getForYouPosts = async (req, res, next) => {
  const params = req.swagger.params;
  let posts = [];

  try {
    // get posts
    const limit = params.limit.value || 25;
    const page = params.page.value
      ? (params.page.value > 0
        ? params.page.value
        : 1) - 1
      : 0;
    const sort = params.sort.value === 'best' ? '-meta.numViewed' : '-created.at';
    const query = {
      isDeleted: false,
      source: {
        $in: req.user.sources,
      },
    };

    if (params.sort.value === 'daily') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query['created.at'] = {
        $gte: startOfToday,
      };
    }

    if (params.source && params.source.value) {
      if (!req.user.sources.includes(params.source.value)) return res.json([]);
      query.source = params.source.value;
    }

    if (params.query.value) {
      query.$or = [
        {
          title: RegExp(params.query.value, 'i'),
        },
      ];
    }
    posts = (!params.sort.value || params.sort.value === 'new') && query.source && query.source.$in ? await getDefaultPosts({
      limit,
      page,
      sort,
      query,
    }, req.user.sources) : await Post.list({
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

const getSavedPosts = async (req, res, next) => {
  const params = req.swagger.params;
  let actions = [];
  let posts = [];

  try {
    actions = await Action.list({
      select: 'entity',
      query: {
        isDeleted: false,
        type: 'save',
        entityType: 'Post',
        user: req.user._id,
      },
    });
  } catch (err) {
    return next(err);
  }

  try {
    // get posts
    const limit = params.limit.value || 25;
    const page = params.page.value
      ? (params.page.value > 0
        ? params.page.value
        : 1) - 1
      : 0;
    const sort = params.sort.value || 'title';
    const query = {
      isDeleted: false,
      _id: {
        $in: actions.map(action => action.entity.toString()),
      },
    };

    if (params.query.value) {
      query.$or = [
        {
          title: RegExp(params.query.value, 'i'),
        },
      ];
    }

    posts = await Post.list({
      limit,
      page,
      sort,
      query,
    });
  } catch (err) {
    return next(err);
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

const getSubscriptions = async (req, res, next) => {
  const params = req.swagger.params;
  let sources = [];

  try {
    const limit = params.limit.value || 25;
    const page = params.page.value
      ? (params.page.value > 0
        ? params.page.value
        : 1) - 1
      : 0;
    const sort = params.sort.value || 'title';
    const query = {
      isDeleted: false,
      _id: {
        $in: req.user.sources.map(sourceId => sourceId.toString()),
      },
    };

    if (params.query.value) {
      query.$or = [
        {
          title: RegExp(params.query.value, 'i'),
        },
      ];
    }

    sources = await Source.list({
      limit,
      page,
      sort,
      query,
    });
  } catch (err) {
    return next(err);
  }

  return res.json(sources.map(source => ({
    ...source,
    isSubscribed: req.user.sources.indexOf(source._id) > -1 ? true : undefined,
  })));
};

export {
  getUser,
  getForYouPosts,
  getSavedPosts,
  getSubscriptions,
};
