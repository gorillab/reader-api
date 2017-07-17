import Mongoose from 'mongoose';
import HttpStatus from 'http-status';
import APIError from '../helpers/APIError';


const sourceSchema = new Mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
    required: true,
  },
});

sourceSchema.method({
  securedInfo() {
    const { _id, title, url } = this;

    return {
      id: _id,
      title,
      url,
    };
  },
});

sourceSchema.statics = {
  async get(id) {
    const source = await this.findById(id).exec();
    if (!source) {
      throw new APIError('No such source exists!', HttpStatus.NOT_FOUND, true);
    }
    return source;
  },
  list({ query, page, sort, limit, select }) {
    return this.find(query || {})
    .sort(sort || 'title')
    .select(select || 'id title')
    .skip((limit || 0) * (page || 0))
    .limit(limit || 0)
    .exec();
  },
};

export default Mongoose.model('Source', sourceSchema);
