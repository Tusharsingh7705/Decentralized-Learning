// TEST SCRIPT - Run this in browser console to diagnose the issue
// Copy and paste this entire script

(function() {
  console.log('=== DIAGNOSTIC TEST ===');
  
  // Check if user is logged in
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.error('❌ No user logged in');
    return;
  }
  
  const user = JSON.parse(userStr);
  console.log('✓ User logged in:', user.email);
  console.log('✓ User ID:', user._id);
  
  // Check for profile data
  const profileKey = `provider_profile_${user._id}`;
  const profileDataStr = localStorage.getItem(profileKey);
  
  if (!profileDataStr) {
    console.error('❌ NO PROFILE DATA FOUND');
    console.log('Storage key checked:', profileKey);
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('\n💡 SOLUTION: You need to sign up again with the new code');
    return;
  }
  
  console.log('✓ Profile data exists');
  console.log('Data size:', (profileDataStr.length / 1024).toFixed(2), 'KB');
  
  try {
    const profileData = JSON.parse(profileDataStr);
    console.log('\n📋 Profile Data Structure:');
    console.log('Keys:', Object.keys(profileData));
    
    // Check profile photo
    console.log('\n📷 Profile Photo:');
    if (profileData.profilePhoto) {
      console.log('  ✓ Exists');
      console.log('  Name:', profileData.profilePhoto.name);
      console.log('  Type:', profileData.profilePhoto.type);
      console.log('  Has data:', !!profileData.profilePhoto.data);
      if (profileData.profilePhoto.data) {
        console.log('  Data starts with:', profileData.profilePhoto.data.substring(0, 30));
        console.log('  Data length:', profileData.profilePhoto.data.length);
      }
    } else {
      console.log('  ✗ No profile photo');
    }
    
    // Check KYC docs
    console.log('\n📄 KYC Documents:');
    if (profileData.kycDocs) {
      console.log('  ✓ KYC Docs object exists');
      console.log('  Keys:', Object.keys(profileData.kycDocs));
      
      if (profileData.kycDocs.aadhaar) {
        console.log('  ✓ Aadhaar:', profileData.kycDocs.aadhaar.name);
      } else {
        console.log('  ✗ No Aadhaar');
      }
      
      if (profileData.kycDocs.skillCert) {
        console.log('  ✓ Skill Cert:', profileData.kycDocs.skillCert.name);
      } else {
        console.log('  ✗ No Skill Cert');
      }
      
      if (profileData.kycDocs.education) {
        console.log('  ✓ Education:', profileData.kycDocs.education.name);
      } else {
        console.log('  ✗ No Education');
      }
    } else {
      console.log('  ✗ No KYC docs');
    }
    
    // Check wallet
    console.log('\n💰 Wallet:');
    if (profileData.walletAddress) {
      console.log('  ✓', profileData.walletAddress);
    } else {
      console.log('  ✗ Not connected');
    }
    
    console.log('\n=== TEST COMPLETE ===');
    console.log('\nIf profile photo exists but not showing on page:');
    console.log('1. Check browser console for React errors');
    console.log('2. Refresh the page');
    console.log('3. Check if image src is being set correctly');
    
  } catch (error) {
    console.error('❌ Error parsing profile data:', error);
  }
})();
