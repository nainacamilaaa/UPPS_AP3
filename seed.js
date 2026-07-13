const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
    
    await User.deleteMany({});
    console.log('Users cleared...');
    
    const users = [
      {
        email: 'admin@paramadina.ac.id',
        password: 'Admin2024!',
        name: 'Administrator',
        role: 'admin'
      },
      {
        email: 'kaprodi.ti@paramadina.ac.id',
        password: 'Kaprodi2024!',
        name: 'Ketua Program Studi Teknik Informatika',
        role: 'kaprodi'
      }
    ];
    
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`User created: ${user.email} (${user.role})`);
    }
    
    console.log('✅ Seed completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
}

seed();
