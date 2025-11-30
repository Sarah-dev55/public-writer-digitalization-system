const { mongoose } = require('../config/database');
const { Schema } = require('mongoose');

const AppointmentSchema = new Schema({
	date: { type: String, required: true },
	timeSlot: { type: String, required: true },
	notes: { type: String },
	status: { type: String, default: 'scheduled' },
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
