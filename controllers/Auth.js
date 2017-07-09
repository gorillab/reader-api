import MiddelwaresWrapper from '../helpers/RouteMiddlewaresWrapper';
import * as Auth from './AuthService';
import userMockData from '../mock-data/user.json';

export const loginByFacebook = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json({
    message: 'Redirect to facebook authenticate page',
  });
} : MiddelwaresWrapper(Auth.loginByFacebook);

export const loginByFacebookCallback = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json(userMockData.item);
} : MiddelwaresWrapper(Auth.loginByFacebookCallback);


export const logout = process.env.NODE_ENV === 'mock' ? (req, res) => {
  res.json({
    message: 'Done',
  });
} : MiddelwaresWrapper(Auth.logout);
