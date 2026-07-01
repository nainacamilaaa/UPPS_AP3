const express = require('express');
const router = express.Router();
const { isAuthenticated, isRole } = require('../middleware/auth');

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

// ============ KAPRODI ROUTES ============

// Dashboard Kaprodi
router.get('/kaprodi', isAuthenticated, isRole(['kaprodi']), (req, res) => {
  res.render('dashboard/kaprodi', { 
    title: 'Dashboard Kaprodi',
    user: req.session.user,
    currentPath: req.path
  });
});

module.exports = router;