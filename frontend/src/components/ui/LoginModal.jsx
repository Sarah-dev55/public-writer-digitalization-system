import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ✅ Main Fix - Remove /signup from the end
const API_URL = "http://localhost:5070/api/auth";

export const LoginModal = ({ open, onClose, onLogin }) => {
  const [view, setView] = useState("login");
  
  // Login data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup data
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Verification data
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!open) return null;

  // Show error message
  const showError = (msg) => {
    setError(msg);
    setMessage("");
    setTimeout(() => setError(""), 5000);
  };

  // Show success message
  const showMessage = (msg) => {
    setMessage(msg);
    setError("");
    setTimeout(() => setMessage(""), 5000);
  };

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // If account not verified
        if (data.needsVerification) {
          setVerificationEmail(email);
          setView("verify");
          showError(data.message);
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      // Save token
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      showMessage(data.message);
      setTimeout(() => {
        onLogin(data.data.user);
        onClose();
      }, 1000);

    } catch (err) {
      if (err.message === "Failed to fetch") {
        showError("Check your Internet or Backend Server (Port 5070)");
      } else {
        showError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (!signupData.firstName || !signupData.lastName || !signupData.email || 
        !signupData.password || !signupData.phone) {
      showError("All fields are required!");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    if (signupData.password.length < 6) {
      showError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          phone: signupData.phone,
          email: signupData.email,
          password: signupData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      showMessage(data.message);
      setVerificationEmail(signupData.email);
      setTimeout(() => setView("verify"), 1500);

    } catch (err) {
      if (err.message === "Failed to fetch") {
        showError("Check your Internet or Backend Server (Port 5070)");
      } else {
        showError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Verification
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!verificationCode || verificationCode.length !== 6) {
      showError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Save token
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      showMessage(data.message);
      
      setTimeout(() => {
        onLogin(data.data.user);
        onClose();
      }, 1500);

    } catch (err) {
      if (err.message === "Failed to fetch") {
        showError("Check your Internet or Backend Server (Port 5070");
      } else {
        showError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage("Verification code resent successfully!");

    } catch (err) {
      if (err.message === "Failed to fetch") {
        showError("Check your Internet or Backend Server (Port 5070)");
      } else {
        showError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-10">
      <Card className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {view === "login" ? (
            /* Login View */
            <>
              <header className="mb-4">
                <h3 className="text-lg font-semibold">Sign in to continue</h3>
                <p className="text-sm text-muted-foreground">You need an account to access this feature.</p>
              </header>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col text-sm">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 border rounded"
                    placeholder="you@example.com"
                    required
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 p-2 border rounded"
                    placeholder="Password"
                    required
                  />
                </label>
                <div className="flex items-center justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-sm text-center">
                <p>Don't have an account? 
                  <button 
                    onClick={() => setView("signup")} 
                    className="text-app-primary underline ml-1 font-bold"
                    type="button"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          ) : view === "signup" ? (
            /* Signup View */
            <>
              <header className="mb-4">
                <h3 className="text-lg font-semibold">Create New Account</h3>
                <p className="text-sm text-muted-foreground">Fill in the details below to join us.</p>
              </header>

              <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-sm">First Name
                    <input 
                      name="firstName" 
                      required 
                      value={signupData.firstName}
                      onChange={handleSignupChange} 
                      className="w-full mt-1 p-2 border rounded" 
                    />
                  </label>
                  <label className="text-sm">Last Name
                    <input 
                      name="lastName" 
                      required 
                      value={signupData.lastName}
                      onChange={handleSignupChange} 
                      className="w-full mt-1 p-2 border rounded" 
                    />
                  </label>
                </div>
                <label className="text-sm">Phone
                  <input 
                    name="phone" 
                    type="tel" 
                    required 
                    value={signupData.phone}
                    onChange={handleSignupChange} 
                    className="mt-1 p-2 border rounded w-full" 
                  />
                </label>
                <label className="text-sm">Email
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    value={signupData.email}
                    onChange={handleSignupChange} 
                    className="mt-1 p-2 border rounded w-full" 
                  />
                </label>
                <label className="text-sm">Password
                  <input 
                    name="password" 
                    type="password" 
                    required 
                    value={signupData.password}
                    onChange={handleSignupChange} 
                    className="mt-1 p-2 border rounded w-full" 
                  />
                </label>
                <label className="text-sm">Confirm Password
                  <input 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange} 
                    className="mt-1 p-2 border rounded w-full" 
                  />
                </label>

                <div className="flex items-center justify-end gap-3 mt-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setView("login")}
                  >
                    Back to Login
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-app-primary hover:opacity-90" 
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            /* Verification View */
            <>
              <header className="mb-4">
                <h3 className="text-lg font-semibold">Verify Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a verification code to <strong>{verificationEmail}</strong>
                </p>
              </header>

              <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
                <label className="flex flex-col text-sm">
                  Verification Code (6 digits)
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                    }}
                    className="mt-1 p-2 border rounded text-center text-xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </label>

                <Button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-app-primary underline font-semibold"
                  >
                    Resend Code
                  </button>
                </div>

                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setView("login")}
                >
                  Back to Login
                </Button>
              </form>
            </>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModal;