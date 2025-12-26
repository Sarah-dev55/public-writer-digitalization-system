/*import React, { useState } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";

export const SignUpModal = ({ isOpen, onClose, onSwitchToLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: ""
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSignupSuccess(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-10">
      <Card className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          <header className="mb-4">
            <h3 className="text-xl font-bold">Create New Account</h3>
            <p className="text-sm text-gray-500">Join us by filling out the form below.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <input name="firstName" placeholder="First Name" required onChange={handleChange} className="p-2 border rounded text-sm" />
              <input name="lastName" placeholder="Last Name" required onChange={handleChange} className="p-2 border rounded text-sm" />
            </div>
            <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} className="p-2 border rounded text-sm" />
            <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="p-2 border rounded text-sm" />
            <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="p-2 border rounded text-sm" />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="p-2 border rounded text-sm" />

            <div className="flex items-center justify-end gap-3 mt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-green-600">Sign Up</Button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? 
            <button onClick={onSwitchToLogin} className="text-app-primary font-bold ml-1 underline">Sign In</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};