const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
	checklistItemId: { type: String }, // Link to an item in the checklist
	name: { type: String, required: true }, // The name of the paper
	fileName: { type: String, required: false }, // The name of the file
	storagePath: { type: String, required: false }, // Where the file is stored
	type: { type: String }, // What kind of file it is
	required: { type: Boolean, default: false }, // Do we need this?
	uploadedAt: { type: Date, default: Date.now },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected', 'needs_correction', 'missing', 'required'],
		default: 'pending'
	},
	statusNotes: { type: String }, // Notes about why it's rejected or needs a fix
	rejectionReason: { type: String }, // Why it was rejected
	reviewedAt: { type: Date },
	reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },


}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
