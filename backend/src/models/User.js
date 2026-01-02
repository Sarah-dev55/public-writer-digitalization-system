const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String },
	role: { type: String, default: 'client' },
	passwordHash: { type: String },
	checklistId: { type: Schema.Types.ObjectId, ref: 'Checklist' },
	currentStats: {
		type: Number,
		default: 1, // Start at the first step
		min: 1,
		max: 5
	},
	location: { type: String },
	profileImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

