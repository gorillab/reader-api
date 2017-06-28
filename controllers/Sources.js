import * as Sources from './SourcesService';

export function getSources(req, res, next) {
  Sources.getSources(req, res, next);
}

export function subscribe(req, res, next) {
  Sources.subscribe(req, res, next);
}

export function unsubscribe(req, res, next) {
  Sources.unsubscribe(req, res, next);
}
