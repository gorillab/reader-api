import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helper/APIError.js';

const Schema = mongoose.Schema;

const SourceSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  }
});

SourceSchema.method({
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

SourceSchema.statics = {
  get(id) {
    return this.findById(id).exec().then((source) => {
      if (source) {
        return source;
      }
      const err = new APIError('No such source exists!', httpStatus.NOT_FOUND, true);
      return Promise.reject(err);
    });
  },
  list: function(options) {
    const query = options.query || {};
    const page = options.page || 0;
    const sort = options.sort || 'title';
    const limit = options.limit || 0;
    const select = options.select || 'id title';

    return this.find(query).sort(sort).select(select).limit(limit).skip(limit * page).exec();
  }
};

export default mongoose.model('Source', SourceSchema);
