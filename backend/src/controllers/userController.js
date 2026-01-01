const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../utils/emailService');

// Generate 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// Format user response (remove sensitive data)
const formatUserResponse = (user) => {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location || '',
        avatar: user.avatar,
        isVerified: user.isVerified,
        fullName: `${user.firstName} ${user.lastName}`
    };
};

// @route   POST /api/auth/signup
// @desc    Register a new user
exports.signup = async(req, res) => {
    try {
        const { firstName, lastName, phone, email, password } = req.body;

        // Validation
        if (!firstName || !lastName || !phone || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            phone,
            email: email.toLowerCase(),
            password: hashedPassword,
            verificationCode,
            verificationCodeExpires,
            isVerified: false
        });

        // Send verification email
        try {
            await emailService.sendVerificationEmail(email, verificationCode);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail signup if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Account created! Please check your email for verification code.',
            data: {
                user: formatUserResponse(user)
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
};

// @route   POST /api/auth/verify
// @desc    Verify user email with code
exports.verify = async(req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email and verification code are required'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Account already verified'
            });
        }

        // Check code
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        // Check if code expired
        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Verification code expired'
            });
        }

        // Verify user
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Email verified successfully!',
            data: {
                token,
                user: formatUserResponse(user)
            }
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification'
        });
    }
};

// @route   POST /api/auth/login
// @desc    Login user
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first',
                needsVerification: true
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful!',
            data: {
                token,
                user: formatUserResponse(user)
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @route   POST /api/auth/resend-code
// @desc    Resend verification code
exports.resendCode = async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Account already verified'
            });
        }

        // Generate new code
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        // Send email
        try {
            await emailService.sendVerificationEmail(email, verificationCode);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.json({
            success: true,
            message: 'Verification code resent successfully!'
        });

    } catch (error) {
        console.error('Resend code error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @route   GET /api/auth/me
// @desc    Get current user profile
exports.getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: formatUserResponse(user)
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
exports.updateProfile = async(req, res) => {
    try {
        const { firstName, lastName, phone, location } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (location !== undefined) user.location = location;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully!',
            data: {
                user: formatUserResponse(user)
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};