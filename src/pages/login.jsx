import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, PenTool, ArrowRight } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundColor: "#344E41",
        backgroundImage: "radial-gradient(circle at 70% 30%, rgba(88,129,87,0.15), transparent 50%), radial-gradient(circle at 30% 70%, rgba(88,129,87,0.10), transparent 50%)"
      }}
    >
      <div className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: "#588157" }}
            >
              <PenTool className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-green-100">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div
          className="backdrop-blur-xl rounded-3xl border p-8 shadow-2xl"
          style={{
            backgroundColor: "rgba(52,78,65,0.6)",
            borderColor: "#588157"
          }}
        >
          <div className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-green-100 font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#588157" }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border rounded-xl pl-12 pr-4 py-3 text-white placeholder-green-200 focus:outline-none transition"
                  style={{
                    borderColor: "#588157"
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-green-100 font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#588157" }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-transparent border rounded-xl pl-12 pr-12 py-3 text-white placeholder-green-200 focus:outline-none transition"
                  style={{
                    borderColor: "#588157"
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition"
                  style={{ color: "#588157" }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" style={{ accentColor: "#588157" }} />
                <span className="text-green-100 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold" style={{ color: "#588157" }}>
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: "#588157"
              }}
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: "#588157" }}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-4 text-green-100"
                  style={{ backgroundColor: "rgba(52,78,65,0.6)" }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className="py-3 rounded-xl transition font-semibold text-white"
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid #588157"
                }}
              >
                Google
              </button>
              <button
                className="py-3 rounded-xl transition font-semibold text-white"
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid #588157"
                }}
              >
                Facebook
              </button>
            </div>
          </div>

          {/* Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-green-100">
              Don't have an account?{' '}
              <a href="/signup" className="font-bold" style={{ color: "#588157" }}>
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm font-semibold transition" style={{ color: "#588157" }}>
            ← Back to Home
          </a>
        </div>

      </div>
    </div>
  );
}
