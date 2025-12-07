const { mongoose } = require('../config/database');
const { Schema } = require('mongoose');

const ChecklistItemSchema = new Schema({
  itemId: { type: String },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const ChecklistSchema = new Schema({
  title: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [ChecklistItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Checklist', ChecklistSchema);
