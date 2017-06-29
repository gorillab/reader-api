import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/user';

module.exports = (app, passport) => {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
  }, (
    token,
    refreshToken,
    { id, username, displayName, name, gender, profileUrl, emails, photos },
    cb,
  ) => {
    const options = {
      query: {
        'profile.id': id,
      },
    };
    User.get(options, (err, user) => {
      if (err) { return cb(err); }
      if (!user) {
        const newUser = new User({
          email: Array.isArray(emails) ? emails[0].value : undefined,
          token,
          vendor: 'facebook',
          profile: {
            id,
            username,
            displayName,
            name,
            gender,
            profileUrl,
            emails,
            photos,
          },
        });

        return newUser.save((error) => {
          if (error) {
            return cb(error);
          }

          return cb(err, newUser);
        });
      }

      return cb(err, user);
    });
  }));

  passport.serializeUser((user, cb) => cb(null, user._id));

  passport.deserializeUser((id, cb) => {
    User.findOne({
      _id: id,
    })
    .then(user => cb(null, user))
    .catch(cb);
  });
};
