const db = require('../config/database');
const User = require('../models/User');
const Checklist = require('../models/Checklist');
const Appointment = require('../models/Appointment');
const Document = require('../models/Document');
const NoWorkDay = require('../models/NoWorkDay');

async function seed() {
  await db.connect();

  // Clean existing minimal collections (be careful in prod!)
  await User.deleteMany({});
  await Checklist.deleteMany({});
  await Appointment.deleteMany({});
  await Document.deleteMany({});
  await NoWorkDay.deleteMany({});

  // Create a default user (public writer)
  const user = await User.create({
    fullName: 'Mr. Mensur',
    email: 'admin@local',
    phone: '+000000000',
    role: 'public_writer',
  });

  // Default checklist for passport procedure
  const checklist = await Checklist.create({
    title: 'Passport Procedure',
    userId: user._id,
    items: [
      { itemId: 'i1', label: 'Passport Scan', required: true },
      { itemId: 'i2', label: 'Driver License (if any)', required: false },
    ],
  });

  // Link checklist to user
  user.checklistId = checklist._id;
  await user.save();

  // Appointments for couple days
  const appts = await Appointment.insertMany([
    { date: '2025-11-30', timeSlot: '10:00 AM', notes: 'Document review', status: 'scheduled', userId: user._id },
    { date: '2025-11-30', timeSlot: '11:30 AM', notes: 'Initial consultation', status: 'scheduled', userId: user._id },
    { date: '2025-12-01', timeSlot: '02:00 PM', notes: 'Visa prep', status: 'scheduled', userId: user._id },
  ]);

  // Documents (metadata)
  const docs = await Document.insertMany([
    { checklistItemId: checklist.items[0]._id, fileName: 'passport_sample.png', storagePath: 'uploads/documents/passport_sample.png', type: 'passport', userId: user._id },
  ]);

  // No work days
  const nw = await NoWorkDay.insertMany([
    { date: '2025-12-25', isRecurring: true, reason: 'Christmas' },
    { date: '2025-11-26', isRecurring: false, reason: 'Personal' },
  ]);

  console.log('Seed complete');
  console.log('User id:', user._id.toString());
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error', err);
  process.exit(1);
});
