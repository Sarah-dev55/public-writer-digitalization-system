const documentService = require('../services/documentService');

async function listByUser(req, res) {
	const { userId } = req.params;
	try {
		const docs = await documentService.getDocumentsByUser(userId);
		res.json({ success: true, data: docs });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function listAll(req, res) {
	try {
		const docs = await documentService.getAllDocuments();
		res.json({ success: true, data: docs });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function listPending(req, res) {
	try {
		const docs = await documentService.getPendingDocuments();
		res.json({ success: true, data: docs });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function create(req, res) {
	try {
		// Expecting file upload handling elsewhere; here we store metadata
		const doc = await documentService.createDocument(req.body);
		res.status(201).json({ success: true, data: doc });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function update(req, res) {
	try {
		const updated = await documentService.updateDocument(req.params.id, req.body);
		res.json({ success: true, data: updated });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

module.exports = { listByUser, listAll, listPending, create, update };
