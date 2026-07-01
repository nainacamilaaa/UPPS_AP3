require('dotenv').config();
const express = require('express');
const session = require('express-session');
// const mongoose = require('mongoose'); // Comment dulu
// const MongoStore = require('connect-mongo'); // Comment dulu
const flash = require('connect-flash');
const path = require('path');

const app = express();

// MongoDB Connection - Comment dulu
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ap3', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ MongoDB Connected'))
// .catch(err => console.error('❌ MongoDB Connection Error:', err));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration - Gunakan Memory Store (default)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key_here',
  resave: false,
  saveUninitialized: false,
  // store: MongoStore.create({ // Comment dulu
  //   mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ap3',
  //   collectionName: 'sessions'
  // }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Flash Messages
app.use(flash());

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Dashboard Routes (protected)
app.use('/dashboard', require('./routes/dashboard'));

// Pengajuan Routes (protected) — form pendaftaran sidang
app.use('/dashboard/pemohon/pengajuan', require('./routes/pengajuan'));

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📝 Using dummy data (no MongoDB required)');
  console.log('🔐 Test credentials:');
  console.log('   Pemohon : mahasiswa@test.com / password123');
  console.log('   Kaprodi : kaprodi@test.com / password123');
  console.log('   Admin   : admin@test.com / password123');
});