import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../apiCalls/axios';
import { useAuth } from '../../context/AuthContext';

const ProviderLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Check if user is a provider
        if (user.role !== 'provider') {
          toast.error('This login is for providers only. Please use the correct login page.');
          setLoading(false);
          return;
        }

        // Use AuthContext login
        const success = login(user, { accessToken, refreshToken });

        if (success) {
          toast.success('Login successful! Redirecting to dashboard...');
          
          // Redirect to provider dashboard
          setTimeout(() => {
            navigate('/provider/dashboard');
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 blur-3xl opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 relative z-10"
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        whileHover={{ scale: 1.02, boxShadow: "0px 12px 40px rgba(0,0,0,0.25)" }}
      >
        <div className="text-center">
          <motion.h1
            className="text-3xl font-extrabold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            PROVIDER LOGIN
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-gray-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Sign in to your account
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              <Mail className="inline w-4 h-4 mr-1" />
              Email
            </label>
            <div className="mt-1">
              <motion.input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                whileFocus={{ scale: 1.02, boxShadow: "0px 0px 12px rgba(79,70,229,0.4)" }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              <Lock className="inline w-4 h-4 mr-1" />
              Password
            </label>
            <div className="mt-1">
              <motion.input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                whileFocus={{ scale: 1.02, boxShadow: "0px 0px 12px rgba(79,70,229,0.4)" }}
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white 
              bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
              transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </motion.div>
        </motion.form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Need help?</span>
          </div>
        </div>

        <motion.div
          className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-y-0 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center sm:text-left">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot Password?
            </a>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/provider/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProviderLogin;
