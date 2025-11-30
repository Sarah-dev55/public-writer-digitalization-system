const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoWorkDaySchema = new Schema({
  date: { type: String, required: true },
  isRecurring: { type: Boolean, default: false },
  reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('NoWorkDay', NoWorkDaySchema);
