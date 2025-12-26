const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- Signup ---
async function signup(req, res) {
    try {
        const { firstName, lastName, email, password, phone, location } = req.body;

        // 1. التحقق من الحقول المطلوبة
        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const fullName = `${firstName} ${lastName}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. البحث عن المستخدم الحالي
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // أ: إذا كان الحساب موثقاً بالفعل، نرفض التسجيل
            if (existingUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered and verified. Please login."
                });
            }

            // ب: إذا كان الحساب موجوداً ولكنه غير موثق، نقوم بتحديث بياناته وإرسال كود جديد
            existingUser.fullName = fullName;
            existingUser.password = hashedPassword;
            existingUser.phone = phone;
            existingUser.location = location || '';
            existingUser.verificationCode = otpCode;
            await existingUser.save();

            // إرسال الإيميل
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your New Verification Code",
                text: `Your verification code is: ${otpCode}`
            });

            return res.status(200).json({
                success: true,
                message: "Email was pending verification. A new code has been sent!"
            });
        }

        // 3. إذا كان المستخدم جديداً تماماً، نقوم بإنشائه
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
            location: location || '',
            verificationCode: otpCode,
            isVerified: false
        });

        await newUser.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is: ${otpCode}`
        });

        res.status(201).json({
            success: true,
            message: "Signup successful! Check your email for verification code."
        });

    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error: " + err.message
        });
    }
}

// --- Login ---
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                needsVerification: true,
                message: "Please verify your email first."
            });
        }

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    location: user.location
                }
            }
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error: " + err.message
        });
    }
}

// --- Verify ---
async function verify(req, res) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "Email and code are required"
            });
        }

        const user = await User.findOne({ email, verificationCode: code });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: "Email verified successfully!",
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    location: user.location
                }
            }
        });
    } catch (err) {
        console.error("Verify Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error: " + err.message
        });
    }
}

// --- Resend Code ---
async function resendCode(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.findOneAndUpdate({ email }, { verificationCode: otpCode });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "New Verification Code",
            text: `Your new verification code is: ${otpCode}`
        });

        res.json({
            success: true,
            message: "Verification code resent successfully!"
        });
    } catch (err) {
        console.error("Resend Code Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error: " + err.message
        });
    }
}

// --- Delete Unverified Users ---
async function deleteUnverifiedUsers(req, res) {
    try {
        const result = await User.deleteMany({ isVerified: false });

        res.json({
            success: true,
            message: `${result.deletedCount} unverified users deleted successfully.`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// --- Get User Profile ---
async function getProfile(req, res) {
    try {
        const user = await User.findById(req.userId).select('-password -verificationCode');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                location: user.location
            }
        });
    } catch (err) {
        console.error("Get Profile Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error: " + err.message
        });
    }
}

module.exports = { login, signup, verify, resendCode, deleteUnverifiedUsers, getProfile };