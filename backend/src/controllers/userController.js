const User = require('../models/User');

async function list(req, res) {
	try {
		const users = await User.find().lean();
		res.json({ success: true, data: users });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function getById(req, res) {
	try {
		const user = await User.findById(req.params.id).lean();
		if (!user) return res.status(404).json({ success: false, message: 'Not found' });
		res.json({ success: true, data: user });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function update(req, res) {
	try {
		const allowedFields = ['fullName', 'email', 'phone', 'role', 'checklistId', 'currentStats'];
		const updates = {};
		for (const k of allowedFields) {
			if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
		}

		const user = await User.findByIdAndUpdate(
			req.params.id,
			updates,
			{ new: true, runValidators: true }
		).lean();
		if (!user) return res.status(404).json({ success: false, message: 'Not found' });
		res.json({ success: true, data: user });
	} catch (err) {
		// Show a nice message if the email is already used
		if (err?.code === 11000) {
			return res.status(400).json({ success: false, message: 'Email already exists' });
		}
		res.status(500).json({ success: false, message: err.message });
	}
}

async function remove(req, res) {
	try {
		const user = await User.findByIdAndDelete(req.params.id).lean();
		if (!user) return res.status(404).json({ success: false, message: 'Not found' });
		res.json({ success: true, message: 'User deleted', data: user });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

module.exports = { list, getById, update, remove };
