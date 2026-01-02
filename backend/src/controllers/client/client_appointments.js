const Appointment = require('../../models/Appointment');
const NoWorkDay = require('../../models/NoWorkDay');
const User = require('../../models/User');
const { notifyAdmins } = require('../../utils/notificationHelper');

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

// Make a new meeting and check if it's okay
async function createAppointment(req, res) {
    try {
        const { date, timeSlot, notes, appointmentType } = req.body;
        const userId = req.body.userId || (req.user ? req.user.id : null);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!date || !timeSlot) {
            return res.status(400).json({ message: 'Date and time slot are required' });
        }

        // Check if the date is written correctly
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Get the name of the day
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekday = days[dateObj.getDay()];

        // 1. Check if the office is closed that day
        const nonWorking = await NoWorkDay.findOne({
            $or: [
                { date },
                { isRecurring: true, date: weekday }
            ]
        });
        if (nonWorking) {
            return res.status(400).json({ message: 'This day is unavailable (non-working day).' });
        }

        // 2. Check if someone else already has this time
        const alreadyBooked = await Appointment.findOne({ date, timeSlot });
        if (alreadyBooked) {
            return res.status(400).json({ message: "This time slot is already booked." });
        }

        // 3. Save the new meeting
        const appointment = new Appointment({
            date,
            timeSlot,
            notes,
            appointmentType,
            userId,
            status: 'scheduled'
        });

        const newAppointment = await appointment.save();

        // Tell the admins about the new meeting
        try {
            const user = await User.findById(userId);
            const userName = user ? (user.fullName || user.email) : 'A client';
            await notifyAdmins(
                'New Appointment Booked',
                `${userName} has booked an appointment for ${date} at ${timeSlot}`,
                'info'
            );
        } catch (notifError) {
            console.error('Error sending notification:', notifError);
            // If the message fails, save the meeting anyway
        }

        res.status(201).json(newAppointment);

    } catch (error) {
        console.error('Error creating appointment:', error);
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
    createAppointment,
    updateAppointment,
    deleteAppointment
};
