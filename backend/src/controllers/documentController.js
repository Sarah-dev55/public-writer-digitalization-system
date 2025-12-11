const Document = require('../models/Document');

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

module.exports = { listByUser, listAll, listPending, create, update };
