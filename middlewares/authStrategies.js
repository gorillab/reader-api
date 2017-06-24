'use strict';

import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import mongoose from 'mongoose';
import User from '../models/user.js';
import {facebookAuth} from '../config/auth.js';

module.exports = function(app, passport) {
  passport.use(new FacebookStrategy({
    clientID: facebookAuth.clientID,
    clientSecret: facebookAuth.clientSecret,
    callbackURL: facebookAuth.callbackURL
  }, function(token, refreshToken, profile, cb) {
    const options = {
      query: {
        'profile.id': profile.id
      }
    };
    User.get(options, function(err, user) {
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

        newUser.save(function(err) {
          if (err)
            console.log(err);
          return cb(err, newUser);
        });
      } else {
        return cb(err, user);
      }
    });

  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user._id);
  });

  passport.deserializeUser(function(id, cb) {
    User.findOne({_id: id}).then(function(user) {
      cb(null, user);
    }).catch(cb);
  });
};
