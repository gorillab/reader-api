import Mongoose from 'mongoose';
import Promise from 'bluebird';
import HttpStatus from 'http-status';
import APIError from '../helper/APIError';


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
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj.isDeleted;
    delete obj.created;
    delete obj.updated;
    delete obj.deleted;
    delete obj._id;
    return obj;
  },
});

sourceSchema.statics = {
  get(id) {
    return this.findById(id).exec().then((source) => {
      if (source) {
        return source;
      }
      const err = new APIError('No such source exists!', HttpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
  },
  list(options) {
    const query = options.query || {};
    const page = options.page || 0;
    const sort = options.sort || 'title';
    const limit = options.limit || 0;
    const select = options.select || 'id title';

    return this.find(query)
    .sort(sort)
    .select(select)
    .limit(limit)
    .skip(limit * page)
    .exec();
  },
};

export default Mongoose.model('Source', sourceSchema);
