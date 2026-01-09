import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, DollarSign, FileText, Camera, Upload, X, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../apiCalls/axios';
import { useAuth } from '../../context/AuthContext';

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'ETH', 'USDC', 'DAI', 'MATIC'];

// Photo Preview Modal
const PhotoModal = ({ isOpen, onClose, photoUrl, fileName }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Profile Photo Preview</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
          </div>
          {photoUrl ? (
            <>
              <img
                src={photoUrl}
                alt="Profile Preview"
                className="w-full h-auto rounded-lg object-cover mb-4 max-h-96 border border-gray-700"
              />
              <p className="text-xs text-gray-400 text-center">{fileName}</p>
            </>
          ) : (
            <p className="text-red-400">No Photo Uploaded</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// KYC Review Modal
const KycModal = ({ isOpen, onClose, kycDocs }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">KYC Documents Review</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(kycDocs).map(([key, file]) => {
              const titles = {
                adharCard: 'Aadhaar Card / ID Proof',
                skillCert: 'Skill Certificate',
                educationCert: 'Highest Education Certificate'
              };
              
              return (
                <div key={key} className="p-4 border border-gray-700 rounded-lg bg-gray-900">
                  <p className="font-medium text-green-400 mb-2">{titles[key]}</p>
                  {file ? (
                    <div className="flex items-center space-x-4">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={titles[key]} 
                          className="w-16 h-16 object-cover rounded-md border border-gray-600" 
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-md text-gray-300 text-xs font-mono">
                          PDF
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-mono text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-400">No Document Uploaded</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 transition duration-150"
          >
            Close Review
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProviderSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    expertise: '',
    hourlyRate: '',
    currency: 'USD',
    walletAddress: '',
    profilePhoto: null,
    photoPreviewUrl: null,
    kyc: {
      adharCard: null,
      skillCert: null,
      educationCert: null,
    },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.photoPreviewUrl) {
        URL.revokeObjectURL(formData.photoPreviewUrl);
      }
      const photoUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
        photoPreviewUrl: photoUrl,
      }));
    }
  };

  const handleKycUpload = (docKey, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        kyc: {
          ...prev.kyc,
          [docKey]: file,
        },
      }));
    }
  };

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      toast.error('MetaMask is not installed! Please install MetaMask extension.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setConnectingWallet(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setFormData((prev) => ({ ...prev, walletAddress: address }));
        toast.success(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length > 0) {
            setFormData((prev) => ({ ...prev, walletAddress: newAccounts[0] }));
            toast.info('Wallet account changed');
          } else {
            setFormData((prev) => ({ ...prev, walletAddress: '' }));
            toast.warning('Wallet disconnected');
          }
        });
      } else {
        toast.error('No accounts found. Please unlock MetaMask.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      
      if (error.code === 4001) {
        // User rejected the request
        toast.error('Connection request rejected. Please approve in MetaMask.');
      } else if (error.code === -32002) {
        // Request already pending
        toast.warning('Connection request already pending. Please check MetaMask.');
      } else {
        toast.error(`Failed to connect: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setConnectingWallet(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.expertise.trim()) newErrors.expertise = 'At least one skill is required';
    if (!formData.hourlyRate || isNaN(formData.hourlyRate) || parseFloat(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Valid hourly rate is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const expertiseArray = formData.expertise.split(',').map(skill => skill.trim()).filter(skill => skill);

      const response = await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'provider',
        bio: formData.bio,
        expertise: expertiseArray,
        hourlyRate: parseFloat(formData.hourlyRate),
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        const success = login(user, { accessToken, refreshToken });

        if (success) {
          // Convert files to base64 BEFORE navigating
          const convertFile = (file) => {
            return new Promise((resolve) => {
              if (!file) {
                resolve(null);
                return;
              }
              const reader = new FileReader();
              reader.onload = () => resolve({
                data: reader.result,
                name: file.name,
                type: file.type
              });
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(file);
            });
          };

          // Convert all files and WAIT
          Promise.all([
            convertFile(formData.profilePhoto),
            convertFile(formData.kyc.adharCard),
            convertFile(formData.kyc.skillCert),
            convertFile(formData.kyc.educationCert)
          ]).then(([photo, aadhaar, skill, education]) => {
            
            // Save to localStorage
            const profileData = {
              profilePhoto: photo,
              walletAddress: formData.walletAddress,
              currency: formData.currency,
              kycDocs: {
                aadhaar: aadhaar,
                skillCert: skill,
                education: education
              }
            };
            
            const key = `provider_profile_${user._id}`;
            localStorage.setItem(key, JSON.stringify(profileData));
            
            console.log('✅ SAVED:', key);
            console.log('Photo:', photo?.name || 'None');
            console.log('Aadhaar:', aadhaar?.name || 'None');
            console.log('Skill:', skill?.name || 'None');
            console.log('Education:', education?.name || 'None');
            
            // NOW navigate
            toast.success('Account created with files!');
            setTimeout(() => navigate('/provider/dashboard'), 500);
            
          }).catch(error => {
            console.error('File error:', error);
            toast.success('Account created!');
            navigate('/provider/dashboard');
          });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative overflow-hidden">
      {/* Modals */}
      <PhotoModal 
        isOpen={showPhotoModal} 
        onClose={() => setShowPhotoModal(false)} 
        photoUrl={formData.photoPreviewUrl}
        fileName={formData.profilePhoto?.name}
      />
      <KycModal 
        isOpen={showKycModal} 
        onClose={() => setShowKycModal(false)} 
        kycDocs={formData.kyc}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 relative z-10 border border-gray-700"
      >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">
            PROVIDER SIGNUP
          </h1>
          <p className="text-sm text-gray-400">
            Create your provider account
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Row */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                <User className="inline w-4 h-4 mr-1 text-green-400" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                <Mail className="inline w-4 h-4 mr-1 text-green-400" />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
          </motion.div>

          {/* Password Row */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                <Lock className="inline w-4 h-4 mr-1 text-green-400" />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                <Lock className="inline w-4 h-4 mr-1 text-green-400" />
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>
          </motion.div>

          {/* Wallet Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4 border-t border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Wallet className="inline w-4 h-4 mr-1 text-green-400" />
              Wallet Connect (MetaMask)
            </label>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={connectWallet}
                disabled={!!formData.walletAddress || connectingWallet}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition duration-300 ${
                  formData.walletAddress
                    ? 'bg-green-700 text-white border-green-500 cursor-default'
                    : 'bg-green-600 text-white hover:bg-green-700 border-green-600'
                } ${connectingWallet ? 'opacity-70 cursor-wait' : ''}`}
              >
                {connectingWallet && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <Wallet size={16} />
                <span>{formData.walletAddress ? 'Wallet Connected' : 'Connect Wallet'}</span>
              </motion.button>
              {formData.walletAddress ? (
                <div className="flex flex-col">
                  <span className="text-xs text-green-400 font-mono">
                    {`${formData.walletAddress.slice(0, 6)}...${formData.walletAddress.slice(-4)}`}
                  </span>
                  <span className="text-xs text-gray-500">Connected</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Connect your MetaMask wallet for payments</span>
              )}
            </div>
          </motion.div>

          {/* Profile Photo Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-4 border-t border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Camera className="inline w-4 h-4 mr-1 text-green-400" />
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <label htmlFor="photo-upload" className="cursor-pointer group">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-600 group-hover:border-green-500 transition duration-300"
                >
                  {formData.photoPreviewUrl ? (
                    <img src={formData.photoPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-green-400 transition" />
                  )}
                </motion.div>
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only"/>
              </label>
              <div className="flex flex-col">
                <p className="text-sm text-gray-400">
                  {formData.profilePhoto ? 'Photo uploaded!' : 'Upload your profile picture'}
                </p>
                {formData.profilePhoto && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowPhotoModal(true)}
                    className="mt-1 text-green-400 hover:text-green-300 text-sm font-medium transition"
                  >
                    View Photo
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              <FileText className="inline w-4 h-4 mr-1 text-green-400" />
              Bio / About
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              required
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and what you teach..."
              className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                errors.bio ? 'border-red-500' : 'border-gray-600'
              } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150`}
            />
            {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio}</p>}
          </motion.div>

          {/* Expertise and Hourly Rate */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-300">
                Skills (comma-separated)
              </label>
              <input
                id="expertise"
                name="expertise"
                type="text"
                required
                value={formData.expertise}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python"
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  errors.expertise ? 'border-red-500' : 'border-gray-600'
                } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150`}
              />
              {errors.expertise && <p className="mt-1 text-xs text-red-400">{errors.expertise}</p>}
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-300">
                <DollarSign className="inline w-4 h-4 mr-1 text-green-400" />
                Hourly Rate
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="50.00"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.hourlyRate ? 'border-red-500' : 'border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-500 bg-gray-900 text-white 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150`}
                />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="appearance-none block w-1/3 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-900 text-white font-medium 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150"
                >
                  {CURRENCY_OPTIONS.map((curr) => (
                    <option key={curr} value={curr} className="bg-gray-800 text-white">{curr}</option>
                  ))}
                </select>
              </div>
              {errors.hourlyRate && <p className="mt-1 text-xs text-red-400">{errors.hourlyRate}</p>}
            </div>
          </motion.div>

          {/* KYC Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-4 border-t border-gray-700 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-300">KYC Verification (Optional)</h2>
            <div className="p-5 bg-gray-900 border border-gray-700 rounded-xl space-y-4">
              <p className="text-sm text-green-400 font-medium mb-4">
                Upload documents to build trust and verify expertise
              </p>

              {/* Aadhaar Card */}
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-750 transition duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-100 mb-1">Aadhaar Card / ID Proof</p>
                    <p className="text-xs text-gray-400">
                      {formData.kyc.adharCard ? formData.kyc.adharCard.name : 'No document uploaded'}
                    </p>
                  </div>
                  <label htmlFor="adharCard" className="cursor-pointer">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
                    >
                      Upload
                    </motion.div>
                    <input
                      id="adharCard"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleKycUpload('adharCard', e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Skill Certificate */}
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-750 transition duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-100 mb-1">Skill Certificate</p>
                    <p className="text-xs text-gray-400">
                      {formData.kyc.skillCert ? formData.kyc.skillCert.name : 'No document uploaded'}
                    </p>
                  </div>
                  <label htmlFor="skillCert" className="cursor-pointer">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
                    >
                      Upload
                    </motion.div>
                    <input
                      id="skillCert"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleKycUpload('skillCert', e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Education Certificate */}
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-750 transition duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-100 mb-1">Highest Education Certificate</p>
                    <p className="text-xs text-gray-400">
                      {formData.kyc.educationCert ? formData.kyc.educationCert.name : 'No document uploaded'}
                    </p>
                  </div>
                  <label htmlFor="educationCert" className="cursor-pointer">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
                    >
                      Upload
                    </motion.div>
                    <input
                      id="educationCert"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleKycUpload('educationCert', e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Review Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowKycModal(true)}
                className="w-full mt-4 py-2 px-4 border border-green-500 rounded-lg shadow-sm text-sm font-medium text-green-400 bg-gray-800 hover:bg-gray-700 transition duration-150"
              >
                Review All Uploads
              </motion.button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-bold text-white 
              bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
              transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Provider Account'}
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm"
        >
          <span className="text-gray-400">Already have an account? </span>
          <Link
            to="/provider/login"
            className="font-medium text-green-400 hover:text-green-300 transition"
          >
            Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProviderSignup;
