import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, PenTool, ArrowRight, Phone } from 'lucide-react';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Sign Up:', formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundColor: "#344E41",
        backgroundImage:
          "radial-gradient(circle at 70% 30%, rgba(88,129,87,0.15), transparent 50%), radial-gradient(circle at 30% 70%, rgba(88,129,87,0.10), transparent 50%)"
      }}
    >
      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: "#588157" }}
            >
              <PenTool className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-green-100">Join us and start your journey</p>
        </div>

        {/* Card */}
        <div
          className="backdrop-blur-xl rounded-3xl border p-8 shadow-2xl"
          style={{
            backgroundColor: "rgba(52,78,65,0.6)",
            borderColor: "#588157"
          }}
        >
          <div className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-green-100 font-semibold mb-2">Full Name</label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#588157" }}
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent border rounded-xl pl-12 pr-4 py-3 text-white placeholder-green-200 focus:outline-none"
                  style={{ borderColor: "#588157" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-green-100 font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#588157" }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border rounded-xl pl-12 pr-4 py-3 text-white placeholder-green-200 focus:outline-none"
                  style={{ borderColor: "#588157" }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-green-100 font-semibold mb-2">Phone Number</label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#588157" }}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full bg-transparent border rounded-xl pl-12 pr-4 py-3 text-white placeholder-green-200 focus:outline-none"
                  style={{ borderColor: "#588157" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-green-100 font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#588157" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full bg-transparent border rounded-xl pl-12 pr-12 py-3 text-white placeholder-green-200 focus:outline-none"
                  style={{ borderColor: "#588157" }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#588157" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-green-100 font-semibold mb-2">Confirm Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#588157" }}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent border rounded-xl pl-12 pr-12 py-3 text-white placeholder-green-200 focus:outline-none"
                  style={{ borderColor: "#588157" }}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#588157" }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition transform hover:scale-[1.02]"
              style={{ backgroundColor: "#588157" }}
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-green-100">
              Already have an account?{" "}
              <a href="/login" className="font-bold" style={{ color: "#588157" }}>
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm font-semibold transition"
            style={{ color: "#588157" }}
          >
            ← Back to Home
          </a>
        </div>

      </div>
    </div>
  );
}
