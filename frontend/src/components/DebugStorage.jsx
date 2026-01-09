import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Debug component to view and manage localStorage data
 * Add this to your profile page temporarily to debug storage issues
 */
const DebugStorage = () => {
  const { user } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const [storageData, setStorageData] = useState(null);

  const loadStorageData = () => {
    if (user) {
      const key = `provider_profile_${user._id}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setStorageData({
            key,
            raw: data.substring(0, 200) + '...', // Show first 200 chars
            parsed: {
              hasProfilePhoto: !!parsed.profilePhoto,
              profilePhotoType: parsed.profilePhoto?.type,
              profilePhotoName: parsed.profilePhoto?.name,
              hasWallet: !!parsed.walletAddress,
              walletAddress: parsed.walletAddress,
              currency: parsed.currency,
              kycDocs: {
                adharCard: parsed.kycDocs?.adharCard?.name || 'Not uploaded',
                skillCert: parsed.kycDocs?.skillCert?.name || 'Not uploaded',
                educationCert: parsed.kycDocs?.educationCert?.name || 'Not uploaded',
              }
            }
          });
        } catch (error) {
          setStorageData({ error: error.message });
        }
      } else {
        setStorageData({ message: 'No profile data found in localStorage' });
      }
    }
  };

  const clearStorageData = () => {
    if (user && window.confirm('Clear profile storage data? You will need to upload files again.')) {
      const key = `provider_profile_${user._id}`;
      localStorage.removeItem(key);
      setStorageData(null);
      alert('Storage cleared! Please sign up again to store new files.');
    }
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => {
          setShowDebug(true);
          loadStorageData();
        }}
        className="fixed bottom-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 z-50"
      >
        🐛 Debug Storage
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border-2 border-purple-600 rounded-lg shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-purple-600">Storage Debug Panel</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="bg-gray-100 p-2 rounded">
          <strong>User ID:</strong> {user?._id || 'Not logged in'}
        </div>

        {storageData && (
          <>
            {storageData.error && (
              <div className="bg-red-100 text-red-700 p-2 rounded">
                <strong>Error:</strong> {storageData.error}
              </div>
            )}

            {storageData.message && (
              <div className="bg-yellow-100 text-yellow-700 p-2 rounded">
                {storageData.message}
              </div>
            )}

            {storageData.parsed && (
              <div className="space-y-2">
                <div className="bg-blue-100 p-2 rounded">
                  <strong>Profile Photo:</strong> {storageData.parsed.hasProfilePhoto ? '✓' : '✗'}
                  {storageData.parsed.hasProfilePhoto && (
                    <div className="text-xs mt-1">
                      <div>Name: {storageData.parsed.profilePhotoName}</div>
                      <div>Type: {storageData.parsed.profilePhotoType}</div>
                    </div>
                  )}
                </div>

                <div className="bg-green-100 p-2 rounded">
                  <strong>Wallet:</strong> {storageData.parsed.hasWallet ? '✓' : '✗'}
                  {storageData.parsed.hasWallet && (
                    <div className="text-xs mt-1 font-mono">
                      {storageData.parsed.walletAddress.substring(0, 10)}...
                    </div>
                  )}
                </div>

                <div className="bg-purple-100 p-2 rounded">
                  <strong>Currency:</strong> {storageData.parsed.currency}
                </div>

                <div className="bg-orange-100 p-2 rounded">
                  <strong>KYC Documents:</strong>
                  <div className="text-xs mt-1 space-y-1">
                    <div>Aadhaar: {storageData.parsed.kycDocs.adharCard}</div>
                    <div>Skill: {storageData.parsed.kycDocs.skillCert}</div>
                    <div>Education: {storageData.parsed.kycDocs.educationCert}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={loadStorageData}
          className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
        >
          Refresh
        </button>
        <button
          onClick={clearStorageData}
          className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
        >
          Clear Storage
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        💡 If files aren't showing, clear storage and sign up again
      </div>
    </div>
  );
};

export default DebugStorage;
