import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Upload,
  Wallet,
  DollarSign,
  Eye,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProviderProfile = () => {
  const { user } = useAuth();
  // --- States for Editable Fields ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [providerSkills, setProviderSkills] = useState("");
  const [providerName, setProviderName] = useState("Provider Profile"); // Dynamic Header State
  // -------------------------------------

  // Existing States
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aadhaar, setAadhaar] = useState(null);
  const [skillCert, setSkillCert] = useState(null);
  const [educationCert, setEducationCert] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  // Store full file data for preview
  const [kycFilesData, setKycFilesData] = useState({
    adharCard: null,
    skillCert: null,
    educationCert: null
  });
  const [hourlyRate, setHourlyRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [walletAddress, setWalletAddress] = useState("");

  // Load user data from AuthContext when component mounts
  useEffect(() => {
    if (user) {
      // Split name into first and last name
      const nameParts = user.name ? user.name.split(' ') : [''];
      const first = nameParts[0] || '';
      const last = nameParts.slice(1).join(' ') || '';
      
      setFirstName(first);
      setLastName(last);
      setEmail(user.email || '');
      setBio(user.bio || '');
      
      // Set skills - join array if it's an array, otherwise use as string
      if (user.expertise) {
        const skillsString = Array.isArray(user.expertise) 
          ? user.expertise.join(', ') 
          : user.expertise;
        setProviderSkills(skillsString);
      }
      
      // Set hourly rate if available
      if (user.hourlyRate) {
        setHourlyRate(user.hourlyRate.toString());
      }
      
      // Load profile photo and KYC documents from localStorage
      const storageKey = `provider_profile_${user._id}`;
      const storedProfileData = localStorage.getItem(storageKey);
      
      console.log('=== LOADING PROFILE DATA ===');
      console.log('User ID:', user._id);
      
      if (storedProfileData) {
        try {
          const data = JSON.parse(storedProfileData);
          
          // Profile Photo
          if (data.profilePhoto?.data) {
            setProfilePhoto(data.profilePhoto.data);
            console.log('✓ Photo loaded:', data.profilePhoto.name);
          }
          
          // Wallet & Currency
          if (data.walletAddress) setWalletAddress(data.walletAddress);
          if (data.currency) setCurrency(data.currency);
          
          // KYC Documents
          if (data.kycDocs) {
            if (data.kycDocs.aadhaar) {
              setAadhaar(data.kycDocs.aadhaar.name);
              console.log('✓ Aadhaar:', data.kycDocs.aadhaar.name);
            }
            if (data.kycDocs.skillCert) {
              setSkillCert(data.kycDocs.skillCert.name);
              console.log('✓ Skill Cert:', data.kycDocs.skillCert.name);
            }
            if (data.kycDocs.education) {
              setEducationCert(data.kycDocs.education.name);
              console.log('✓ Education:', data.kycDocs.education.name);
            }
            
            setKycFilesData({
              adharCard: data.kycDocs.aadhaar,
              skillCert: data.kycDocs.skillCert,
              educationCert: data.kycDocs.education
            });
          }
          
          console.log('✓ Data loaded successfully');
        } catch (error) {
          console.error('Error loading data:', error);
        }
      } else {
        console.log('⚠️ No profile data - Sign up again');
      }
      
      // Update profile name
      if (first) {
        setProviderName(`${first}'s Profile`);
      }
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]?.name || null);
  };

  // Handler for dynamic profile name and First Name state update
  const handleFirstNameChange = (e) => {
    const newName = e.target.value;
    setFirstName(newName);
    if (newName) {
      setProviderName(`${newName}'s Profile`);
    } else {
      setProviderName("Provider Profile");
    }
  };


  // Common Tailwind class for inputs and selects in the new light theme
  const inputClass = "p-3 w-full border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-500 transition shadow-sm";

  return (
    // BACKGROUND CONTAINER: Removed 'justify-center' so content aligns to the left (next to a sidebar).
    <div className="min-h-screen bg-stone-50 py-12 px-4 flex text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // MAIN CARD: Removed 'max-w-2xl' constraint to allow it to fill the entire available width (w-full).
        className="w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {providerName} 
        </h2>


        {/* Profile Photo Upload */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          // Light Sky Blue Accent Section
          className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/80"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profilePhoto || "https://via.placeholder.com/80/e5e7eb/4b5563?text=AVATAR"}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-sky-400 shadow-md"
                onError={(e) => {
                  console.error('❌ Image failed to load');
                  console.error('Image src:', e.target.src.substring(0, 50));
                }}
                onLoad={() => console.log('✓ Image loaded successfully')}
              />
              {/* Debug info - remove after fixing */}
              <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                {profilePhoto ? '✓ Has photo' : '✗ No photo'}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-1">
                Profile Photo
              </label>
              <input 
                type="file" 
                onChange={handlePhotoChange} 
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-600"
              />
            </div>
            {profilePhoto && (
              <button
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition shadow-md"
              >
                <Eye size={18} /> Preview
              </button>
            )}
          </div>
        </motion.div>
        
        {/* New: Personal Information (Editable) */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/80"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstNameChange} // Updates state and dynamic header
              className={inputClass}
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
            {/* Password input spans two columns */}
            <input 
              type="password" 
              placeholder="New Password (Optional)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} md:col-span-2`} 
            />
          </div>
        </motion.div>

        {/* New: Bio and Skills Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/80"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Bio & Expertise</h3>
          
          <textarea
            placeholder="Introduce yourself and your experience to potential clients (max 500 characters)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            className={`${inputClass} mb-4 resize-none`}
          />
          <input 
            type="text" 
            placeholder="Skills (e.g., React, Python, UI/UX) - Comma Separated" 
            value={providerSkills}
            onChange={(e) => setProviderSkills(e.target.value)}
            className={inputClass}
          />
        </motion.div>


        {/* Hourly Rate & Currency */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/80"
        >
          <label className="block text-gray-700 font-semibold mb-3">
            Service Rate
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="0.00"
              className={`${inputClass} w-3/5`}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${inputClass} w-2/5 appearance-none`}
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="INR">INR ₹</option>
              <option value="USDC">USDC (Token)</option>
            </select>
          </div>
        </motion.div>
        
        {/* KYC Upload Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/80"
        >
          <label className="block text-gray-800 font-semibold mb-4">
            KYC Verification Documents
          </label>
          <div className="space-y-4">
            {/* Aadhaar / ID Proof */}
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Aadhaar / ID Proof</span>
                {aadhaar && <CheckCircle size={18} className="text-green-600" />}
              </div>
              {aadhaar ? (
                <p className="text-xs text-green-600 mb-2">✓ Uploaded: {aadhaar}</p>
              ) : (
                <p className="text-xs text-gray-500 mb-2">No document uploaded</p>
              )}
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setAadhaar)}
                className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>
            
            {/* Skill Certificate */}
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Skill Certificate</span>
                {skillCert && <CheckCircle size={18} className="text-green-600" />}
              </div>
              {skillCert ? (
                <p className="text-xs text-green-600 mb-2">✓ Uploaded: {skillCert}</p>
              ) : (
                <p className="text-xs text-gray-500 mb-2">No document uploaded</p>
              )}
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setSkillCert)}
                className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>
            
            {/* Education Certificate */}
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Education Certificate</span>
                {educationCert && <CheckCircle size={18} className="text-green-600" />}
              </div>
              {educationCert ? (
                <p className="text-xs text-green-600 mb-2">✓ Uploaded: {educationCert}</p>
              ) : (
                <p className="text-xs text-gray-500 mb-2">No document uploaded</p>
              )}
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setEducationCert)}
                className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
              />
            </div>
            
          </div>
          {(aadhaar || skillCert || educationCert) && (
            <button
              onClick={() => setReviewOpen(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition shadow-md font-semibold"
            >
              <CheckCircle size={18} /> Review All Uploads
            </button>
          )}
        </motion.div>

        {/* Wallet Connection */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50/80"
        >
          <label className="block text-gray-700 font-semibold mb-2">
            Payment Wallet
          </label>
          {walletAddress ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle size={20} className="text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Wallet Connected</p>
                <p className="text-xs font-mono text-gray-600">
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </p>
              </div>
            </div>
          ) : (
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition shadow-md font-semibold"
              onClick={() => {/* Actual wallet connection logic */}}
            >
              <Wallet size={18} /> Connect MetaMask
            </button>
          )}
        </motion.div>

        {/* Main Save Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold shadow-xl transition-all"
        >
          Save All Changes
        </motion.button>


        {/* Profile Preview Modal */}
        {previewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Profile Photo Preview
              </h3>
              <img
                src={profilePhoto}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border border-gray-300 mx-auto"
              />
              <button
                onClick={() => setPreviewOpen(false)}
                className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* KYC Review Modal */}
        {reviewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Review KYC Documents
              </h3>
              <div className="space-y-6">
                {/* Aadhaar Card */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    Aadhaar Card / ID Proof
                  </h4>
                  {kycFilesData.adharCard ? (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">{kycFilesData.adharCard.name}</p>
                      {kycFilesData.adharCard.type.startsWith('image/') ? (
                        <img 
                          src={kycFilesData.adharCard.data} 
                          alt="Aadhaar Card" 
                          className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg">
                          <p className="text-gray-600 font-mono text-sm">PDF Document</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">No document uploaded</p>
                  )}
                </div>

                {/* Skill Certificate */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    Skill Certificate
                  </h4>
                  {kycFilesData.skillCert ? (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">{kycFilesData.skillCert.name}</p>
                      {kycFilesData.skillCert.type.startsWith('image/') ? (
                        <img 
                          src={kycFilesData.skillCert.data} 
                          alt="Skill Certificate" 
                          className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg">
                          <p className="text-gray-600 font-mono text-sm">PDF Document</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">No document uploaded</p>
                  )}
                </div>

                {/* Education Certificate */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    Highest Education Certificate
                  </h4>
                  {kycFilesData.educationCert ? (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">{kycFilesData.educationCert.name}</p>
                      {kycFilesData.educationCert.type.startsWith('image/') ? (
                        <img 
                          src={kycFilesData.educationCert.data} 
                          alt="Education Certificate" 
                          className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg">
                          <p className="text-gray-600 font-mono text-sm">PDF Document</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">No document uploaded</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setReviewOpen(false)}
                className="mt-6 w-full px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-semibold text-lg"
              >
                Close Review
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProviderProfile;
