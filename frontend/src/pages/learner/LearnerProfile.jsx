import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Wallet, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LearnerProfile = () => {
  const { user } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [walletLinked, setWalletLinked] = useState(false);
  const [profileName, setProfileName] = useState("Learner Profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(" ") : [""];
      const first = nameParts[0] || "";
      const last = nameParts.slice(1).join(" ") || "";

      setFirstName(first);
      setLastName(last);
      setEmail(user.email || "");
      if (first) setProfileName(`${first}'s Profile`);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFirstNameChange = (e) => {
    const val = e.target.value;
    setFirstName(val);
    setProfileName(val ? `${val}'s Profile` : "Learner Profile");
  };

  const connectWallet = () => {
    setWalletLinked(true);
  };

  const inputClass =
    "w-full px-4 py- border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200";

  return (
    <div className="w-full min-h-full bg-stone-50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full p-4 sm:p-6 lg:p-8"
      >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              {profileName}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={photo || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-sky-400 shadow-lg"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-sky-500 rounded-full text-white cursor-pointer shadow-md hover:scale-110 transition">
                <Upload className="w-5 h-5" />
                <input type="file" hidden onChange={handlePhotoChange} />
              </label>
            </div>
            <span className="text-gray-500 text-sm">
              Upload a professional photo
            </span>
          </div>

          {/* Form */}
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-gray-800">
            {/* Personal Info */}
            <div className="md:col-span-2 p-5 sm:p-6 border border-blue-200 rounded-lg bg-blue-50/80 space-y-5">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="First Name" value={firstName} onChange={handleFirstNameChange} className={inputClass} />
                <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                <input value={email} disabled className={inputClass} />
                <input placeholder="Phone Number" className={inputClass} />
                <input placeholder="Alternate Number" className={inputClass} />
                <input type="date" className={inputClass} />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2 p-5 sm:p-6 border border-blue-200 rounded-lg bg-blue-50/80 space-y-5">
              <h3 className="text-xl font-semibold">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="House No / Street" className={inputClass} />
                <input placeholder="Locality" className={inputClass} />
                <input placeholder="City" className={inputClass} />
                <input placeholder="State" className={inputClass} />
                <input placeholder="Pincode" className={inputClass} />
                <input placeholder="Landmark (optional)" className={inputClass} />
              </div>
            </div>

            {/* Skills */}
            <div className="md:col-span-2 p-5 sm:p-6 border border-blue-200 rounded-lg bg-blue-50/80 space-y-5">
              <h3 className="text-xl font-semibold">Skills & Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Skills (e.g., Python, React)" className={`${inputClass} md:col-span-2`} />
                <select className={inputClass}>
                  <option>Select Language</option>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </form>

          {/* Wallet */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center p-4 bg-blue-100 rounded-lg border border-blue-300">
            <div>
              <p className="font-semibold text-blue-800">Connect your Web3 Wallet</p>
              <p className="text-sm text-blue-600">Secure your certificates on the blockchain.</p>
            </div>

            {walletLinked ? (
              <span className="flex items-center gap-2 text-green-600 font-medium mt-4 sm:mt-0">
                <CheckCircle className="w-5 h-5" /> Wallet Linked
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="mt-4 sm:mt-0 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full transition shadow-md"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-full shadow-lg"
          >
            Save & Review Profile
          </motion.button>
      </motion.div>
    </div>
  );
};

export default LearnerProfile;
