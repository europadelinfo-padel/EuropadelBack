// // ============================================
// // 📁 routes/vendedoractivoRoutes.js
// // ============================================
// const express = require('express');
// const router = express.Router();
// const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
// const vendedoractivoController = require('../controller/vendedoractivoController');

// // ✅ TODAS LAS RUTAS PROTEGIDAS: Solo admin puede acceder
// router.use(authMiddleware, adminMiddleware);

// // 📋 GET /api/vendedoractivo - Listar todos los vendedores (con paginación)
// router.get('/', vendedoractivoController.listarVendedores);

// // 🔄 PATCH /api/vendedoractivo/:id/freeze - Congelar/Descongelar vendedor
// router.patch('/:id/freeze', vendedoractivoController.toggleFreeze);

// // 🔄 PATCH /api/vendedoractivo/:id/rol - Cambiar rol (usuario <-> vendedor)
// router.patch('/:id/rol', vendedoractivoController.cambiarRol);

// // 🗑️ DELETE /api/vendedoractivo/:id - Eliminar vendedor
// router.delete('/:id', vendedoractivoController.eliminarVendedor);


// module.exports = router;

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
