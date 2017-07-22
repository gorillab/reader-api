import Source from '../models/source';
import Action from '../models/action';

export const getSource = async (req, res, next) => {
  const args = req.swagger.params;

  const id = args.id
    ? args.id.value
    : null;

  try {
    req.source = await Source.get(id);
    next();
  } catch (err) {
    next(err);
  }
};

export const showSource = (req, res) => {
  const source = req.source.securedInfo();
  res.json({
    ...source,
    isSubscribed: req.user && req.user.sources.indexOf(source.id.toString()) !== -1
      ? true : undefined,
  });
};

export const getSources = async (req, res, next) => {
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

  try {
    const sources = await Source.list({
      limit,
      page,
      sort,
      query,
    });

    const results = sources.map((source) => {
      source = source.securedInfo();
      return {
        ...source,
        isSubscribed: req.user && req.user.sources.indexOf(source.id.toString()) !== -1
          ? true : undefined,
      };
    });

    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  // create action
  try {
    const action = new Action({
      type: 'subscribe',
      user: req.user._id,
      entity: req.source._id,
      entityType: 'Source',
    });
    await action.createByUser(req.user);
  } catch (err) {
    return next(err);
  }

  // update user
  if (req.user.sources.indexOf(req.source._id) < 0) {
    try {
      await req.user.extend({
        sources: req.user.sources.concat(req.source._id),
      }).updateByUser(req.user);
    } catch (err) {
      return next(err);
    }
  }

  return res.json(req.source.securedInfo());
};

export const unsubscribe = async (req, res, next) => {
  // create action
  try {
    const action = new Action({
      type: 'unsubscribe',
      user: req.user._id,
      entity: req.source._id,
      entityType: 'Source',
    });
    await action.createByUser(req.user);
  } catch (err) {
    return next(err);
  }

  // update user
  const sources = req.user.sources.filter(id => id.toString() !== req.source._id.toString());
  if (sources.length < req.user.sources.length) {
    try {
      await req.user.extend({
        sources,
      })
      .updateByUser(req.user);
    } catch (err) {
      return next(err);
    }
  }

  return res.json(req.source.securedInfo());
};
