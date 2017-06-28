import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
// accepts object
export default function mongooseDefaultFields(schema, field) {
  const fields = {
    __v: {
      type: Number,
      select: false,
    },
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
  };

  if (field && typeof field === 'object' && !Array.isArray(field)) {
    Object.assign(fields, field);
  }

  // add fields
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
}
