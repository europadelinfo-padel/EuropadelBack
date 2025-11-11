// ============================================
// 📁 middleware/authMiddleware.js (SOLO BACKEND - SOLUCIÓN COMPLETA)
// ============================================
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura-2024';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('🔍 Authorization Header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader) {
      console.log('❌ No hay header de autorización');
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    // ✅ EXTRAER Y LIMPIAR TOKEN: Soportar múltiples formatos
    let token = authHeader.trim();
    
    // Remover "Bearer " si existe (formato estándar)
    if (token.toLowerCase().startsWith('bearer ')) {
      token = token.substring(7).trim();
    }
    
    // ✅ Remover prefijo "token" si existe (error común del frontend)
    if (token.toLowerCase().startsWith('token')) {
      token = token.substring(5).trim();
    }
    
    if (!token || token.length === 0) {
      console.log('❌ Token vacío después de limpieza');
      return res.status(401).json({
        success: false,
        message: 'Token inválido o vacío',
      });
    }

    console.log('🔑 Token limpio (primeros 20 chars):', token.substring(0, 20) + '...');
    console.log('🔑 JWT_SECRET en uso:', JWT_SECRET.substring(0, 10) + '...');

    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log('✅ Token decodificado correctamente');
    console.log('📋 Usuario:', {
      id: decoded.id,
      nombre: decoded.nombre,
      rol: decoded.rol
    });
    
    req.user = {
      id: decoded.id,
      nombre: decoded.nombre,
      email: decoded.email,
      rol: decoded.rol,
      whatsapp: decoded.whatsapp
    };
    
    next();
  } catch (error) {
    console.error('❌ Error en authMiddleware:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: error.message
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor, inicia sesión nuevamente'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Error de autenticación',
      error: error.message
    });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log('🔍 Verificando rol admin para:', req.user?.nombre || 'Usuario desconocido');
  
  if (!req.user || req.user.rol !== 'admin') {
    console.log('❌ Acceso denegado: Usuario no es admin');
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requiere rol de administrador'
    });
  }
  
  console.log('✅ Usuario es admin - Acceso permitido');
  next();
};

module.exports = { authMiddleware, adminMiddleware };