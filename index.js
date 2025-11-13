// // ============================================
// // 📁 server.js (ACTUALIZADO)
// // ============================================
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/database');
// const authRoutes = require('./routes/authRoutes');
// const productosAdminRoutes = require('./routes/productosAdminRoutes');
// const productosVendedorRoutes = require('./routes/productosVendedorRoutes');
// const productosPublicRoutes = require('./routes/productosPublicRoutes'); // ✅ NUEVO
// const vendedoractivoRoutes = require('./routes/vendedoractivoRoutes');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ========================================
// // MIDDLEWARES
// // ========================================
// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'https://europadel-front-lemon.vercel.app'
//   ],
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ========================================
// // LOGGING MIDDLEWARE
// // ========================================
// app.use((req, res, next) => {
//   console.log(`📥 ${req.method} ${req.path}`);
//   console.log('Headers:', req.headers.authorization ? 'Token presente' : 'Sin token');
//   next();
// });

// // ========================================
// // HEALTH CHECK
// // ========================================
// app.get('/', (req, res) => {
//   res.json({
//     status: 'ok',
//     message: 'API funcionando correctamente',
//     timestamp: new Date().toISOString(),
//   });
// });

// // ========================================
// // RUTAS
// // ========================================
// app.use('/api/auth', authRoutes);

// app.use('/api/vendedoractivo', vendedoractivoRoutes);

// // ✅ Productos Admin (para el panel de vendedor - seleccionar)
// app.use('/api/productos', productosAdminRoutes);

// // ✅ Productos Públicos (para HomePage - solo lectura)
// app.use('/api/productos-publicos', productosPublicRoutes);

// // ✅ Productos del Vendedor (CRUD completo para vendedores)
// app.use('/api/productos-vendedor', productosVendedorRoutes);

// // Admin productos (CRUD de admin)
// app.use('/api/productosadmin', productosAdminRoutes);

// // ========================================
// // MANEJO DE ERRORES 404
// // ========================================
// app.use((req, res) => {
//   console.log('❌ Ruta no encontrada:', req.path);
//   res.status(404).json({
//     success: false,
//     message: `Ruta no encontrada: ${req.method} ${req.path}`,
//   });
// });

// // ========================================
// // MANEJO DE ERRORES GLOBAL
// // ========================================
// app.use((err, req, res, next) => {
//   console.error('❌ Error capturado:', err);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Error interno del servidor',
//     error: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // ========================================
// // INICIAR SERVIDOR
// // ========================================
// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('❌ Error al iniciar servidor:', error);
//     process.exit(1);
//   }
// };


// startServer();

// ============================================
// 📁 server.js (ACTUALIZADO)
// ============================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productosAdminRoutes = require('./routes/productosAdminRoutes');
const productosVendedorRoutes = require('./routes/productosVendedorRoutes');
const productosPublicRoutes = require('./routes/productosPublicRoutes');
const vendedoractivoRoutes = require('./routes/vendedoractivoRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// MIDDLEWARES
// ========================================
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://europadel-front-lemon.vercel.app'
    'europadel.com.ar'
    'https://www.europadel.com.ar'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// LOGGING MIDDLEWARE
// ========================================
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  console.log('Headers:', req.headers.authorization ? 'Token presente' : 'Sin token');
  next();
});

// ========================================
// HEALTH CHECK
// ========================================
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// RUTAS
// ========================================
app.use('/api/auth', authRoutes);

app.use('/api/vendedoractivo', vendedoractivoRoutes);

// ✅ Productos Admin (para el panel de vendedor - seleccionar)
app.use('/api/productos', productosAdminRoutes);

// ✅ Productos Públicos (para HomePage - solo lectura)
app.use('/api/productos-publicos', productosPublicRoutes);

// ✅ Productos del Vendedor (CRUD completo para vendedores)
app.use('/api/productos-vendedor', productosVendedorRoutes);

// Admin productos (CRUD de admin)
app.use('/api/productosadmin', productosAdminRoutes);

// ========================================
// MANEJO DE ERRORES 404
// ========================================
app.use((req, res) => {
  console.log('❌ Ruta no encontrada:', req.path);
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
});

// ========================================
// MANEJO DE ERRORES GLOBAL
// ========================================
app.use((err, req, res, next) => {
  console.error('❌ Error capturado:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();


