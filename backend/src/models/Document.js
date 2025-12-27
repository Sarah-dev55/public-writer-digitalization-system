const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
	checklistItemId: { type: Schema.Types.ObjectId, ref: 'Checklist.items' },
	fileName: { type: String, required: true },
	storagePath: { type: String, required: true },
	type: { type: String },
	uploadedAt: { type: Date, default: Date.now },
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
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
