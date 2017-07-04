import Mongoose from 'mongoose';
import HttpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = Mongoose.Schema;

const postSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: Schema.ObjectId,
    ref: 'Source',
  },
  meta: {
    numViewed: {
      type: Number,
      min: 0,
      default: 0,
    },
    numSaved: {
      type: Number,
      min: 0,
      default: 0,
    },
    numShared: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

postSchema.method({
  securedInfo() {
    const { _id, title, content, image, url, source, meta } = this;

    return {
      id: _id,
      title,
      content,
      image,
      url,
      source,
      meta,
    };
  },
});

postSchema.statics = {
  async get(id) {
    const post = await this.findById(id).exec();

    return post || new APIError('No such post exists!', HttpStatus.NOT_FOUND, true);
  },
  list({ query, page, sort, limit, select }) {
    return this.find(query || {})
    .sort(sort || 'title')
    .select(select || 'id title content image url source meta')
    .skip((limit || 0) * (page || 0))
    .limit(limit || 0)
    .exec();
  },
};

export default Mongoose.model('Post', postSchema);
