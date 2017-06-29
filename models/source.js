import mongoose from 'mongoose';
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

export default mongoose.model('Source', SourceSchema);