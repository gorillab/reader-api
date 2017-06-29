import Source from '../models/source';
import Action from '../models/action';

import { isLoggedin } from '../middlewares/auth';

async function getSource(req, res, next) {
  const args = req.swagger.params;

  const id = args.id
    ? args.id.value
    : null;

  await Source.get(id).then((source) => {
    req.source = source;
    return source;
  }).catch(e => next(e));
}

export async function getSources(req, res, next) {
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

  Source.list(options).then(sources => res.json(sources)).catch(e => next(e));
}

export async function subscribe(req, res, next) {
  await isLoggedin(req, res, next);

  await getSource(req, res, next);

  const source = req.source;

  // create action
  const action = new Action({ type: 'subscribe', user: req.user._id, entity: source._id, entityType: 'Source' });

  await action.createByUser(req.user).then().catch(e => next(e));

  // update user
  const sources = req.user.sources || [];
  if (sources.indexOf(source._id) < 0) {
    sources.push(source._id);
  }
  await req.user.extend({ sources }).updateByUser(req.user).then().catch(e => next(e));

  res.json(source.securedInfo());
}

export async function unsubscribe(req, res, next) {
  await isLoggedin(req, res, next);

  await getSource(req, res, next);
  const source = req.source;

  // create action
  const action = new Action({ type: 'unsubscribe', user: req.user._id, entity: source._id, entityType: 'Source' });

  await action.createByUser(req.user).then().catch(e => next(e));

  // update user
  const sources = req.user.sources || [];
  const sourceIds = req.user.sources.map(sourceId => sourceId.toString());

  const index = sourceIds.indexOf(source.id.toString());
  if (index > -1) {
    sources.splice(index, 1);
  }

  await req.user.extend({ sources }).updateByUser(req.user).then().catch(e => next(e));

  res.json(source.securedInfo());
}
