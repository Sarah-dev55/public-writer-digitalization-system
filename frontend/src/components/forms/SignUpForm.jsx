import React, { useState } from 'react';

export default function SignUpForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      
      {/* Name Row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input 
            name="firstName"
            value={formData.firstName} 
            onChange={handleChange} 
            className="mt-1 block w-full rounded border-gray-300 border p-2" 
            required 
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input 
            name="lastName"
            value={formData.lastName} 
            onChange={handleChange} 
            className="mt-1 block w-full rounded border-gray-300 border p-2" 
            required 
          />
        </div>
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input 
          type="tel"
          name="phone"
          value={formData.phone} 
          onChange={handleChange} 
          className="mt-1 block w-full rounded border-gray-300 border p-2" 
          required 
        />
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email"
          name="email"
          value={formData.email} 
          onChange={handleChange} 
          className="mt-1 block w-full rounded border-gray-300 border p-2" 
          required 
        />
      </div>

      {/* Password Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          name="password"
          value={formData.password} 
          onChange={handleChange} 
          className="mt-1 block w-full rounded border-gray-300 border p-2" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input 
          type="password" 
          name="confirmPassword"
          value={formData.confirmPassword} 
          onChange={handleChange} 
          className="mt-1 block w-full rounded border-gray-300 border p-2" 
          required 
        />
      </div>

      <div>
        <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors">
          Sign Up
        </button>
      </div>
    </form>
  );
}