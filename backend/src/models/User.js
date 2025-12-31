const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	role: { type: String, default: 'public_writer' },
	checklistId: { type: Schema.Types.ObjectId, ref: 'Checklist' },
	currentStats: {
		type: Number,
		default: 1, // Starts at Step 1 (Initial Consultation)
		min: 1,
		max: 5
	},
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

