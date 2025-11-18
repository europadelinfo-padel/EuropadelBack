// ============================================
// 📁 routes/vendedoractivoRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const vendedoractivoController = require('../controller/vendedoractivoController');

router.use(authMiddleware, adminMiddleware);

router.get('/', vendedoractivoController.listarVendedores);

router.patch('/:id/rol', vendedoractivoController.cambiarRol);

router.post('/:id/enviar-productos', vendedoractivoController.enviarTodosProductos);

router.patch('/:id/freeze', vendedoractivoController.toggleFreeze);

router.delete('/:id', vendedoractivoController.eliminarVendedor);

module.exports = router;

