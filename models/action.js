import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const ActionSchema = new Mongoose.Schema({
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

ActionSchema.method({});

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
  list({
    skip = 0,
    limit = 25
  } = {}) {
    return true
  }
};

export default Mongoose.model('Action', ActionSchema);
