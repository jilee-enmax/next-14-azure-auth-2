"use client";

import React, { useState, FormEvent } from "react";

export function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    account_no: "",
    phone_number: "",
    site_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);
  
    const body = {
      username: formData.username,
      password: formData.password,
      account_no: formData.account_no,
      phone_number: formData.phone_number, // Optional
      site_id: formData.site_id, // Optional
    };
  
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const { message } = await response.json();
        setError(message || 'Registration failed.');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  if (success) {
    return (
      <div className="text-green-500">
        Registration successful! Please check your email for activation instructions.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 bg-gray-800 p-6 rounded-md shadow-lg">
      <form className="flex flex-col items-center space-y-4 w-full max-w-md" onSubmit={handleSubmit}>
        <div className="w-full">
          <label htmlFor="username" className="block text-white font-medium mb-2">
            Username
          </label>
          <input
            type="email"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="block text-white font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Re-enter your password"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="account_no" className="block text-white font-medium mb-2">
            Account Number
          </label>
          <input
            type="text"
            id="account_no"
            name="account_no"
            value={formData.account_no}
            onChange={(e) => handleChange("account_no", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Enter your account number"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="site_id" className="block text-white font-medium mb-2">
            Site ID
          </label>
          <input
            type="text"
            id="site_id"
            name="site_id"
            value={formData.site_id}
            onChange={(e) => handleChange("site_id", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Enter your Site ID"
          />
        </div>
        <div className="w-full">
          <label htmlFor="phone_number" className="block text-white font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 mt-4 rounded bg-green-500 hover:bg-green-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? "Submitting..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
    </div>
  );
}
