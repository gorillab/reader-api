import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ActionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['view', 'share', 'save']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  entity: {
    type: Schema.ObjectId,
    required: true
  },
  entityType: {
    type: String,
    required: true,
    enum: ['Post', 'Source']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
      type: Boolean,
      default: false,
      select: false
  }
});

ActionSchema.method({
});

ActionSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of action.
   * @returns {Promise<Action, APIError>}
   */
  get(id) {
    return true
  },

  /**
   * List actions in descending order of 'created' timestamp.
   * @param {number} skip - Number of actions to be skipped.
   * @param {number} limit - Limit number of actions to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 25 } = {}) {
    return true
  }
};

export default mongoose.model('Action', ActionSchema);
