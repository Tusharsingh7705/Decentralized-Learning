/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import api from "../../apiCalls/axios";

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    // If already logged in as admin, redirect to dashboard
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      // Register the admin user
      const response = await api.post('/api/auth/register', {
        ...dataToSend,
        role: 'admin'
      });

      const { user: userData, accessToken, refreshToken } = response.data.data;

      // Verify the user is admin
      if (userData.role !== 'admin') {
        setError('Failed to create admin account. Please contact support.');
        setLoading(false);
        return;
      }

      setSuccess('Admin account created successfully!');

      // Store authentication data
      login(userData, { accessToken, refreshToken });

      // Redirect to admin dashboard
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.data?.message?.includes('email')) {
        setError('Email already exists. Redirecting to login...');
        setTimeout(() => navigate('/admin/login'), 1500);
      } else {
        setError(err.response?.data?.message || 'Signup failed. Please check the input values.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-100 flex flex-col items-center pt-16 pb-16 px-4 font-sans">
      <div className="bg-[#aad9d9] p-6 sm:p-8 rounded-2xl w-full max-w-lg border border-gray-300 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#010922] mb-6">
          Admin Signup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#010922]">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 text-[#010922] placeholder-gray-700 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010922] transition-all duration-200 hover:shadow-md hover:border-[#7aafa8]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#010922]">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 text-[#010922] placeholder-gray-700 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010922] transition-all duration-200 hover:shadow-md hover:border-[#7aafa8]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#010922]">Phone</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              required
              className="w-full px-4 py-3 text-[#010922] placeholder-gray-700 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010922] transition-all duration-200 hover:shadow-md hover:border-[#7aafa8]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#010922]">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a Password"
              required
              className="w-full px-4 py-3 text-[#010922] placeholder-gray-700 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010922] transition-all duration-200 hover:shadow-md hover:border-[#7aafa8]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#010922]">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Your Password"
              required
              className="w-full px-4 py-3 text-[#010922] placeholder-gray-700 bg-[#F3F4F6] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010922] transition-all duration-200 hover:shadow-md hover:border-[#7aafa8]"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#010922] hover:bg-[#1A1F2E] text-white rounded-xl font-semibold transition-all duration-200 text-lg tracking-wide disabled:bg-gray-400"
          >
            {loading ? 'Creating Admin...' : 'Create Admin'}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-[#010922]">
          Already have an account?{' '}
          <Link to="/admin/login" className="text-[#010922] hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
