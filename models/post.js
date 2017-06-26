import Promise from 'bluebird';
import Mongoose from 'mongoose';
import HttpStatus from 'http-status';
import APIError from '../helper/APIError.js';

const Schema = Mongoose.Schema;

const postSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: Schema.ObjectId,
    ref: 'Source'
  },
  meta: {
    numViewed: {
      type: Number,
      min: 0,
      default: 0
    },
    numSaved: {
      type: Number,
      min: 0,
      default: 0
    },
    numShared: {
      type: Number,
      min: 0,
      default: 0
    }
  }
});

postSchema.method({
  securedInfo: function() {
    var obj = this.toObject();
    obj.id = obj._id;
    delete obj.isDeleted;
    delete obj.created;
    delete obj.updated;
    delete obj.deleted;
    delete obj._id;
    return obj;
  }
});

postSchema.statics = {
  get(id) {
    return this.findById(id).exec().then((source) => {
      if (source) {
        return source;
      }
      const err = new APIError('No such post exists!', HttpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
  },
  list: function(options) {
    const query = options.query || {};
    const page = options.page || 0;
    const sort = options.sort || 'title';
    const limit = options.limit || 0;
    const select = options.select || 'id title content image url source meta';

    return this.find(query).sort(sort).select(select).limit(limit).skip(limit * page).exec();
  }
};

export default Mongoose.model('Post', postSchema);
