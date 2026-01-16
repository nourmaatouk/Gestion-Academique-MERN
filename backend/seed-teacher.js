// Script to create a teacher with proper Auth link
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to auth_db first
async function seedTeacher() {
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

    // Check if teacher already exists in auth
    let authUser = await User.findOne({ email: 'teacher@test.com' });
    
    if (!authUser) {
      // Create auth user
      const hashedPassword = await bcrypt.hash('teacher123', 10);
      authUser = await User.create({
        email: 'teacher@test.com',
        password: hashedPassword,
        role: 'teacher',
        firstName: 'Jean',
        lastName: 'Dupont'
      });
      console.log('✅ Auth user created:', authUser._id);
    } else {
      console.log('ℹ️ Auth user already exists:', authUser._id);
    }

    // Now connect to user database
    const userConn = await mongoose.createConnection('mongodb://127.0.0.1:27017/user_db');
    console.log('✅ Connected to user_db');

    // Define Teacher schema
    const teacherSchema = new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      email: String,
      firstName: String,
      lastName: String,
      teacherId: String,
      specialite: String,
      department: String
    }, { timestamps: true });

    const Teacher = userConn.model('Teacher', teacherSchema);

    // Check if teacher profile exists
    let teacher = await Teacher.findOne({ email: 'teacher@test.com' });

    if (!teacher) {
      // Create teacher profile with linked userId
      teacher = await Teacher.create({
        userId: authUser._id,
        email: 'teacher@test.com',
        firstName: 'Jean',
        lastName: 'Dupont',
        teacherId: 'TCH-001',
        specialite: 'Informatique',
        department: 'Informatique'
      });
      console.log('✅ Teacher profile created:', teacher.teacherId);
    } else {
      // Update existing teacher with correct userId
      teacher.userId = authUser._id;
      await teacher.save();
      console.log('✅ Teacher profile updated with userId:', teacher.teacherId);
    }

    console.log('\n========================================');
    console.log('🎉 TEACHER ACCOUNT READY!');
    console.log('========================================');
    console.log('Email:    teacher@test.com');
    console.log('Password: teacher123');
    console.log('TeacherId:', teacher.teacherId);
    console.log('========================================\n');

    await authConn.close();
    await userConn.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedTeacher();
