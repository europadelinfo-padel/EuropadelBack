const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);

// ✅ AGREGAR ESTAS DOS RUTAS:
router.post('/recover-password', authController.recoverPassword);
router.post('/reset-password', authController.resetPassword);

// Ruta protegida para verificar token
router.post('/verify-token', authMiddleware, authController.verifyToken);

module.exports = router;