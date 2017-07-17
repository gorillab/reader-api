import Post from '../models/post';
import Source from '../models/source';
import Action from '../models/action';

export const getSavedPosts = async (req, res, next) => {
  const args = req.swagger.params;

  try {
    req.actions = await Action.list({
      select: 'entity',
      query: {
        type: 'save',
        entityType: 'Post',
        user: req.user._id,
      },
    });
  } catch (err) {
    return next(err);
  }

  // get posts
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
      $in: req.actions.map(action => action.entity.toString()),
    },
  };

  if (args.query.value) {
    query.$or = [
      {
        title: RegExp(args.query.value, 'i'),
      },
    ];
  }

  try {
    const posts = await Post.list({
      limit,
      page,
      sort,
      query,
    });

    return res.json(posts);
  } catch (err) {
    return next(err);
  }
};

export const getSubscriptions = async (req, res, next) => {
  const args = req.swagger.params;


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
      $in: req.user.sources.map(sourceId => sourceId.toString()),
    },
  };

  if (args.query.value) {
    query.$or = [
      {
        title: RegExp(args.query.value, 'i'),
      },
    ];
  }

  try {
    let sources = await Source.list({
      limit,
      page,
      sort,
      query,
    });

    sources = sources.map((source) => {
      if (req.user.sources.indexOf(source._id.toString()) > -1) {
        source.isSubscribed = true;
      }
      return source;
    });

    res.json(sources);
  } catch (err) {
    next(err);
  }
};


export const forYou = async (req, res, next) => {
  const args = req.swagger.params;

  // get posts
  const limit = args.limit.value || 25;
  const page = args.page.value
    ? (args.page.value > 0
      ? args.page.value
      : 1) - 1
    : 0;
  const sort = args.sort.value || 'title';
  const query = {
    isDeleted: false,
    source: {
      $in: req.user.sources,
    },
  };

  if (args.query.value) {
    query.$or = [
      {
        title: RegExp(args.query.value, 'i'),
      },
    ];
  }

  try {
    const posts = await Post.list({
      limit,
      page,
      sort,
      query,
    });

    return res.json(posts);
  } catch (err) {
    return next(err);
  }
};
