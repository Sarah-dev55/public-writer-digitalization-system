const Document = require('../models/Document');
const path = require('path');
const fs = require('fs').promises;

async function listByUser(req, res) {
	const { userId } = req.params;
	try {
		const docs = await Document.find({ userId });
		res.json({ success: true, data: docs });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function listAll(req, res) {
	try {
		const docs = await Document.find();
		res.json({ success: true, data: docs });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function listPending(req, res) {
	try {
		const docs = await Document.find({ status: 'pending' });
		res.json({ success: true, data: docs });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function create(req, res) {
	try {
		// We save the document info here
		const doc = new Document(req.body);
		await doc.save();
		res.status(201).json({ success: true, data: doc });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function update(req, res) {
	try {
		const updated = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
		res.json({ success: true, data: updated });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function download(req, res) {
	try {
		const doc = await Document.findById(req.params.id);
		if (!doc) {
			return res.status(404).json({ success: false, message: 'Document not found' });
		}

		// Check the file path
		let filePath = doc.storagePath;
		if (!path.isAbsolute(filePath)) {
			// If the path is short, make it full
			filePath = path.join(process.cwd(), filePath);
		}

		// Check if the file is really there
		try {
			await fs.access(filePath);
			res.download(filePath, doc.fileName);
		} catch (err) {
			return res.status(404).json({ success: false, message: 'File not found on server' });
		}
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function updateStatus(req, res) {
	try {
		const { id } = req.params;
		const { status, statusNotes } = req.body;

		// Make sure the status is okay
		const validStatuses = ['pending', 'approved', 'rejected', 'needs_correction', 'missing', 'required'];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
			});
		}

		// Change the status for the client view
		const statusToReviewStatus = {
			'pending': 'pending',
			'approved': 'approved',
			'rejected': 'rejected',
			'needs_correction': 'pending'
		};

		// Update the document in the database
		const updateData = {
			status,
			reviewStatus: statusToReviewStatus[status],
			statusNotes: statusNotes || '',
			rejectionReason: status === 'rejected' ? (statusNotes || 'Document rejected') : undefined,
			reviewedAt: new Date(),
			reviewedBy: req.user ? req.user.id : null
		};

		const doc = await Document.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		);

		if (!doc) {
			return res.status(404).json({ success: false, message: 'Document not found' });
		}

		res.json({ success: true, data: doc });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

module.exports = { listByUser, listAll, listPending, create, update, download, updateStatus };
