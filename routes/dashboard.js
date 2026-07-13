const express = require('express');
const router = express.Router();
const { isAuthenticated, isRole } = require('../middleware/auth');

// ------------------------------------------------------------------
// DUMMY DATA — Pengajuan Sidang (sementara, sebelum pakai database)
// TODO: ganti dengan query database asli begitu MongoDB/DB sudah aktif
// ------------------------------------------------------------------
const dummyPengajuan = [
  {
    id: 1,
    jenis_sidang: 'seminar_proposal',
    jenisSidangLabel: 'Sidang Seminar Proposal',
    nama: 'Rizky Ananda Putra',
    nim: '2021001',
    program_studi: 'Teknik Informatika',
    alamat: 'Jl. Melati No. 12, Jakarta Selatan',
    no_hp: '081234567890',
    email: 'rizky.ananda@student.paramadina.ac.id',
    judul_karya_akhir: 'Sistem Informasi Akademik Berbasis Web',
    tanggalDiajukan: '01 Juli 2026',
    status: 'menunggu', // menunggu | ditandatangani  (status dari sisi dosen pembimbing)
    ttd_pemohon: '',
    lampiran: [{ nama: 'Draft Softfile Karya Akhir.pdf', url: '#' }],
    // ── field untuk sisi admin (UPPS), diisi setelah dosen tanda tangan ──
    dosenPembimbing: null,
    statusAdmin: null, // null | menunggu | terjadwal | selesai | ditolak
    jadwal: null,      // { tanggal, jamMulai, jamSelesai, teknik, ruang, linkMeeting, penguji: [{nama, peran}] }
    alasanTolak: null,
    // ── field untuk sisi Kaprodi ──
    statusKaprodi: null,      // null | 'disetujui' | 'ditolak'
    ttd_kaprodi: null,
    alasanTolakKaprodi: null,
    signedAtKaprodi: null,
  },
  {
    id: 2,
    jenis_sidang: 'kolokium',
    jenisSidangLabel: 'Sidang Kolokium',
    nama: 'Siti Nurhaliza',
    nim: '2021005',
    program_studi: 'Teknik Informatika',
    alamat: 'Jl. Kenanga No. 5, Jakarta Timur',
    no_hp: '081298765432',
    email: 'siti.nurhaliza@student.paramadina.ac.id',
    judul_karya_akhir: 'Sistem Informasi Geografis untuk Pemetaan Wilayah',
    tanggalDiajukan: '25 Juni 2026',
    status: 'ditandatangani',
    ttd_pemohon: '',
    lampiran: [{ nama: 'Draft Softfile Karya Akhir.pdf', url: '#' }],
    dosenPembimbing: 'Dr. Budi Santoso',
    statusAdmin: 'terjadwal',
    jadwal: {
      tanggal: '2026-07-15',
      jamMulai: '09:00',
      jamSelesai: '11:00',
      teknik: 'online',
      linkMeeting: 'zoom.us/meeting/123456789',
      ruang: null,
      penguji: [
        { nama: 'Dr. Ahmad Fauzi', peran: 'Ketua' },
        { nama: 'Dr. Budi Santoso', peran: 'Anggota' },
        { nama: 'Dr. Citra Dewi', peran: 'Anggota' }
      ]
    },
    statusKaprodi: null,
    ttd_kaprodi: null,
    alasanTolakKaprodi: null,
    signedAtKaprodi: null,
  },
  {
    id: 3,
    jenis_sidang: 'seminar_proposal',
    jenisSidangLabel: 'Sidang Seminar Proposal',
    nama: 'Muhammad Fajar',
    nim: '2021012',
    program_studi: 'Teknik Informatika',
    alamat: 'Jl. Anggrek No. 8, Jakarta Barat',
    no_hp: '081211223344',
    email: 'muhammad.fajar@student.paramadina.ac.id',
    judul_karya_akhir: 'Analisis Data Penjualan Menggunakan Machine Learning',
    tanggalDiajukan: '10 Juni 2026',
    status: 'ditandatangani',
    tanggalTandatangan: '08 Juli 2026',
    ttd_pemohon: '',
    lampiran: [{ nama: 'Draft Softfile Karya Akhir.pdf', url: '#' }],
    dosenPembimbing: 'Dr. Eko Prasetyo',
    statusAdmin: 'menunggu',
    jadwal: null,
    alasanTolak: null,
    statusKaprodi: null,
    ttd_kaprodi: null,
    alasanTolakKaprodi: null,
    signedAtKaprodi: null,
  },
];

// ============ PEMOHON ROUTES ============

// Dashboard Pemohon
router.get('/pemohon', isAuthenticated, isRole(['pemohon']), (req, res) => {
  res.render('dashboard/pemohon', { 
    title: 'Dashboard Pemohon',
    user: req.session.user,
    currentPath: req.path
  });
});

// Data Management Pemohon
router.get('/pemohon/data-management', isAuthenticated, isRole(['pemohon']), (req, res) => {
  res.render('dashboard/pemohon/data_management', {
    title: 'Data Management',
    user: req.session.user,
    currentPath: req.path
  });
});

// ============ ADMIN ROUTES ============

// Dashboard Admin
router.get('/admin', isAuthenticated, isRole(['admin']), (req, res) => {
  res.render('dashboard/admin', { 
    title: 'Dashboard Admin',
    user: req.session.user,
    currentPath: req.path
  });
});

// Kelola Pengajuan Admin
router.get('/admin/kelola-pengajuan', isAuthenticated, isRole(['admin']), (req, res) => {
  res.render('dashboard/admin/kelola-pengajuan', {
    title: 'Kelola Pengajuan',
    user: req.session.user,
    currentPath: req.path
  });
});

// Data Management Admin
router.get('/admin/data-management', isAuthenticated, isRole(['admin']), (req, res) => {
  res.render('dashboard/admin/data_management', {
    title: 'Data Management Admin',
    user: req.session.user,
    currentPath: req.path
  });
});

// ============ DOSEN PEMBIMBING ROUTES ============

// Dashboard Dosen Pembimbing
router.get('/dosen', isAuthenticated, isRole(['dosen_pembimbing']), (req, res) => {
  res.render('dashboard/dosen', {
    title: 'Dashboard Dosen Pembimbing',
    user: req.session.user,
    currentPath: req.path
  });
});

// Pengajuan Menunggu Tanda Tangan (daftar)
router.get('/dosen/pengajuan', isAuthenticated, isRole(['dosen_pembimbing']), (req, res) => {
  res.render('dashboard/dosen/pengajuan', {
    title: 'Pengajuan Menunggu Tanda Tangan',
    user: req.session.user,
    currentPath: req.path,
    pengajuanList: dummyPengajuan,
  });
});

// Detail Pengajuan -> halaman tanda tangan
router.get('/dosen/pengajuan/:id/detail', isAuthenticated, isRole(['dosen_pembimbing']), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pengajuan = dummyPengajuan.find((p) => p.id === id);

  if (!pengajuan) {
    return res.status(404).render('404', { title: 'Page Not Found' });
  }

  res.render('dashboard/dosen/pengajuan_detail', {
    title: 'Tanda Tangani Pengajuan',
    user: req.session.user,
    currentPath: req.path,
    pengajuan,
  });
});

// Submit tanda tangan dosen
router.post('/dosen/pengajuan/:id/tanda-tangan', isAuthenticated, isRole(['dosen_pembimbing']), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pengajuan = dummyPengajuan.find((p) => p.id === id);

  if (!pengajuan) {
    return res.status(404).render('404', { title: 'Page Not Found' });
  }

  const { ttd_dosen } = req.body;

  if (!ttd_dosen) {
    req.flash('error_msg', 'Tanda tangan wajib diisi.');
    return res.redirect(`/dashboard/dosen/pengajuan/${id}/detail`);
  }

  pengajuan.ttd_dosen = ttd_dosen;
  pengajuan.status = 'ditandatangani';
  pengajuan.signedAt = new Date().toISOString(); // dipakai untuk hitung "24 jam terakhir"
  pengajuan.tanggalTandatangan = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  // Begitu dosen tanda tangan, otomatis lempar ke antrian admin (UPPS)
  pengajuan.dosenPembimbing = (req.session.user && req.session.user.nama) || 'Dosen Pembimbing';
  pengajuan.statusAdmin = 'menunggu';

  res.redirect('/dashboard/dosen/pengajuan');
});

// Riwayat Persetujuan Dosen Pembimbing
router.get('/dosen/riwayat', isAuthenticated, isRole(['dosen_pembimbing']), (req, res) => {
  const riwayatList = dummyPengajuan
    .filter((p) => p.status === 'ditandatangani')
    .sort((a, b) => new Date(b.signedAt || 0) - new Date(a.signedAt || 0));

  res.render('dashboard/dosen/riwayat', {
    title: 'Riwayat Persetujuan',
    user: req.session.user,
    currentPath: req.path,
    riwayatList,
  });
});

// ============ KAPRODI ROUTES (DIGABUNG JADI 1 DASHBOARD DENGAN TAB) ============

// Dashboard Kaprodi — 1 route, 2 tab: menunggu & riwayat
// GET /dashboard/kaprodi                  -> tab menunggu (default)
// GET /dashboard/kaprodi?tab=riwayat       -> tab riwayat
// GET /dashboard/kaprodi?tab=riwayat&status=disetujui  -> tab riwayat, filter status
router.get('/kaprodi', isAuthenticated, isRole(['kaprodi']), (req, res) => {
  const { tab, status } = req.query;
  const activeTab = tab === 'riwayat' ? 'riwayat' : 'menunggu'; // default: menunggu

  // --- Data untuk tab "Menunggu Persetujuan" ---
  // Syarat tampil: dosen pembimbing sudah ttd, admin PPSU sudah menjadwalkan,
  // dan kaprodi belum memutuskan (disetujui/ditolak)
  const daftarMenunggu = dummyPengajuan.filter((p) =>
    p.statusAdmin === 'terjadwal' && !p.statusKaprodi
  );

  // --- Data untuk tab "Riwayat" ---
  let riwayatList = dummyPengajuan.filter((p) =>
    p.statusKaprodi === 'disetujui' || p.statusKaprodi === 'ditolak'
  );

  if (status === 'disetujui' || status === 'ditolak') {
    riwayatList = riwayatList.filter((p) => p.statusKaprodi === status);
  }

  riwayatList.sort(
    (a, b) => new Date(b.signedAtKaprodi || 0) - new Date(a.signedAtKaprodi || 0)
  );

  riwayatList = riwayatList.map((p) => ({
    ...p,
    tanggalKeputusanFormatted: p.signedAtKaprodi
      ? new Date(p.signedAtKaprodi).toLocaleDateString('id-ID', {
          day: '2-digit', month: 'long', year: 'numeric',
        })
      : '-',
  }));

  res.render('dashboard/kaprodi', {
    title: 'Dashboard Kaprodi',
    user: req.session.user,
    currentPath: req.path,
    activeTab,
    daftarMenunggu,
    riwayatList,
    filterStatus: status,
  });
});

// Daftar Pengajuan Menunggu Persetujuan Kaprodi
router.get('/kaprodi/persetujuan', isAuthenticated, isRole(['kaprodi']), (req, res) => {
  const daftarMenunggu = dummyPengajuan.filter((p) =>
    p.statusAdmin === 'terjadwal' && !p.statusKaprodi
  );

  res.render('dashboard/kaprodi/persetujuan', {
    title: 'Pengajuan Menunggu Persetujuan',
    user: req.session.user,
    currentPath: req.path,
    daftarMenunggu,
  });
});

// Riwayat Persetujuan Kaprodi
router.get('/kaprodi/riwayat', isAuthenticated, isRole(['kaprodi']), (req, res) => {
  const { status } = req.query;
  let riwayatList = dummyPengajuan.filter((p) =>
    p.statusKaprodi === 'disetujui' || p.statusKaprodi === 'ditolak'
  );

  if (status === 'disetujui' || status === 'ditolak') {
    riwayatList = riwayatList.filter((p) => p.statusKaprodi === status);
  }

  riwayatList.sort(
    (a, b) => new Date(b.signedAtKaprodi || 0) - new Date(a.signedAtKaprodi || 0)
  );

  riwayatList = riwayatList.map((p) => ({
    ...p,
    tanggalKeputusanFormatted: p.signedAtKaprodi
      ? new Date(p.signedAtKaprodi).toLocaleDateString('id-ID', {
          day: '2-digit', month: 'long', year: 'numeric',
        })
      : '-',
  }));

  res.render('dashboard/kaprodi/riwayat', {
    title: 'Riwayat Persetujuan Kaprodi',
    user: req.session.user,
    currentPath: req.path,
    activeTab: 'riwayat',
    daftarMenunggu: [],
    riwayatList,
    filterStatus: status,
  });
});

// Detail Pengajuan -> halaman review & tanda tangan Kaprodi
router.get('/kaprodi/persetujuan/:id/detail', isAuthenticated, isRole(['kaprodi']), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pengajuan = dummyPengajuan.find((p) => p.id === id);

  if (!pengajuan) {
    return res.status(404).render('404', { title: 'Page Not Found' });
  }

  res.render('dashboard/kaprodi/persetujuan_detail', {
    title: 'Detail Persetujuan Kaprodi',
    user: req.session.user,
    currentPath: req.path,
    pengajuan,
  });
});

// Submit: Setujui & Tanda Tangani (Kaprodi)
router.post('/kaprodi/persetujuan/:id/setujui', isAuthenticated, isRole(['kaprodi']), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pengajuan = dummyPengajuan.find((p) => p.id === id);

  if (!pengajuan) {
    return res.status(404).render('404', { title: 'Page Not Found' });
  }

  const { ttd_kaprodi } = req.body;
  if (!ttd_kaprodi) {
    req.flash('error_msg', 'Tanda tangan wajib diisi sebelum menyetujui.');
    return res.redirect(`/dashboard/kaprodi/persetujuan/${id}/detail`);
  }

  pengajuan.ttd_kaprodi = ttd_kaprodi;
  pengajuan.statusKaprodi = 'disetujui';
  pengajuan.signedAtKaprodi = new Date().toISOString();

  req.flash('success_msg', 'Pengajuan berhasil disetujui dan ditandatangani.');
  res.redirect('/dashboard/kaprodi?tab=menunggu');
});

// Submit: Tolak (Kaprodi)
router.post('/kaprodi/persetujuan/:id/tolak', isAuthenticated, isRole(['kaprodi']), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pengajuan = dummyPengajuan.find((p) => p.id === id);

  if (!pengajuan) {
    return res.status(404).render('404', { title: 'Page Not Found' });
  }

  const { alasan } = req.body;
  if (!alasan) {
    req.flash('error_msg', 'Alasan penolakan wajib diisi.');
    return res.redirect(`/dashboard/kaprodi/persetujuan/${id}/detail`);
  }

  pengajuan.statusKaprodi = 'ditolak';
  pengajuan.alasanTolakKaprodi = alasan;
  pengajuan.signedAtKaprodi = new Date().toISOString(); // dipakai juga sebagai tanggal keputusan penolakan

  req.flash('success_msg', 'Pengajuan telah ditolak.');
  res.redirect('/dashboard/kaprodi?tab=menunggu');
});

module.exports = router;