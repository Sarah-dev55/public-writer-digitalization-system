const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
	checklistItemId: { type: Schema.Types.ObjectId, ref: 'Checklist.items' },
	name: { type: String, required: true }, // Document name (e.g., "Passport Copy")
	fileName: { type: String, required: false }, // Actual file name
	storagePath: { type: String, required: false }, // File storage path
	type: { type: String }, // File type (pdf, jpg, etc.)
	reviewStatus: {
		type: String,
		enum: ['approved', 'pending', 'rejected', 'missing', 'required'],
		default: 'pending'
	},
	required: { type: Boolean, default: false }, // Is this document required?
	rejectionReason: { type: String }, // Reason if rejected
	uploadedAt: { type: Date, default: Date.now },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	status: {
		type: String,
		enum: ['pending', 'accepted', 'rejected', 'needs_correction'],
		default: 'pending'
	},
	statusNotes: { type: String }, // Notes from public writer about why rejected or what needs correction
	reviewedAt: { type: Date },
	reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
