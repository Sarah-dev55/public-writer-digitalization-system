const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String }, // Password hash for authentication
	phone: { type: String },
	role: { type: String, default: 'public_writer' },
	checklistId: { type: Schema.Types.ObjectId, ref: 'Checklist' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

