import mongoose from 'mongoose';

const StudyBlockSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start_time: {
    type: Date,
    required: true,
    index: true
  },
  end_time: {
    type: Date,
    required: true
  },
  reminder_sent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
});

// Create compound index for user_id and start_time for efficient queries
StudyBlockSchema.index({ user_id: 1, start_time: 1 });

// Add validation to ensure end_time is after start_time
StudyBlockSchema.pre('save', function(next) {
  if (this.start_time >= this.end_time) {
    next(new Error('End time must be after start time'));
  } else {
    next();
  }
});

// Check for overlapping study blocks for the same user
StudyBlockSchema.methods.checkForOverlap = async function() {
  const overlapping = await this.constructor.findOne({
    user_id: this.user_id,
    _id: { $ne: this._id }, // Exclude current document if updating
    $or: [
      // New block starts during existing block
      {
        start_time: { $lte: this.start_time },
        end_time: { $gt: this.start_time }
      },
      // New block ends during existing block
      {
        start_time: { $lt: this.end_time },
        end_time: { $gte: this.end_time }
      },
      // New block completely contains existing block
      {
        start_time: { $gte: this.start_time },
        end_time: { $lte: this.end_time }
      }
    ]
  });
  
  return overlapping !== null;
};

export default mongoose.models.StudyBlock || mongoose.model('StudyBlock', StudyBlockSchema);
