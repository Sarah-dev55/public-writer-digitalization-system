const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Login controller for public writer
 * Matches the client-side login implementation
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res) {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			return res.status(400).json({ 
				success: false, 
				message: 'Email and password are required' 
			});
		}

		// Find user by email
		const user = await User.findOne({ email }).lean();
		if (!user) {
			return res.status(401).json({ 
				success: false, 
				message: 'Invalid email or password' 
			});
		}

		// Check if user has a password (for existing users without password)
		if (!user.password) {
			return res.status(401).json({ 
				success: false, 
				message: 'Account not configured for login. Please contact administrator.' 
			});
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ 
				success: false, 
				message: 'Invalid email or password' 
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ 
				userId: user._id, 
				email: user.email, 
				role: user.role 
			},
			process.env.JWT_SECRET || 'your-secret-key-change-in-production',
			{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
		);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user;

		res.json({
			success: true,
			message: 'Login successful',
			data: {
				user: userWithoutPassword,
				token
			}
		});

	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ 
			success: false, 
			message: 'Internal server error' 
		});
	}
}

/**
 * Logout controller
 * POST /api/auth/logout
 * Note: For JWT-based auth, logout is typically handled client-side by removing the token
 */
async function logout(req, res) {
	try {
		// In a JWT-based system, logout is usually client-side
		// If you implement token blacklisting, you would handle it here
		res.json({
			success: true,
			message: 'Logout successful'
		});
	} catch (error) {
		console.error('Logout error:', error);
		res.status(500).json({ 
			success: false, 
			message: 'Internal server error' 
		});
	}
}

module.exports = { login, logout };
