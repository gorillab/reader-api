import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const mongooseDefaultFields = (schema, field) => {
  const fields = {
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    created: {
      at: {
        type: Date,
        default: Date.now,
        select: false,
      },
      by: {
        type: Schema.ObjectId,
        ref: 'User',
        select: false,
      },
    },
    updated: {
      at: {
        type: Date,
        select: false,
      },
      by: {
        type: Schema.ObjectId,
        ref: 'User',
        select: false,
      },
    },
    deleted: {
      at: {
        type: Date,
        select: false,
      },
      by: {
        type: Schema.ObjectId,
        ref: 'User',
        select: false,
      },
    },
    __v: {
      type: Number,
      select: false,
    },
  };

  if (field && typeof field === 'object' && !Array.isArray(field)) {
    Object.assign(fields, field);
  }

  schema.add(fields);

  schema.virtual('id').get(function () {
    this._id.toString();
  });

  schema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  });
};

export default mongooseDefaultFields;
