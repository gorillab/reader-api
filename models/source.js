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

export default mongoose.model('Source', SourceSchema);
