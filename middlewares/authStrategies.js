import {Strategy as FacebookStrategy} from 'passport-facebook';
import User from '../models/user.js';

module.exports = function(app, passport) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK
  }, (token, refreshToken, profile, cb) => {
    const options = {
      query: {
        'profile.id': profile.id
      }
    };
    User.get(options, (err, user) => {
      if (err)
        return cb(err);
      if (!user) {
        let newUser = new User({
          email: profile.emails
            ? profile.emails[0].value
            : null,
          token: token,
          vendor: 'facebook',
          profile: {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            name: {
              familyName: profile.name.familyName,
              givenName: profile.name.givenName,
              middleName: profile.name.middleName
            },
            gender: profile.gender,
            profileUrl: profile.profileUrl,
            emails: profile.emails,
            photos: profile.photos
          }
        });

        newUser.save(err => {
          if (err)
            console.log(err);
          return cb(err, newUser);
        });
      } else {
        return cb(err, user);
      }
    });

  }));

  passport.serializeUser((user, cb) => cb(null, user._id));

  passport.deserializeUser((id, cb) => {
    User.findOne({_id: id}).then(user => cb(null, user)).catch(cb);
  });
};
