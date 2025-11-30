const appointmentService = require('../services/appointmentService');

async function getByDate(req, res) {
	const { date } = req.params;
	try {
		const appts = await appointmentService.getAppointmentsByDate(date);
		res.json({ success: true, data: appts });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function listAll(req, res) {
    try {
        const appts = await appointmentService.getAllAppointments();
        res.json({ success: true, data: appts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function create(req, res) {
	try {
		const appt = await appointmentService.createAppointment(req.body);
		res.status(201).json({ success: true, data: appt });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function update(req, res) {
	try {
		const appt = await appointmentService.updateAppointment(req.params.id, req.body);
		res.json({ success: true, data: appt });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

async function remove(req, res) {
	try {
		await appointmentService.deleteAppointment(req.params.id);
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
}

module.exports = { getByDate, listAll, create, update, remove };
