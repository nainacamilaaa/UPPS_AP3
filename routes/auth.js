const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.get('/login', authController.getLogin);
router.post('/login', [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi')
], authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;
