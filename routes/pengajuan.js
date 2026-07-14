const express = require('express');
const router = express.Router();
const { isAuthenticated, isRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

function getAxiosConfig(req, additionalHeaders = {}) {
  return {
    headers: {
      Cookie: req.session.user?.backendCookie || '',
      ...additionalHeaders
    }
  };
}

// Buat folder uploads sementara jika belum ada
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

// GET — tampilkan form data pendaftaran
router.get('/baru', isAuthenticated, isRole(['pemohon', 'mahasiswa']), (req, res) => {
  res.render('dashboard/pemohon/pengajuan-baru', {
    title: 'Formulir Pendaftaran Sidang',
    user: req.session.user,
    currentPath: req.originalUrl
  });
});

// GET — tampilkan halaman konfirmasi (redirect ke SPA)
router.get('/baru/konfirmasi', isAuthenticated, isRole(['pemohon', 'mahasiswa']), (req, res) => {
  res.redirect('/dashboard/pemohon/pengajuan/baru');
});

// GET — tampilkan halaman detail (redirect ke SPA)
router.get('/baru/detail', isAuthenticated, isRole(['pemohon', 'mahasiswa']), (req, res) => {
  res.redirect('/dashboard/pemohon/pengajuan/baru');
});

// POST — proses submit form ke Backend API
router.post('/baru/detail', isAuthenticated, isRole(['pemohon', 'mahasiswa']), upload.fields([
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
      judul_karya_akhir,
      ttd_pemohon
    } = req.body;

    // Validasi
    if (!jenis_sidang || !nama || !nim || !program_studi || !alamat || !no_hp || !email || !judul_karya_akhir) {
      return res.render('dashboard/pemohon/pengajuan-baru', {
        title: 'Detail Pendaftaran Sidang',
        user: req.session.user,
        currentPath: req.originalUrl,
        error_msg: 'Mohon lengkapi semua kolom wajib.'
      });
    }

    const fileDraftKaryaAkhir = req.files?.file_draft_karya_akhir?.[0];

    if (!fileDraftKaryaAkhir) {
      return res.render('dashboard/pemohon/pengajuan-baru', {
        title: 'Detail Pendaftaran Sidang',
        user: req.session.user,
        currentPath: req.originalUrl,
        error_msg: 'Draft Karya Akhir wajib diunggah.'
      });
    }

    // Buat FormData untuk dikirim ke Backend API
    const formData = new FormData();
    formData.append('jenis_sidang', jenis_sidang);
    formData.append('nama', nama);
    formData.append('nim', nim);
    formData.append('program_studi', program_studi);
    formData.append('alamat', alamat);
    formData.append('no_hp', no_hp);
    formData.append('email', email);
    formData.append('judul_karya_akhir', judul_karya_akhir);
    if (ttd_pemohon) formData.append('ttd_pemohon', ttd_pemohon);

    formData.append('file_draft_karya_akhir', fs.createReadStream(fileDraftKaryaAkhir.path));

    // Post ke Backend
    await axios.post(`${BACKEND_URL}/proposal`, formData, getAxiosConfig(req, formData.getHeaders()));

    // Hapus file sementara di frontend secara asynchronous
    fs.unlink(fileDraftKaryaAkhir.path, () => {});

    req.flash('success_msg', 'Pengajuan sidang berhasil dikirim!');
    return res.redirect('/dashboard/pemohon/data-management?success=1');
  } catch (err) {
    console.error('❌ Error submitting proposal to backend:', err.response?.data || err.message);
    return res.render('dashboard/pemohon/pengajuan_baru_detail', {
      title: 'Detail Pendaftaran Sidang',
      user: req.session.user,
      currentPath: req.originalUrl,
      error_msg: err.response?.data?.error || 'Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.'
    });
  }
});

module.exports = router;