// // ============================================
// // 📁 middleware/authMiddleware.js (SOLO BACKEND - SOLUCIÓN COMPLETA)
// // ============================================
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura-2024';

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     console.log('🔍 Authorization Header:', authHeader ? 'Presente' : 'Ausente');
    
//     if (!authHeader) {
//       console.log('❌ No hay header de autorización');
//       return res.status(401).json({
//         success: false,
//         message: 'Token no proporcionado',
//       });
//     }

//     // ✅ EXTRAER Y LIMPIAR TOKEN: Soportar múltiples formatos
//     let token = authHeader.trim();
    
//     // Remover "Bearer " si existe (formato estándar)
//     if (token.toLowerCase().startsWith('bearer ')) {
//       token = token.substring(7).trim();
//     }
    
//     // ✅ Remover prefijo "token" si existe (error común del frontend)
//     if (token.toLowerCase().startsWith('token')) {
//       token = token.substring(5).trim();
//     }
    
//     if (!token || token.length === 0) {
//       console.log('❌ Token vacío después de limpieza');
//       return res.status(401).json({
//         success: false,
//         message: 'Token inválido o vacío',
//       });
//     }

//     console.log('🔑 Token limpio (primeros 20 chars):', token.substring(0, 20) + '...');
//     console.log('🔑 JWT_SECRET en uso:', JWT_SECRET.substring(0, 10) + '...');

//     // Verificar token JWT
//     const decoded = jwt.verify(token, JWT_SECRET);
    
//     console.log('✅ Token decodificado correctamente');
//     console.log('📋 Usuario:', {
//       id: decoded.id,
//       nombre: decoded.nombre,
//       rol: decoded.rol
//     });
    
//     req.user = {
//       id: decoded.id,
//       nombre: decoded.nombre,
//       email: decoded.email,
//       rol: decoded.rol,
//       whatsapp: decoded.whatsapp
//     };
    
//     next();
//   } catch (error) {
//     console.error('❌ Error en authMiddleware:', error.message);
    
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token inválido',
//         error: error.message
//       });
//     }
    
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token expirado. Por favor, inicia sesión nuevamente'
//       });
//     }
    
//     return res.status(401).json({
//       success: false,
//       message: 'Error de autenticación',
//       error: error.message
//     });
//   }
// };

// const adminMiddleware = (req, res, next) => {
//   console.log('🔍 Verificando rol admin para:', req.user?.nombre || 'Usuario desconocido');
  
//   if (!req.user || req.user.rol !== 'admin') {
//     console.log('❌ Acceso denegado: Usuario no es admin');
//     return res.status(403).json({
//       success: false,
//       message: 'Acceso denegado: Se requiere rol de administrador'
//     });
//   }
  
//   console.log('✅ Usuario es admin - Acceso permitido');
//   next();
// };


// module.exports = { authMiddleware, adminMiddleware };





// ============================================
// 📁 middleware/authMiddleware.js - PRODUCCIÓN
// ============================================
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura-2024';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('❌ FALLO: No hay header de autorización');
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Inicia sesión nuevamente.',
      });
    }

    // ✅ EXTRAER TOKEN
    let token = authHeader.trim();
    
    // Remover "Bearer " si existe
    if (token.toLowerCase().startsWith('bearer ')) {
      token = token.substring(7).trim();
    }
    
    if (!token || token.length === 0) {
      console.log('❌ FALLO: Token vacío');
      return res.status(401).json({
        success: false,
        message: 'Token vacío o inválido',
      });
    }

    // 🔐 VERIFICAR TOKEN JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
     
    } catch (jwtError) {
      console.error('❌ FALLO JWT:', jwtError.name, '-', jwtError.message);
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido. Por favor, inicia sesión nuevamente.',
          errorDetail: jwtError.message
        });
      }
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Error al verificar el token',
        errorDetail: jwtError.message
      });
    }
    
    const usuario = await Usuario.findById(decoded.id);
    
    if (!usuario) {
      console.log('❌ FALLO: Usuario no encontrado en BD');
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado. Tu cuenta puede haber sido eliminada.'
      });
    }

    console.log('✅ Usuario encontrado en BD:', usuario.nombre);

    // ✅ VERIFICAR ESTADO DEL USUARIO
    if (usuario.isFrozen) {
      console.log('❄️ FALLO: Usuario congelado');
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta está temporalmente suspendida. Contacta al administrador.'
      });
    }

    // ✅ ESTABLECER USUARIO EN REQUEST
    req.user = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      whatsapp: usuario.whatsapp || null,
      isVerified: usuario.isVerified,
      isFrozen: usuario.isFrozen
    };
    
    next();
  } catch (error) {
    console.error('❌ ERROR CRÍTICO en authMiddleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno de autenticación',
      error: error.message
    });
  }
};

const adminMiddleware = (req, res, next) => {
  
  if (!req.user) {
    console.log('❌ FALLO: No hay usuario autenticado');
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  if (req.user.rol !== 'admin') {
    console.log('❌ FALLO: Usuario no es admin');
    console.log('Rol requerido: admin');
    console.log('Rol actual:', req.user.rol);
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requiere rol de administrador',
      usuarioRol: req.user.rol
    });
  }
  
  console.log('✅ Verificación admin exitosa');
  console.log('===========================\n');
  next();
};

const vendedorMiddleware = (req, res, next) => {
  console.log('\n🔐 === VERIFICACIÓN VENDEDOR ===');
  console.log('Usuario:', req.user?.nombre || 'No definido');
  console.log('Rol actual:', req.user?.rol || 'No definido');
  
  if (!req.user) {
    console.log('❌ FALLO: No hay usuario autenticado');
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  if (req.user.rol !== 'vendedor' && req.user.rol !== 'admin') {
    console.log('❌ FALLO: Usuario no es vendedor ni admin');
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requiere rol de vendedor',
      usuarioRol: req.user.rol
    });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware, vendedorMiddleware };
