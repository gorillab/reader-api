import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'
    ],
    required: true,
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
  source: [
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
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  created: {
    at: {
      type: Date,
      default: Date.now
    },
    by: {
      type: Schema.ObjectId,
      ref: 'User',
      select: false
    }
  },
  updated: {
    at: {
      type: Date,
      select: false
    },
    by: {
      type: Schema.ObjectId,
      ref: 'User',
      select: false
    }
  },
  deleted: {
    at: {
      type: Date,
      select: false
    },
    by: {
      type: Schema.ObjectId,
      ref: 'User',
      select: false
    }
  }
});

export default mongoose.model('User', UserSchema);
