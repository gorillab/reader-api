import * as Sources from './SourcesService';

export const getSources = (req, res, next) => {
  Sources.getSources(req, res, next);
};

export const subscribe = (req, res, next) => {
  Sources.subscribe(req, res, next);
};

export const unsubscribe = (req, res, next) => {
  Sources.unsubscribe(req, res, next);
};
