import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, Languages, Briefcase,
  Award, FileText, Image as ImageIcon, Upload, CheckCircle, AlertCircle
} from "lucide-react";
import { providerProfileAPI } from "../../services/api";

const ProviderRegistrationForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    dateOfBirth: "",
    languages: [],
    services: [],
    certifications: [],
    bio: "",
    documents: {
      identityProof: { type: "", fileUrl: "" },
      addressProof: { type: "", fileUrl: "" },
      professionalCertificates: [],
    },
    photos: {
      profilePhoto: "",
      additionalPhotos: [],
    },
  });

  const [languageInput, setLanguageInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()],
      });
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l !== lang),
    });
  };

  const addService = () => {
    if (serviceInput.trim() && !formData.services.includes(serviceInput.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, serviceInput.trim()],
      });
      setServiceInput("");
    }
  };

  const removeService = (service) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { name: "", issuingOrganization: "", issueDate: "", certificateUrl: "" },
      ],
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...formData.certifications];
    updated[index][field] = value;
    setFormData({ ...formData, certifications: updated });
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!/^[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    }

    if (currentStep === 2) {
      if (!formData.address.street.trim()) newErrors["address.street"] = "Street is required";
      if (!formData.address.city.trim()) newErrors["address.city"] = "City is required";
      if (!formData.address.state.trim()) newErrors["address.state"] = "State is required";
      if (!formData.address.country.trim()) newErrors["address.country"] = "Country is required";
      if (!formData.address.zipCode.trim()) newErrors["address.zipCode"] = "Zip code is required";
    }

    if (currentStep === 3) {
      if (formData.languages.length === 0) newErrors.languages = "At least one language is required";
      if (formData.services.length === 0) newErrors.services = "At least one service is required";
      if (!formData.bio.trim()) newErrors.bio = "Bio is required";
      if (formData.bio.length < 50) newErrors.bio = "Bio must be at least 50 characters";
    }

    if (currentStep === 4) {
      if (!formData.photos.profilePhoto) newErrors.profilePhoto = "Profile photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      await providerProfileAPI.submitProfile(formData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 2:
        return <AddressStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 3:
        return (
          <ProfessionalInfoStep
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            languageInput={languageInput}
            setLanguageInput={setLanguageInput}
            addLanguage={addLanguage}
            removeLanguage={removeLanguage}
            serviceInput={serviceInput}
            setServiceInput={setServiceInput}
            addService={addService}
            removeService={removeService}
            addCertification={addCertification}
            updateCertification={updateCertification}
            removeCertification={removeCertification}
          />
        );
      case 4:
        return <DocumentsStep formData={formData} setFormData={setFormData} errors={errors} />;
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Provider Registration</h2>
        <p className="text-gray-600 mb-6">Complete your profile to become a verified provider</p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Personal", "Address", "Professional", "Documents", "Review"].map((label, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step > idx + 1
                      ? "bg-green-500 text-white"
                      : step === idx + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > idx + 1 ? <CheckCircle size={20} /> : idx + 1}
                </div>
                <span className="text-xs mt-1 text-gray-600">{label}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Previous
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step Components
const PersonalInfoStep = ({ formData, handleChange, errors }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <User size={24} />
      Personal Information
    </h3>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
          errors.fullName ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
          errors.email ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="10-15 digits"
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
          errors.phone ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
          errors.dateOfBirth ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
    </div>
  </div>
);

const AddressStep = ({ formData, handleChange, errors }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <MapPin size={24} />
      Address Information
    </h3>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
      <input
        type="text"
        name="address.street"
        value={formData.address.street}
        onChange={handleChange}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
          errors["address.street"] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors["address.street"] && <p className="text-red-500 text-sm mt-1">{errors["address.street"]}</p>}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
        <input
          type="text"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors["address.city"] ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors["address.city"] && <p className="text-red-500 text-sm mt-1">{errors["address.city"]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
        <input
          type="text"
          name="address.state"
          value={formData.address.state}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors["address.state"] ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors["address.state"] && <p className="text-red-500 text-sm mt-1">{errors["address.state"]}</p>}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
        <input
          type="text"
          name="address.country"
          value={formData.address.country}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors["address.country"] ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors["address.country"] && <p className="text-red-500 text-sm mt-1">{errors["address.country"]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
        <input
          type="text"
          name="address.zipCode"
          value={formData.address.zipCode}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors["address.zipCode"] ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors["address.zipCode"] && <p className="text-red-500 text-sm mt-1">{errors["address.zipCode"]}</p>}
      </div>
    </div>
  </div>
);

const ProfessionalInfoStep = ({
  formData,
  handleChange,
  errors,
  languageInput,
  setLanguageInput,
  addLanguage,
  removeLanguage,
  serviceInput,
  setServiceInput,
  addService,
  removeService,
  addCertification,
  updateCertification,
  removeCertification,
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Briefcase size={24} />
      Professional Information
    </h3>

    {/* Languages */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Languages *</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={languageInput}
          onChange={(e) => setLanguageInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
          placeholder="Add a language"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={addLanguage}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.languages.map((lang, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
          >
            {lang}
            <button onClick={() => removeLanguage(lang)} className="text-indigo-900 hover:text-red-600">
              ×
            </button>
          </span>
        ))}
      </div>
      {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
    </div>

    {/* Services */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Services *</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
          placeholder="Add a service"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={addService}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.services.map((service, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2"
          >
            {service}
            <button onClick={() => removeService(service)} className="text-green-900 hover:text-red-600">
              ×
            </button>
          </span>
        ))}
      </div>
      {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
    </div>

    {/* Bio */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bio * (50-1000 characters)
      </label>
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        rows={5}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
          errors.bio ? "border-red-500" : "border-gray-300"
        }`}
      />
      <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/1000 characters</p>
      {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
    </div>

    {/* Certifications */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (Optional)</label>
      {formData.certifications.map((cert, idx) => (
        <div key={idx} className="p-4 border border-gray-300 rounded-lg mb-3 space-y-2">
          <input
            type="text"
            placeholder="Certification Name"
            value={cert.name}
            onChange={(e) => updateCertification(idx, "name", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Issuing Organization"
            value={cert.issuingOrganization}
            onChange={(e) => updateCertification(idx, "issuingOrganization", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            placeholder="Issue Date"
            value={cert.issueDate}
            onChange={(e) => updateCertification(idx, "issueDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={() => removeCertification(idx)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCertification}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        + Add Certification
      </button>
    </div>
  </div>
);

const DocumentsStep = ({ formData, setFormData, errors }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <FileText size={24} />
      Documents & Photos
    </h3>

    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
      <p className="text-sm text-blue-800">
        <strong>Note:</strong> For this demo, please provide image URLs. In production, file upload functionality would be implemented.
      </p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL *</label>
      <input
        type="url"
        value={formData.photos.profilePhoto}
        onChange={(e) =>
          setFormData({
            ...formData,
            photos: { ...formData.photos, profilePhoto: e.target.value },
          })
        }
        placeholder="https://example.com/photo.jpg"
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
          errors.profilePhoto ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Identity Proof Type</label>
      <select
        value={formData.documents.identityProof.type}
        onChange={(e) =>
          setFormData({
            ...formData,
            documents: {
              ...formData.documents,
              identityProof: { ...formData.documents.identityProof, type: e.target.value },
            },
          })
        }
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Type</option>
        <option value="passport">Passport</option>
        <option value="drivingLicense">Driving License</option>
        <option value="nationalId">National ID</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Identity Proof URL</label>
      <input
        type="url"
        value={formData.documents.identityProof.fileUrl}
        onChange={(e) =>
          setFormData({
            ...formData,
            documents: {
              ...formData.documents,
              identityProof: { ...formData.documents.identityProof, fileUrl: e.target.value },
            },
          })
        }
        placeholder="https://example.com/id-proof.jpg"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
);

const ReviewStep = ({ formData }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <CheckCircle size={24} />
      Review Your Information
    </h3>

    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Personal Information</h4>
        <p><strong>Name:</strong> {formData.fullName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>DOB:</strong> {formData.dateOfBirth}</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Address</h4>
        <p>
          {formData.address.street}, {formData.address.city}, {formData.address.state},{" "}
          {formData.address.country} - {formData.address.zipCode}
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Professional Information</h4>
        <p><strong>Languages:</strong> {formData.languages.join(", ")}</p>
        <p><strong>Services:</strong> {formData.services.join(", ")}</p>
        <p><strong>Bio:</strong> {formData.bio}</p>
      </div>

      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
        <p className="text-sm text-green-800">
          <strong>Ready to submit?</strong> Your profile will be reviewed by our admin team. You'll be notified once the review is complete.
        </p>
      </div>
    </div>
  </div>
);

export default ProviderRegistrationForm;
