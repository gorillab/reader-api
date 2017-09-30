import middelwaresWrapper from '../helpers/middlewaresWrapper';
import * as Auth from './AuthService';

import mock from '../middlewares/mock';
import mockUser from '../data/mock/user.json';

const loginByFacebook = middelwaresWrapper([
  mock({
    message: 'Redirect to facebook authenticate page',
  }),
  Auth.loginByFacebook,
]);

const loginByFacebookCallback = middelwaresWrapper([
  mock(mockUser.item),
  Auth.loginByFacebookCallback,
]);

const logout = middelwaresWrapper([
  mock({
    message: 'Done',
  }),
  Auth.logout,
]);

export {
  loginByFacebook,
  loginByFacebookCallback,
  logout,
};
