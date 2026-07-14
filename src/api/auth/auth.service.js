import User from '../user/user.model.js';
import { formatResult } from '../../utils/formatResult.js';

// ==================== FIND OR CREATE USER ====================
export async function findOrCreateUser(profile) {
  try {
    const email = profile.emails[0].value;
    const domain = email.split('@')[1];

    if (domain !== 'paramadina.ac.id' && domain !== 'students.paramadina.ac.id') {
      return { success: false, error: 'Silakan login menggunakan akun Google Paramadina.' };
    }

    if (domain === 'paramadina.ac.id') {
      return { success: false, error: 'Login Google belum tersedia untuk dosen/staff, silakan gunakan login manual.' };
    }

    // Cari user berdasarkan googleId
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Cari user berdasarkan email
      user = await User.findOne({ email });

      if (!user) {
        // Buat user baru
        const newUser = new User({
          name: profile.displayName,
          email,
          googleId: profile.id,
          role: 'mahasiswa',
          profile: {
            phone: '',
            address: '',
            programStudi: ''
          }
        });
        user = await newUser.save();
        console.log(`✅ User baru: ${user.name} (${user.email})`);
      } else {
        // Update googleId
        user.googleId = profile.id;
        if (!user.role || user.role === 'pemohon') {
          user.role = 'mahasiswa';
        }
        await user.save();
        console.log(`✅ Google ID terhubung: ${user.name}`);
      }
    }

    return formatResult(user, 'getOne');
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ==================== GET USER BY ID ====================
export async function getUserById(id) {
  const user = await User.findById(id).select('-__v');
  return formatResult(user, 'getOne');
}

// ==================== LOGOUT ====================
export function logout(req) {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) reject(err);
      else resolve({ success: true, message: 'Logout berhasil' });
    });
  });
}