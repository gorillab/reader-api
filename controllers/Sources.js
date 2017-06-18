import url from 'url';

import * as Sources from './SourcesService';

export function getSources(req, res, next) {
  Sources.getSources(req.swagger.params, res, next);
};

export function subscribe(req, res, next) {
  Sources.subscribe(req.swagger.params, res, next);
};

export function unsubscribe(req, res, next) {
  Sources.unsubscribe(req.swagger.params, res, next);
};