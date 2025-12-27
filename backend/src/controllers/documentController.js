const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

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
		// Expecting file upload handling elsewhere; here we store metadata
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

		// Get the file path from the document
		const filePath = path.join(process.cwd(), doc.storagePath);

		// Check if file exists
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ success: false, message: 'File not found on server' });
		}

		// Set appropriate headers for file download
		res.setHeader('Content-Type', 'application/octet-stream');
		res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`);

		// Send the file
		res.sendFile(filePath);
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

module.exports = { listByUser, listAll, listPending, create, update, download };
