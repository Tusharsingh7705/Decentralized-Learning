// QUICK FIX SCRIPT - Copy profile data to current user
// Copy and paste this entire script into your browser console (F12)

(function() {
  console.log('=== PROFILE DATA FIX SCRIPT ===');
  
  // Get current user
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    console.error('❌ No user logged in');
    return;
  }
  
  console.log('Current User ID:', user._id);
  console.log('Current User Email:', user.email);
  
  // Find all provider profile keys
  const allKeys = Object.keys(localStorage);
  const profileKeys = allKeys.filter(key => key.startsWith('provider_profile_'));
  
  console.log('\nFound', profileKeys.length, 'profile data entries:');
  profileKeys.forEach(key => {
    const userId = key.replace('provider_profile_', '');
    const isCurrent = userId === user._id;
    console.log(`  ${isCurrent ? '✓ CURRENT' : '  OTHER'}: ${key}`);
  });
  
  // Check if current user has data
  const currentKey = `provider_profile_${user._id}`;
  const hasCurrentData = localStorage.getItem(currentKey);
  
  if (hasCurrentData) {
    console.log('\n✓ Current user already has profile data');
    const data = JSON.parse(hasCurrentData);
    console.log('  - Profile Photo:', data.profilePhoto ? '✓' : '✗');
    console.log('  - Wallet:', data.walletAddress ? '✓' : '✗');
    console.log('  - KYC Docs:', data.kycDocs ? '✓' : '✗');
    console.log('\n✓ No fix needed. Refresh the page.');
    return;
  }
  
  // Find other profile data
  const otherKeys = profileKeys.filter(key => key !== currentKey);
  
  if (otherKeys.length === 0) {
    console.log('\n⚠️ No profile data found for any user');
    console.log('You need to sign up again and upload files');
    return;
  }
  
  // Copy data from first found profile
  const sourceKey = otherKeys[0];
  const sourceData = localStorage.getItem(sourceKey);
  
  console.log('\n📋 Copying data from:', sourceKey);
  console.log('📋 To:', currentKey);
  
  localStorage.setItem(currentKey, sourceData);
  
  // Verify
  const copied = localStorage.getItem(currentKey);
  if (copied) {
    console.log('\n✅ SUCCESS! Profile data copied to current user');
    console.log('🔄 Please REFRESH the page to see your files');
    
    const data = JSON.parse(copied);
    console.log('\nCopied data includes:');
    console.log('  - Profile Photo:', data.profilePhoto ? `✓ ${data.profilePhoto.name}` : '✗');
    console.log('  - Wallet:', data.walletAddress ? `✓ ${data.walletAddress.substring(0, 10)}...` : '✗');
    console.log('  - Currency:', data.currency || '✗');
    if (data.kycDocs) {
      console.log('  - Aadhaar:', data.kycDocs.adharCard ? `✓ ${data.kycDocs.adharCard.name}` : '✗');
      console.log('  - Skill Cert:', data.kycDocs.skillCert ? `✓ ${data.kycDocs.skillCert.name}` : '✗');
      console.log('  - Education Cert:', data.kycDocs.educationCert ? `✓ ${data.kycDocs.educationCert.name}` : '✗');
    }
  } else {
    console.error('\n❌ Failed to copy data');
  }
  
  console.log('\n=== FIX COMPLETE ===');
})();
