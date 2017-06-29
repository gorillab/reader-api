import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const actionSchema = new Mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['view', 'share', 'save', 'subscribe', 'unsubscribe'],
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  entity: {
    type: Schema.ObjectId,
    required: true,
  },
  entityType: {
    type: String,
    required: true,
    enum: ['Post', 'Source'],
  },
});


actionSchema.statics = {
  list(options) {
    const query = options.query || {};
    const page = options.page || 0;
    const sort = options.sort || '-created.at';
    const limit = options.limit || 0;
    const select = options.select || '';

    return this.find(query)
    .sort(sort)
    .select(select)
    .limit(limit)
    .skip(limit * page)
    .exec();
  },
};

export default Mongoose.model('Action', actionSchema);
