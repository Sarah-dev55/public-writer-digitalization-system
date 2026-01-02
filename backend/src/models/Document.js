const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
	checklistItemId: { type: String }, // Links to checklist item's itemId
	name: { type: String, required: true }, // Document name (e.g., "Passport Copy")
	fileName: { type: String, required: false }, // Actual file name
	storagePath: { type: String, required: false }, // File storage path
	type: { type: String }, // File type (pdf, jpg, etc.)
	required: { type: Boolean, default: false }, // Is this document required?
	uploadedAt: { type: Date, default: Date.now },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected', 'needs_correction', 'missing', 'required'],
		default: 'pending'
	},
	statusNotes: { type: String }, // Notes from public writer about why rejected or what needs correction
	rejectionReason: { type: String }, // Reason if rejected (legacy, consider using statusNotes)
	reviewedAt: { type: Date },
	reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },


}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
