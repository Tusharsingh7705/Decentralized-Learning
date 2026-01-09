// backend/seedProviderProfiles.js
// Run this script to add test provider profiles to your database
// Usage: node seedProviderProfiles.js

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const ProviderProfile = require("./src/models/ProviderProfile");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blockmarket";

// Sample provider profiles
const sampleProfiles = [
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001"
    },
    dateOfBirth: new Date("1985-06-15"),
    languages: ["English", "Spanish", "French"],
    services: ["Mathematics", "Physics", "Chemistry"],
    certifications: [
      {
        name: "Certified Mathematics Teacher",
        issuingOrganization: "National Education Board",
        issueDate: new Date("2020-06-15"),
        expiryDate: new Date("2025-06-15"),
        certificateUrl: "https://via.placeholder.com/400x300"
      }
    ],
    bio: "Experienced educator with over 15 years of teaching experience in STEM subjects. Passionate about helping students achieve their academic goals through personalized learning approaches.",
    documents: {
      identityProof: {
        type: "passport",
        fileUrl: "https://via.placeholder.com/400x300",
        uploadedAt: new Date()
      },
      addressProof: {
        type: "utilityBill",
        fileUrl: "https://via.placeholder.com/400x300",
        uploadedAt: new Date()
      },
      professionalCertificates: [
        {
          name: "Teaching Certificate",
          fileUrl: "https://via.placeholder.com/400x300",
          uploadedAt: new Date()
        }
      ]
    },
    photos: {
      profilePhoto: "https://via.placeholder.com/150",
      additionalPhotos: ["https://via.placeholder.com/300"]
    },
    verificationStatus: "Pending"
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "9876543210",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      zipCode: "90001"
    },
    dateOfBirth: new Date("1990-03-20"),
    languages: ["English", "Mandarin"],
    services: ["Computer Science", "Programming", "Web Development"],
    certifications: [
      {
        name: "Full Stack Developer Certification",
        issuingOrganization: "Tech Academy",
        issueDate: new Date("2021-01-10"),
        certificateUrl: "https://via.placeholder.com/400x300"
      }
    ],
    bio: "Professional software developer with 10 years of industry experience. Specializing in web development, JavaScript, React, and Node.js. Love teaching coding to beginners.",
    documents: {
      identityProof: {
        type: "drivingLicense",
        fileUrl: "https://via.placeholder.com/400x300",
        uploadedAt: new Date()
      },
      addressProof: {
        type: "bankStatement",
        fileUrl: "https://via.placeholder.com/400x300",
        uploadedAt: new Date()
      }
    },
    photos: {
      profilePhoto: "https://via.placeholder.com/150",
      additionalPhotos: []
    },
    verificationStatus: "Pending"
  },
  {
    fullName: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "5551234567",
    address: {
      street: "789 Pine Road",
      city: "Chicago",
      state: "IL",
      country: "USA",
      zipCode: "60601"
    },
    dateOfBirth: new Date("1988-11-05"),
    languages: ["English", "German"],
    services: ["Music", "Piano", "Music Theory"],
    bio: "Professional pianist and music teacher with 12 years of teaching experience. Graduated from Berklee College of Music. Specialized in classical and contemporary piano.",
    documents: {
      identityProof: {
        type: "passport",
        fileUrl: "https://via.placeholder.com/400x300",
        uploadedAt: new Date()
      }
    },
    photos: {
      profilePhoto: "https://via.placeholder.com/150"
    },
    verificationStatus: "Pending"
  }
];

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Create provider users if they don't exist
    console.log("\n👤 Creating provider users...");
    
    const providerUsers = [];
    for (const profile of sampleProfiles) {
      let user = await User.findOne({ email: profile.email });
      
      if (!user) {
        user = await User.create({
          name: profile.fullName,
          email: profile.email,
          password: "password123", // Will be hashed automatically
          role: "provider",
          isVerified: false
        });
        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.log(`ℹ️  User already exists: ${user.email}`);
      }
      
      providerUsers.push(user);
    }

    // Create provider profiles
    console.log("\n📝 Creating provider profiles...");
    
    for (let i = 0; i < sampleProfiles.length; i++) {
      const profileData = sampleProfiles[i];
      const user = providerUsers[i];

      // Check if profile already exists
      const existingProfile = await ProviderProfile.findOne({ userId: user._id });
      
      if (existingProfile) {
        console.log(`ℹ️  Profile already exists for: ${profileData.fullName}`);
        continue;
      }

      // Create new profile
      const profile = await ProviderProfile.create({
        ...profileData,
        userId: user._id
      });

      console.log(`✅ Created profile: ${profile.fullName} (Status: ${profile.verificationStatus})`);
    }

    // Display summary
    console.log("\n📊 Database Summary:");
    const totalProfiles = await ProviderProfile.countDocuments();
    const pendingProfiles = await ProviderProfile.countDocuments({ verificationStatus: "Pending" });
    const verifiedProfiles = await ProviderProfile.countDocuments({ verificationStatus: "Verified" });
    
    console.log(`   Total Profiles: ${totalProfiles}`);
    console.log(`   Pending: ${pendingProfiles}`);
    console.log(`   Verified: ${verifiedProfiles}`);

    console.log("\n✅ Seeding completed successfully!");
    console.log("\n🎯 Next steps:");
    console.log("   1. Login to admin dashboard");
    console.log("   2. Navigate to Providers section");
    console.log("   3. You should see the pending profiles");
    console.log("   4. Review and approve/reject them");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
