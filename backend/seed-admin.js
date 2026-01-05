// Script to create an admin account
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    // Connect to auth database
    const authConn = await mongoose.createConnection('mongodb://127.0.0.1:27017/auth_db');
    console.log('✅ Connected to auth_db');

    // Define User schema for auth
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      firstName: String,
      lastName: String
    }, { timestamps: true });
    
    const User = authConn.model('User', userSchema);

    // Check if admin already exists
    let adminUser = await User.findOne({ email: 'admin@admin.com' });
    
    if (!adminUser) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'System'
      });
      console.log('✅ Admin user created:', adminUser._id);
    } else {
      console.log('ℹ️ Admin user already exists:', adminUser._id);
    }

    console.log('\n========================================');
    console.log('🎉 ADMIN ACCOUNT READY!');
    console.log('========================================');
    console.log('Email:    admin@admin.com');
    console.log('Password: admin123');
    console.log('========================================\n');

    await authConn.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
