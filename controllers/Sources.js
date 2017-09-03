import MiddelwaresWrapper from '../helpers/middlewaresWrapper';
import * as Sources from './SourcesService';
import isLoggedIn from '../middlewares/auth';

import mock from '../middlewares/mock';
import mockSource from '../data/mock/source.json';

const getSources = MiddelwaresWrapper([
  mock(mockSource.list),
  Sources.getSources,
]);

const showSource = MiddelwaresWrapper([
  mock(mockSource.item),
  Sources.getSource,
  Sources.showSource,
]);

const subscribe = MiddelwaresWrapper([
  mock(mockSource.item),
  isLoggedIn,
  Sources.getSource,
  Sources.subscribe,
]);

const unsubscribe = MiddelwaresWrapper([
  mock(mockSource.item),
  isLoggedIn,
  Sources.getSource,
  Sources.unsubscribe,
]);

export {
  getSources,
  showSource,
  subscribe,
  unsubscribe,
};
