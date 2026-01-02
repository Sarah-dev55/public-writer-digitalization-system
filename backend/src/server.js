require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');

const app = express();

// Connect to the database
connectDB();

// Setup stuff for the app
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This part helps show files from the uploads folder
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Get the route files

// Routes for login and signup
const authRoutes = require('./routes/auth');

// Routes for the client side
const clientUserRoutes = require('./routes/client/users');
const clientAppointmentRoutes = require('./routes/client/appointments');
const clientChecklistRoutes = require('./routes/client/checklists');
const clientNoWorkDayRoutes = require('./routes/client/noWorkDays');
const clientDocumentRoutes = require('./routes/client/documents');
const clientNotificationRoutes = require('./routes/client/notifications');

// Routes for the admin side
const adminUserRoutes = require('./routes/admin/apiUsers');
const adminAppointmentRoutes = require('./routes/admin/appointments');
const adminChecklistRoutes = require('./routes/admin/checklists');
const adminDocumentRoutes = require('./routes/admin/documents');
const availabilityRoutes = require('./routes/admin/availability');
const clientArchiveRoutes = require('./routes/admin/clientArchives');
const { verifyToken, requireRole } = require('./middleware/auth');

// Other routes
const mrMensurRoutes = require('./routes/mrMensur');


// Tell the app to use these routes

// Use auth routes
app.use('/api/auth', authRoutes);

// Use client routes
app.use('/api/client/users', clientUserRoutes);
app.use('/api/client/appointments', clientAppointmentRoutes);
app.use('/api/client/checklists', clientChecklistRoutes);
app.use('/api/client/noworkdays', clientNoWorkDayRoutes);
app.use('/api/client/documents', clientDocumentRoutes);
app.use('/api/client/notifications', clientNotificationRoutes);

// Use admin routes and check if user is admin
app.use('/api/admin/users', verifyToken, requireRole('admin'), adminUserRoutes);
app.use('/api/admin/appointments', verifyToken, requireRole('admin'), adminAppointmentRoutes);
app.use('/api/admin/checklists', verifyToken, requireRole('admin'), adminChecklistRoutes);
app.use('/api/admin/documents', verifyToken, requireRole('admin'), adminDocumentRoutes);
app.use('/api/admin/availability', verifyToken, requireRole('admin'), availabilityRoutes);
app.use('/api/admin/archives', verifyToken, requireRole('admin'), clientArchiveRoutes);

// Other
app.use('/api/mrmensur', mrMensurRoutes);


// Check if the server is healthy
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// The main page of the API
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API Server',
    version: '1.0.0',
    endpoints: {
      client: {
        users: '/api/client/users',
        appointments: '/api/client/appointments',
        checklists: '/api/client/checklists',
        noWorkDays: '/api/client/noworkdays',
        documents: '/api/client/documents'
      },
      admin: {
        users: '/api/admin/users',
        appointments: '/api/admin/appointments',
        checklists: '/api/admin/checklists',
        documents: '/api/admin/documents',
        availability: '/api/admin/availability',
        archives: '/api/admin/archives'
      },
      other: {
        mrMensur: '/api/mrmensur',
        health: '/api/health'
      }
    }
  });
});

// Handle cases where the page is not found
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Handle errors if something breaks
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error'
  });
});

// Start the server on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;