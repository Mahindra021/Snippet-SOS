const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 10,
      message: 'You can add up to 10 tags',
    },
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

pasteSchema.index({ userId: 1, createdAt: -1 });
pasteSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('Paste', pasteSchema);
