const { mongoose } = require('../config/database');
const { Schema } = require('mongoose');

const DocumentSchema = new Schema({
	checklistItemId: { type: Schema.Types.ObjectId, ref: 'Checklist.items' },
	fileName: { type: String, required: true },
	storagePath: { type: String, required: true },
	type: { type: String },
	uploadedAt: { type: Date, default: Date.now },
	// status: pending | accepted | rejected
	status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
