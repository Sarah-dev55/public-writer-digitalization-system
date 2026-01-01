const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Checklist = require('../models/Checklist');

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.passwordHash;
  return obj;
}

async function signup(req, res) {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'fullName and email are required' });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      fullName,
      email: String(email).toLowerCase().trim(),
      phone,
      role: 'public_writer',
      passwordHash
    });

    // create a checklist and link it (since User.checklistId is ObjectId)
    const checklist = await Checklist.create({
      title: `Checklist - ${user.fullName}`,
      userId: user._id,
      items: []
    });

    user.checklistId = checklist._id;
    await user.save();

    const token = signToken(user);
    return res.status(201).json({ success: true, token, data: sanitizeUser(user) });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'email is required' });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // If passwordHash exists, require password check.
    if (user.passwordHash) {
      if (!password) return res.status(400).json({ success: false, message: 'password is required' });
      const ok = await bcrypt.compare(String(password), user.passwordHash);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } else {
      // Backwards-compat: allow first-time password set on signin if provided
      if (password && String(password).length >= 6) {
        user.passwordHash = await bcrypt.hash(String(password), 10);
        await user.save();
      }
      // If no password provided and no passwordHash, allow login (DEV mode)
      // You can disable this by setting REQUIRE_PASSWORD=true
      if (process.env.REQUIRE_PASSWORD === 'true') {
        return res.status(400).json({ success: false, message: 'password is required' });
      }
    }

    const token = signToken(user);
    return res.json({ success: true, token, data: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}


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

module.exports = { login, logout ,signup, signin};