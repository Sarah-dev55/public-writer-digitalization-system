const Appointment = require('../models/Appointment');

async function getByDate(req, res) {
	const { date } = req.params;
	try {
		const appts = await Appointment.find({ date });
		res.json({ success: true, data: appts });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function listAll(req, res) {
	try {
		const appts = await Appointment.find();
		res.json({ success: true, data: appts });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function create(req, res) {
	try {
		const appt = new Appointment(req.body);
		await appt.save();
		res.status(201).json({ success: true, data: appt });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function update(req, res) {
	try {
		const { status } = req.body;
		if (status) {
			const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
			if (!validStatuses.includes(status)) {
				return res.status(400).json({ success: false, message: 'Invalid status' });
			}
		}
		const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!appt) return res.status(404).json({ success: false, message: 'Not found' });
		res.json({ success: true, data: appt });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function remove(req, res) {
	try {
		const appt = await Appointment.findByIdAndDelete(req.params.id);
		if (!appt) return res.status(404).json({ success: false, message: 'Not found' });
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

module.exports = { getByDate, listAll, create, update, remove };
