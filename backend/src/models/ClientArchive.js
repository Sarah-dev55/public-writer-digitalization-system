const mongoose = require('mongoose');
const { Schema } = mongoose;

const CaseHistorySchema = new Schema({
  caseType: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum:  ['open', 'in_progress', 'completed', 'closed'], default: 'open' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  notes: { type: String },
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
}, { timestamps: true });

const ClientArchiveSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String },
  clientPhone: { type:  String },
  caseHistory: [CaseHistorySchema],
  totalCases: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  archivedAt: { type: Date },
  tags: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

// Index for search functionality
ClientArchiveSchema.index({ clientName: 'text', 'caseHistory.caseType': 'text', 'caseHistory.description':  'text' });

module.exports = mongoose.model('ClientArchive', ClientArchiveSchema);