const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // أضفنا هذا السطر ليعمل التوجيه بشكل صحيح
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Parse JSON
app.use(express.json());

// --- إصلاح قسم الروابط (Routes) ---
// قمنا بحذف التكرار واستخدام مسار ديناميكي لضمان عمله على جهازك
const authRoutes = require(path.resolve(__dirname, 'routes', 'mrMensur.js'));
app.use('/api/auth', authRoutes);

// Home route for testing
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "🚀 Server is Live!"
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