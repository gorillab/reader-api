import MiddelwaresWrapper from '../helpers/RouteMiddlewaresWrapper';
import * as Sources from './SourcesService';
import isLoggedin from '../middlewares/auth';
import sourceMockData from '../mock-data/source.json';

export const getSources = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(sourceMockData.list);
} : MiddelwaresWrapper(Sources.getSources);

export const subscribe = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(sourceMockData.item);
} : MiddelwaresWrapper([
  isLoggedin,
  Sources.getSource,
  Sources.subscribe,
]);

export const unsubscribe = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(sourceMockData.item);
} : MiddelwaresWrapper([
  isLoggedin,
  Sources.getSource,
  Sources.unsubscribe,
]);
