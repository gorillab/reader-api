import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const _ = require('lodash');

// accepts object
module.exports = function mongooseDefaultFields(schema, field) {

  let fields = {
    __v: {
      type: Number,
      select: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false
    },
    created: {
      at: {
        type: Date,
        default: Date.now,
        select: false
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
  };

  if (field && typeof field === 'object' && !Array.isArray(field)) {
    _.extend(fields, field);
  }

  // add fields
  schema.add(fields);

  schema.virtual('id').get(function() {
    return this._id.toString();
  });

  schema.set('toJSON', {
    transform: function(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
    }
  });
};
