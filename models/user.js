import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'
    ],
    trim: true,
    lowercase: true
  },
  token: {
    type: String,
    trim: true,
    required: true
  },
  vendor: {
    type: String,
    trim: true
  },
  sources: [
    {
      type: Schema.ObjectId,
      ref: 'Source'
    }
  ],
  profile: {
    id: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    name: {
      familyName: {
        type: String,
        trim: true
      },
      givenName: {
        type: String,
        trim: true
      },
      middleName: {
        type: String,
        trim: true
      }
    },
    gender: {
      type: String,
      trim: true,
      enum: ['male', 'female']
    },
    profileUrl: {
      type: String,
      trim: true
    },
    emails: [
      {
        type: String,
        lowercase: true,
        trim: true
      }
    ],
    photos: [
      {
        type: String,
        trim: true
      }
    ]
  }
});

UserSchema.method({});

UserSchema.statics = {
  get: function(options, cb) {
    options.select = options.select || 'email source profile';
    return this.findOne(options.query).select(options.select).exec(cb);
  },
  list: function(options) {
    const query = options.query || {};
    const page = options.page || 0;
    const sort = options.sort || '-created.at';
    const limit = options.limit || 0;
    const select = options.select || '';

    return this.find(query).sort(sort).select(select).limit(limit).skip(limit * page).exec();
  }
};

export default mongoose.model('User', UserSchema);
