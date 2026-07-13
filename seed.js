const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
    
    // Hapus users existing
    await User.deleteMany({});
    console.log('Users cleared...');
    
    const users = [
      {
        email: 'mahasiswa@test.com',
        password: 'password123',
        name: 'Mahasiswa Test',
        nim: '2021001',
        role: 'pemohon',
        programStudi: 'Teknik Informatika',
        alamat: 'Jakarta',
        noHP: '08123456789'
      },
      {
        email: 'dosen@test.com',
        password: 'password123',
        name: 'Dosen Pembimbing Test',
        role: 'dosen_pembimbing'
      },
      {
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin Test',
        role: 'admin'
      },
      {
        email: 'kaprodi@test.com',
        password: 'password123',
        name: 'Kaprodi Test',
        role: 'kaprodi'
      },
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