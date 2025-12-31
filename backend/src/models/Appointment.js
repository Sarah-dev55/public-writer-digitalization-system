const mongoose = require('mongoose');
const { Schema } = mongoose;

const AppointmentSchema = new Schema({
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String },
  appointmentType: { type: String },
  status: { type: String, default: 'scheduled' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: () => mongoose.Types.ObjectId('692cb332a4ba90e0b2dcb02f') }

}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
