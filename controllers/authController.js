const { validationResult } = require('express-validator');

// Data dummy users (hardcoded)
const dummyUsers = [
  {
    id: '1',
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
    id: '2',
    email: 'kaprodi@test.com',
    password: 'password123',
    name: 'Kaprodi Test',
    role: 'kaprodi'
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: 'password123',
    name: 'Admin Test',
    role: 'admin'
  },
  {
    id: '4',
    email: 'dosen@test.com',
    password: 'password123',
    name: 'Dosen Pembimbing Test',
    role: 'dosen_pembimbing'
  }
];

const ROLE_REDIRECT = {
  pemohon: '/dashboard/pemohon',
  kaprodi: '/dashboard/kaprodi',
  admin: '/dashboard/admin',
  dosen_pembimbing: '/dashboard/dosen'
};

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect(ROLE_REDIRECT[req.session.user.role] || '/');
  }
  res.render('auth/login', {
    title: 'Login - SIKA',
    error: req.flash('error'),
    email: ''
  });
};

exports.postLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.render('auth/login', {
        title: 'Login - SIKA',
        error: req.flash('error'),
        email: req.body.email
      });
    }

    const { email, password } = req.body;
    
    // Cari user di data dummy
    const user = dummyUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      req.flash('error', 'Email atau password salah');
      return res.render('auth/login', {
        title: 'Login - SIKA',
        error: req.flash('error'),
        email: email
      });
    }

    // Cek password (simple comparison untuk dummy)
    if (user.password !== password) {
      req.flash('error', 'Email atau password salah');
      return res.render('auth/login', {
        title: 'Login - SIKA',
        error: req.flash('error'),
        email: email
      });
    }

    // Set session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      nim: user.nim,
      programStudi: user.programStudi
    };

    // Redirect based on role
    res.redirect(ROLE_REDIRECT[user.role] || '/');
    
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Terjadi kesalahan sistem');
    res.render('auth/login', {
      title: 'Login - SIKA',
      error: req.flash('error'),
      email: req.body.email
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login');
  });
};