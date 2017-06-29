import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const userSchema = new Mongoose.Schema({
  email: {
    type: String,
    match: [
      // eslint-disable-next-line
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email',
    ],
    trim: true,
    lowercase: true,
  },
  token: {
    type: String,
    trim: true,
    required: true,
  },
  vendor: {
    type: String,
    trim: true,
  },
  sources: [
    {
      type: Schema.ObjectId,
      ref: 'Source',
    },
  ],
  profile: {
    id: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    name: {
      familyName: {
        type: String,
        trim: true,
      },
      givenName: {
        type: String,
        trim: true,
      },
      middleName: {
        type: String,
        trim: true,
      },
    },
    gender: {
      type: String,
      trim: true,
      enum: ['male', 'female'],
    },
    profileUrl: {
      type: String,
      trim: true,
    },
    emails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    photos: [
      {
        type: String,
        trim: true,
      },
    ],
  },
});

userSchema.method({
  securedInfo() {
    const { _id, email, sources, profile } = this;

    return {
      id: _id,
      email,
      sources,
      profile,
    };
  },
});

userSchema.statics = {
  get({ select, query }, cb) {
    return this.findOne(query)
    .select(select || 'email sources profile')
    .exec(cb);
  },
  list({ query, page, sort, limit, select }) {
    return this.find(query || {})
    .sort(sort || '-created.at')
    .select(select || 'email sources profile')
    .skip((limit || 0) * (page || 0))
    .limit(limit || 0)
    .exec();
  },
};

export default Mongoose.model('User', userSchema);
