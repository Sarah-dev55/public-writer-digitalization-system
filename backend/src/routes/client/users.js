const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Document = require('../../models/Document');
const Appointment = require('../../models/Appointment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../../middleware/auth');

// Create uploads directory for profiles if it doesn't exist
const profilesDir = path.join(process.cwd(), 'uploads/profiles');
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// Configure multer storage for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + req.params.id + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  }
});

// Get case status
router.get('/case-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const documents = await Document.find({ userId });
    const appointments = await Appointment.find({ userId });

    // Logic to determine status of each step
    const steps = [
      { id: 1, title: 'Initial Consultation', status: 'pending', date: null },
      { id: 2, title: 'Document Preparation', status: 'pending', date: null },
      { id: 3, title: 'Application Submission', status: 'pending', date: null },
      { id: 4, title: 'Interview Preparation', status: 'pending', date: null },
      { id: 5, title: 'Final Review', status: 'pending', date: null }
    ];

    // Step 1: Initial Consultation
    // Logic: 
    // - If user exists -> 'pending' (default)
    // - If appointment booked -> 'in-progress'
    // - If appointment completed -> 'completed'

    // Check if any appointment exists
    const anyAppointment = appointments.length > 0;
    // Check if any appointment is completed (handling 'complete', 'completed', and whitespace)
    const completedAppointment = appointments.some(a => {
      const s = (a.status || '').toLowerCase().trim();
      return s === 'completed' || s === 'complete';
    });

    if (completedAppointment) {
      steps[0].status = 'completed';
      // Find the completed appointment date
      const completedApt = appointments.find(a => a.status === 'completed');
      steps[0].date = completedApt ? completedApt.date : user.createdAt.toISOString().split('T')[0];
    } else if (anyAppointment) {
      steps[0].status = 'in-progress';
      // Use the first appointment date
      steps[0].date = appointments[0].date;
    } else {
      // User exists but no appointment yet
      steps[0].status = 'pending';
      steps[0].date = user.createdAt.toISOString().split('T')[0];
    }

    // Step 2: Document Preparation
    // Logic: Complete if at least 1 document uploaded and ALL required docs are approved
    // Simplified: If > 0 documents and 0 are missing/rejected
    const hasDocuments = documents.length > 0;
    const pendingDocs = documents.some(d => d.status === 'pending');
    const rejectedDocs = documents.some(d => d.status === 'rejected');
    const missingDocs = documents.some(d => d.status === 'missing');

    // If hard override from user.currentStats
    if (user.currentStats > 1) {
      steps[1].status = 'completed';
    } else if (steps[0].status !== 'completed') {
      // Step 2 cannot be started until Step 1 is completed
      steps[1].status = 'pending';
    } else if (hasDocuments && !rejectedDocs && !missingDocs && !pendingDocs) {
      steps[1].status = 'completed';
    } else if (hasDocuments) {
      // Step 1 is completed AND documents exist -> In Progress
      steps[1].status = 'in-progress';
    } else {
      // Step 1 is completed, but no documents yet -> In Progress (Ready to start)
      // or should it be pending? "In Progress" implies it's the current active phase.
      // Since Step 1 is done, Step 2 IS the current phase.
      steps[1].status = 'in-progress';
    }

    // Step 3: Application Submission
    const submissionAppt = appointments.find(a => a.appointmentType === 'submission');
    if (user.currentStats > 2) {
      steps[2].status = 'completed';
    } else if (submissionAppt) {
      const status = (submissionAppt.status || '').toLowerCase();
      steps[2].status = (status === 'completed' || status === 'complete') ? 'completed' : 'in-progress';
      steps[2].date = submissionAppt.date;
    }

    // Step 4: Interview Preparation
    const interviewAppt = appointments.find(a => a.appointmentType === 'interview');
    if (user.currentStats > 3) {
      steps[3].status = 'completed';
    } else if (interviewAppt) {
      const status = (interviewAppt.status || '').toLowerCase();
      steps[3].status = (status === 'completed' || status === 'complete') ? 'completed' : 'in-progress';
      steps[3].date = interviewAppt.date;
    }

    // Step 5: Final Review
    if (user.currentStats >= 5) {
      steps[4].status = 'completed';
    } else if (steps[3].status === 'completed') {
      steps[4].status = 'in-progress';
    }

    // Calculate detailed percentage
    let completedSteps = steps.filter(s => s.status === 'completed').length;
    let progress = (completedSteps / 5) * 100;

    // Add partial progress for "in-progress" steps (e.g., +10%)
    const inProgressSteps = steps.filter(s => s.status === 'in-progress').length;
    progress += (inProgressSteps * 10);

    // Cap at 100
    progress = Math.min(progress, 100);

    // Determine current phase name
    let currentPhase = steps.find(s => s.status === 'in-progress')?.title || 'Completed';
    if (progress === 100) currentPhase = 'Case Closed';

    res.json({
      progress,
      currentPhase,
      steps
    });

  } catch (error) {
    console.error('Error calculating case status:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update authenticated user's profile (must be before /:id route)
router.put('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const allowedFields = ['fullName', 'email', 'phone'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body.hasOwnProperty(field)) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: 'fullName and email are required' });
    }

    // If password is provided, encourage using /api/auth/signup instead.
    if (password) {
      return res.status(400).json({
        message: 'Use /api/auth/signup to create an account with a password.'
      });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      fullName,
      email: String(email).toLowerCase().trim(),
      phone,
      role: 'public_writer'
    });

    // Create checklist and link it
    const Checklist = require('../../models/Checklist');
    const checklist = await Checklist.create({
      title: `Checklist - ${user.fullName}`,
      userId: user._id,
      items: []
    });

    user.checklistId = checklist._id;
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upload profile image
router.post('/:id/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.params.id;
    const profileImageUrl = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;