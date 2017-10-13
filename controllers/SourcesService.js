import { BAD_REQUEST, NOT_FOUND } from 'http-status';

import APIError from '../helpers/APIError';
import Source from '../models/source';
import Action from '../models/action';

const addUserData = (user, source) => {
  if (user.sources.some(s => s.toString() === source.id.toString())) {
    return {
      ...source,
      isSubscribed: true,
    };
  }

  return source;
};

const getSources = async (req, res, next) => {
  const params = req.swagger.params;
  let sources = [];
  try {
    const limit = params.limit.value || 25;
    const page = params.page.value
      ? (params.page.value > 0
        ? params.page.value
        : 1) - 1
      : 0;
    const sort = params.sort.value || '-created.at';
    const query = {};

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
  } catch (error) {
    return next(error);
  }

  if (!req.user) {
    return res.json(sources.map(source => source.securedInfo()));
  }

  return res.json(sources.map(source => addUserData(req.user, source.securedInfo())));
};

const getSource = async (req, res, next) => {
  const params = req.swagger.params;

  if (!params.id) {
    return next(new APIError('Invalid id', BAD_REQUEST));
  }

  try {
    const source = await Source.get(params.id.value);

    if (!source) {
      return next(new APIError('Source not found', NOT_FOUND));
    }

    req.source = source;
  } catch (err) {
    return next(err);
  }

  return next();
};

const showSource = (req, res) => {
  if (!req.user) {
    res.json(req.source.securedInfo());
  }

  return res.json(addUserData(req.user, req.source.securedInfo()));
};

const subscribe = async (req, res, next) => {
  // create action
  try {
    const action = new Action({
      type: 'subscribe',
      user: req.user._id,
      entity: req.source._id,
      entityType: 'Source',
    });

    await action.createByUser(req.user);
  } catch (error) {
    return next(error);
  }

  // update user
  if (req.user.sources.indexOf() < 0) {
    try {
      await req.user.extend({
        sources: req.user.sources.concat(req.source._id),
      }).updateByUser(req.user);
    } catch (error) {
      return next(error);
    }
  }

  return res.json({
    ...req.source.securedInfo(),
    isSubscribed: true,
  });
};

const unsubscribe = async (req, res, next) => {
  // create action
  try {
    const action = new Action({
      type: 'unsubscribe',
      user: req.user._id,
      entity: req.source._id,
      entityType: 'Source',
    });

    await action.createByUser(req.user);
  } catch (error) {
    return next(error);
  }

  // update user
  const sources = req.user.sources.filter(id => id.toString() !== req.source._id.toString());
  if (sources.length < req.user.sources.length) {
    try {
      await req.user.extend({
        sources,
      })
      .updateByUser(req.user);
    } catch (error) {
      return next(error);
    }
  }

  return res.json(req.source.securedInfo());
};

export {
  getSources,
  getSource,
  showSource,
  subscribe,
  unsubscribe,
};
