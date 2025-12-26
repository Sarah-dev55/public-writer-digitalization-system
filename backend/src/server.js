const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ CORS Configuration - Very Important
app.use(cors({
    origin: ['http://localhost:5177', 'http://localhost:3000'], // All possible React ports
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Parse JSON
app.use(express.json());

// Routes
const authRoutes = require('./routes/mrMensur');
app.use('/api/auth', authRoutes);

// Home route for testing
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "🚀 Server is Live on Port 5070!"
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Server error occurred"
    });
});

// Start server
const PORT = process.env.PORT || 5070;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});