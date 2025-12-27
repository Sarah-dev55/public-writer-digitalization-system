require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// Import Routes
// =====================

// Client routes
const clientUserRoutes = require('./routes/client/users');
const clientAppointmentRoutes = require('./routes/client/appointments');
const clientChecklistRoutes = require('./routes/client/checklists');
const clientNoWorkDayRoutes = require('./routes/client/noWorkDays');

// Admin routes
const adminUserRoutes = require('./routes/admin/apiUsers');
const adminAppointmentRoutes = require('./routes/admin/appointments');
const adminChecklistRoutes = require('./routes/admin/checklists');
const adminDocumentRoutes = require('./routes/admin/documents');
const availabilityRoutes = require('./routes/admin/availability');
const clientArchiveRoutes = require('./routes/admin/clientArchives');

// Other functional routes
const mrMensurRoutes = require('./routes/mrMensur');


// =====================
// API Routes
// =====================

// Client-facing API
app.use('/api/client/users', clientUserRoutes);
app.use('/api/client/appointments', clientAppointmentRoutes);
app.use('/api/client/checklists', clientChecklistRoutes);
app.use('/api/client/noworkdays', clientNoWorkDayRoutes);

// Admin-facing API (Public Writer)
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/appointments', adminAppointmentRoutes);
app.use('/api/admin/checklists', adminChecklistRoutes);
app.use('/api/admin/documents', adminDocumentRoutes);
app.use('/api/admin/availability', availabilityRoutes);
app.use('/api/admin/archives', clientArchiveRoutes);

// Other
app.use('/api/mrmensur', mrMensurRoutes);


// =====================
// Health Check
// =====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// =====================
// Root Route
// =====================
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API Server',
    version: '1.0.0',
    endpoints: {
      client: {
        users: '/api/client/users',
        appointments: '/api/client/appointments',
        checklists: '/api/client/checklists',
        noWorkDays: '/api/client/noworkdays'
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

// =====================
// 404 Handler
// =====================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// =====================
// Error Handling
// =====================
app. use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error'
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;