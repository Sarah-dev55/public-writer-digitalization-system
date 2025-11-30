require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const checklistRoutes = require('./routes/checklists');
const documentRoutes = require('./routes/documents');
const noWorkDayRoutes = require('./routes/noWorkDays');
const mrMensurRoutes = require('./routes/mrMensur');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/noworkdays', noWorkDayRoutes);
app.use('/api/mrmensur', mrMensurRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});