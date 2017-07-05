import MiddelwaresWrapper from '../helpers/RouteMiddlewaresWrapper';
import * as Sources from './SourcesService';
import isLoggedin from '../middlewares/auth';

export const getSources = MiddelwaresWrapper(Sources.getSources);

export const subscribe = MiddelwaresWrapper([
  isLoggedin,
  Sources.getSource,
  Sources.subscribe,
]);

export const unsubscribe = MiddelwaresWrapper([
  isLoggedin,
  Sources.getSource,
  Sources.unsubscribe,
]);
