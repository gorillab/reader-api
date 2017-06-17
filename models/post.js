import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: Schema.ObjectId,
    ref: 'Source'
  },
  meta: {
    numViewed: {
      type: Number,
      min: 0,
      default: 0
    },
    numSaved: {
      type: Number,
      min: 0,
      default: 0
    },
    numShared: {
      type: Number,
      min: 0,
      default: 0
    }
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

export default mongoose.model('Post', PostSchema);
