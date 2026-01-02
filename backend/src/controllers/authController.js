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
      role: 'client',
      passwordHash
    });

    // Make a new checklist for the user
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

    if (user.passwordHash) {
      if (!password) return res.status(400).json({ success: false, message: 'password is required' });
      const ok = await bcrypt.compare(String(password), user.passwordHash);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } else {
      // Let the user set their password the first time
      if (password && String(password).length >= 6) {
        user.passwordHash = await bcrypt.hash(String(password), 10);
        await user.save();
      }
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


async function login(req, res) {
  return signin(req, res);
}

async function logout(req, res) {
  try {
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

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'currentPassword and newPassword are required' });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the current password is correct
    if (user.passwordHash) {
      const isValid = await bcrypt.compare(String(currentPassword), user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
    }

    // Hash and save the new password
    user.passwordHash = await bcrypt.hash(String(newPassword), 10);
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { login, logout, signup, signin, changePassword };