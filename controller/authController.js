// ============================================
// 📁 controller/authController.js (ACTUALIZADO)
// ============================================
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const emailService = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'mi-clave-secreta-super-segura-2024';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Intento de login:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    console.log('📋 Usuario encontrado:', {
      id: usuario._id,
      nombre: usuario.nombre,
      rol: usuario.rol
    });

    // Verificar contraseña
    let isMatch = false;
    
    if (typeof usuario.comparePassword === 'function') {
      isMatch = await usuario.comparePassword(password);
    } else {
      isMatch = await bcrypt.compare(password, usuario.password);
    }

    if (!isMatch) {
      console.log('❌ Contraseña incorrecta para:', email);
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // ✅ CREAR TOKEN
    const tokenPayload = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      whatsapp: usuario.whatsapp || null
    };


    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });


    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        whatsapp: usuario.whatsapp || null,
        isVerified: usuario.isVerified
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};




// ✅ ACTUALIZAR LA FUNCIÓN REGISTER:
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, whatsapp } = req.body;

    console.log('📝 Intento de registro:', { nombre, email, rol });

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      console.log('⚠️ Usuario ya existe:', email);
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // ✅ GENERAR CÓDIGO DE VERIFICACIÓN
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol: rol || 'usuario',
      whatsapp: whatsapp || null,
      isVerified: false, // ❌ NO verificado hasta confirmar email
      verificationCode,
      verificationCodeExpires: codeExpires
    });

    await nuevoUsuario.save();

    console.log('✅ Usuario registrado (pendiente verificación):', {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      codigo: verificationCode
    });

    // ✅ ENVIAR EMAIL DE VERIFICACIÓN
    try {
      await emailService.sendVerificationEmail(email, nombre, verificationCode);
      console.log('📧 Email de verificación enviado a:', email);
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
    }

    // ❌ NO generar token aquí - solo después de verificar
    res.status(201).json({
      success: true,
      message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.',
      // NO enviar token ni user aquí
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};


exports.verifyToken = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        whatsapp: usuario.whatsapp || null,
        isVerified: usuario.isVerified
      }
    });

  } catch (error) {
    console.error('❌ Error verificando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando token'
    });
  }
};



exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    console.log('🔍 Verificando código para:', email);

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email y código son requeridos'
      });
    }
    
    const usuario = await Usuario.findOne({ 
      email, 
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() } // Verificar que no haya expirado
    });
    
    if (!usuario) {
      console.log('❌ Código inválido o expirado para:', email);
      return res.status(400).json({
        success: false,
        message: 'Código inválido o expirado'
      });
    }
    
    // ✅ MARCAR COMO VERIFICADO
    usuario.isVerified = true;
    usuario.verificationCode = null;
    usuario.verificationCodeExpires = null;
    await usuario.save();
    
    console.log('✅ Usuario verificado exitosamente:', email);
    
    // ✅ AHORA SÍ GENERAR TOKEN
    const tokenPayload = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      whatsapp: usuario.whatsapp || null
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      message: 'Cuenta verificada exitosamente',
      token,
      usuario: tokenPayload // ✅ Cambiar 'usuario' por 'user' si tu frontend espera 'user'
    });
    
  } catch (error) {
    console.error('❌ Error en verify-email:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando email'
    });
  }
};


// ============================================
// 🔑 RECUPERAR CONTRASEÑA (enviar código)
// ============================================
exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('🔑 Solicitud de recuperación para:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log('❌ Usuario no encontrado:', email);
      // Por seguridad, NO revelar si el email existe o no
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás un código de recuperación'
      });
    }

    // ✅ GENERAR CÓDIGO DE RECUPERACIÓN
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    usuario.recoveryCode = recoveryCode;
    usuario.recoveryCodeExpires = codeExpires;
    await usuario.save();

    console.log('✅ Código de recuperación generado:', {
      email,
      codigo: recoveryCode,
      expira: codeExpires
    });

    // ✅ ENVIAR EMAIL CON CÓDIGO
    try {
      await emailService.sendRecoveryEmail(email, usuario.nombre, recoveryCode);
      console.log('📧 Email de recuperación enviado a:', email);
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el email de recuperación'
      });
    }

    res.json({
      success: true,
      message: 'Se ha enviado un código de recuperación a tu correo'
    });

  } catch (error) {
    console.error('❌ Error en recover-password:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// ============================================
// 🔐 RESETEAR CONTRASEÑA (con código)
// ============================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    console.log('🔐 Intento de reset para:', email);

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, código y nueva contraseña son requeridos'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario con código válido
    const usuario = await Usuario.findOne({
      email,
      recoveryCode: code,
      recoveryCodeExpires: { $gt: Date.now() } // Código no expirado
    });

    if (!usuario) {
      console.log('❌ Código inválido o expirado para:', email);
      return res.status(400).json({
        success: false,
        message: 'Código inválido o expirado'
      });
    }

    // ✅ ACTUALIZAR CONTRASEÑA
    usuario.password = newPassword; // Se hasheará automáticamente por el middleware
    usuario.recoveryCode = null;
    usuario.recoveryCodeExpires = null;
    await usuario.save();

    console.log('✅ Contraseña actualizada exitosamente para:', email);

    // ✅ OPCIONAL: Enviar email de confirmación
    try {
      const details = emailService.getDeviceDetails(req);
      await emailService.sendPasswordChangedEmail(email, usuario.nombre, details);
      console.log('📧 Email de confirmación enviado');
    } catch (emailError) {
      console.error('⚠️ Error enviando email de confirmación:', emailError);
      // No fallar si el email de confirmación falla
    }

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.'
    });

  } catch (error) {
    console.error('❌ Error en reset-password:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

