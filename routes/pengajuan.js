const express = require('express');
const router = express.Router();
const { isAuthenticated, isRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat folder uploads jika belum ada
const uploadDir = path.join(__dirname, '../public/uploads/proposal');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'proposal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Hanya file PDF yang diperbolehkan'));
    }
    cb(null, true);
  }
});

// ── STEP 1 ──────────────────────────────────────────
// GET — tampilkan form data pendaftaran
router.get('/baru', isAuthenticated, isRole(['pemohon']), (req, res) => {
  res.render('dashboard/pemohon/pengajuan-baru', {
    title: 'Formulir Pendaftaran Sidang',
    user: req.session.user,
    currentPath: req.originalUrl
  });
});

// ── STEP 2 ──────────────────────────────────────────
// GET — tampilkan halaman konfirmasi (preview form persetujuan Kaprodi)
router.get('/baru/konfirmasi', isAuthenticated, isRole(['pemohon']), (req, res) => {
  res.render('dashboard/pemohon/pengajuan_baru_konfirmasi', {
    title: 'Konfirmasi Pendaftaran Sidang',
    user: req.session.user,
    currentPath: req.originalUrl
  });
});

// ── STEP 3 ──────────────────────────────────────────
// GET — tampilkan halaman detail (ringkasan semua data + upload file)
router.get('/baru/detail', isAuthenticated, isRole(['pemohon']), (req, res) => {
  res.render('dashboard/pemohon/pengajuan_baru_detail', {
    title: 'Detail Pendaftaran Sidang',
    user: req.session.user,
    currentPath: req.originalUrl
  });
});

// POST — proses submit form (final, dari halaman detail)
router.post('/baru/detail', isAuthenticated, isRole(['pemohon']), upload.fields([
  { name: 'file_form_ttd', maxCount: 1 },
  { name: 'file_draft_karya_akhir', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      jenis_sidang,
      nama,
      nim,
      program_studi,
      alamat,
      no_hp,
      email,
      judul_karya_akhir
    } = req.body;

    // Validasi
    if (!jenis_sidang || !nama || !nim || !program_studi || !alamat || !no_hp || !email || !judul_karya_akhir) {
      return res.render('dashboard/pemohon/pengajuan_baru_detail', {
        title: 'Detail Pendaftaran Sidang',
        user: req.session.user,
        currentPath: req.originalUrl,
        error_msg: 'Mohon lengkapi semua kolom wajib.'
      });
    }

    const fileFormTtd = req.files?.file_form_ttd?.[0];
    const fileDraftKaryaAkhir = req.files?.file_draft_karya_akhir?.[0];

    if (!fileFormTtd || !fileDraftKaryaAkhir) {
      return res.render('dashboard/pemohon/pengajuan_baru_detail', {
        title: 'Detail Pendaftaran Sidang',
        user: req.session.user,
        currentPath: req.originalUrl,
        error_msg: 'Form bertanda tangan dan draft Karya Akhir wajib diunggah.'
      });
    }

    // TODO: simpan ke database
    console.log('✅ Pengajuan berhasil:');
    console.log('  - Jenis Sidang:', jenis_sidang);
    console.log('  - Nama:', nama);
    console.log('  - NIM:', nim);
    console.log('  - File Form TTD:', fileFormTtd.filename);
    console.log('  - File Draft:', fileDraftKaryaAkhir.filename);

    req.flash('success_msg', 'Pengajuan sidang berhasil dikirim!');
    return res.redirect('/dashboard/pemohon/data-management?success=1');
  } catch (err) {
    console.error('❌ Error:', err);
    return res.render('dashboard/pemohon/pengajuan_baru_detail', {
      title: 'Detail Pendaftaran Sidang',
      user: req.session.user,
      currentPath: req.originalUrl,
      error_msg: 'Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.'
    });
  }
});

module.exports = router;