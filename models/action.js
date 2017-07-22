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
  get({ select, query }) {
    return this.findOne(query)
    .select(select || '')
    .exec();
  },
  list({ query, page, sort, limit, select }) {
    return this.find(query || {})
    .sort(sort || '-created.at')
    .select(select || '')
    .skip((limit || 0) * (page || 0))
    .limit(limit || 0)
    .exec();
  },
};

export default Mongoose.model('Action', actionSchema);
