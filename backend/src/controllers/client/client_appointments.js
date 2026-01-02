const Appointment = require('../../models/Appointment');
const NoWorkDay = require('../../models/NoWorkDay');

// Get all the meetings for one user
async function getUserAppointments(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const appointments = await Appointment.find({ userId }).sort({ date: 1, timeSlot: 1 });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        res.status(500).json({ message: error.message });
    }
}

// Change a meeting time or info
async function updateAppointment(req, res) {
    try {
        const { id } = req.params;
        const { userId, date, timeSlot, notes, appointmentType, status } = req.body;

        // Validate userId is provided
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Validate ownership
        if (appointment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to modify this appointment' });
        }

        // If the date changes, check if it's okay
        if (date && date !== appointment.date) {
            // Check if the date is written correctly
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
            }

            // Check if it is a holiday or weekend
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const weekday = days[dateObj.getDay()];

            const nonWorking = await NoWorkDay.findOne({
                $or: [
                    { date },
                    { isRecurring: true, date: weekday }
                ]
            });

            if (nonWorking) {
                return res.status(400).json({ message: 'This day is unavailable (non-working day).' });
            }
        }

        // Check if someone else already has this time
        if ((date && date !== appointment.date) || (timeSlot && timeSlot !== appointment.timeSlot)) {
            const newDate = date || appointment.date;
            const newTimeSlot = timeSlot || appointment.timeSlot;

            const conflictingAppointment = await Appointment.findOne({
                _id: { $ne: id }, // Exclude current appointment
                date: newDate,
                timeSlot: newTimeSlot
            });

            if (conflictingAppointment) {
                return res.status(400).json({ message: 'This time slot is already booked.' });
            }
        }

        // Update the meeting info
        if (date !== undefined) appointment.date = date;
        if (timeSlot !== undefined) appointment.timeSlot = timeSlot;
        if (notes !== undefined) appointment.notes = notes;
        if (appointmentType !== undefined) appointment.appointmentType = appointmentType;
        if (status !== undefined) appointment.status = status;

        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: error.message });
    }
}

// Cancel or delete a meeting
async function deleteAppointment(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Validate userId is provided
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Validate ownership
        if (appointment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this appointment' });
        }

        // Remove the meeting
        await Appointment.findByIdAndDelete(id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUserAppointments,
    updateAppointment,
    deleteAppointment
};
