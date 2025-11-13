// // ============================================
// // 📁 controllers/vendedoractivoController.js
// // ============================================
// const Usuario = require('../models/Usuario');

// // 📋 LISTAR TODOS LOS VENDEDORES CON PAGINACIÓN
// const listarVendedores = async (req, res) => {
//   try {
//     const { page = 1, limit = 9 } = req.query; // 9 items (3x3 por página)
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     console.log('📋 Listando vendedores - Página:', page);

//     // Buscar todos los usuarios (excluyendo admins)
//     const vendedores = await Usuario.find({ rol: { $ne: 'admin' } })
//       .select('nombre email rol whatsapp isVerified isFrozen createdAt updatedAt')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Usuario.countDocuments({ rol: { $ne: 'admin' } });

//     console.log(`✅ ${vendedores.length} vendedores encontrados de ${total} totales`);

//     res.status(200).json({
//       success: true,
//       data: vendedores,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error al listar vendedores:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al obtener vendedores',
//       error: error.message
//     });
//   }
// };

// // 🔄 CONGELAR/DESCONGELAR VENDEDOR
// const toggleFreeze = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     console.log('🔄 Cambiando estado freeze para usuario:', id);

//     const vendedor = await Usuario.findById(id);

//     if (!vendedor) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendedor no encontrado'
//       });
//     }

//     // No permitir congelar admins
//     if (vendedor.rol === 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'No se puede congelar a un administrador'
//       });
//     }

//     // Toggle del estado
//     vendedor.isFrozen = !vendedor.isFrozen;
//     await vendedor.save();

//     console.log(`✅ Vendedor ${vendedor.isFrozen ? 'congelado' : 'descongelado'}:`, vendedor.nombre);

//     res.status(200).json({
//       success: true,
//       message: `Vendedor ${vendedor.isFrozen ? 'congelado' : 'descongelado'} exitosamente`,
//       data: {
//         _id: vendedor._id,
//         nombre: vendedor.nombre,
//         isFrozen: vendedor.isFrozen
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error al cambiar estado freeze:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al cambiar estado del vendedor',
//       error: error.message
//     });
//   }
// };

// // 🔄 CAMBIAR ROL (usuario <-> vendedor)
// const cambiarRol = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { nuevoRol } = req.body;

//     console.log('🔄 Cambiando rol para usuario:', id, 'Nuevo rol:', nuevoRol);

//     // Validar que el nuevo rol sea válido
//     if (!['usuario', 'vendedor'].includes(nuevoRol)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Rol inválido. Solo se permite "usuario" o "vendedor"'
//       });
//     }

//     const vendedor = await Usuario.findById(id);

//     if (!vendedor) {
//       return res.status(404).json({
//         success: false,
//         message: 'Usuario no encontrado'
//       });
//     }

//     // No permitir cambiar rol de admins
//     if (vendedor.rol === 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'No se puede cambiar el rol de un administrador'
//       });
//     }

//     // Actualizar rol
//     vendedor.rol = nuevoRol;
//     await vendedor.save();

//     console.log(`✅ Rol cambiado a "${nuevoRol}" para:`, vendedor.nombre);

//     res.status(200).json({
//       success: true,
//       message: `Rol cambiado a ${nuevoRol} exitosamente`,
//       data: {
//         _id: vendedor._id,
//         nombre: vendedor.nombre,
//         email: vendedor.email,
//         rol: vendedor.rol
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error al cambiar rol:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al cambiar rol del usuario',
//       error: error.message
//     });
//   }
// };

// // 🗑️ ELIMINAR VENDEDOR
// const eliminarVendedor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log('🗑️ Eliminando vendedor:', id);

//     const vendedor = await Usuario.findById(id);

//     if (!vendedor) {
//       return res.status(404).json({
//         success: false,
//         message: 'Vendedor no encontrado'
//       });
//     }

//     // No permitir eliminar admins
//     if (vendedor.rol === 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'No se puede eliminar a un administrador'
//       });
//     }

//     await Usuario.findByIdAndDelete(id);

//     console.log('✅ Vendedor eliminado exitosamente:', vendedor.nombre);

//     res.status(200).json({
//       success: true,
//       message: 'Vendedor eliminado exitosamente',
//       data: {
//         _id: vendedor._id,
//         nombre: vendedor.nombre
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error al eliminar vendedor:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error al eliminar vendedor',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   listarVendedores,
//   toggleFreeze,
//   cambiarRol,
//   eliminarVendedor

// };


// ============================================
// 📁 controller/vendedoractivoController.js - MEJORADO
// ============================================
const Usuario = require("../models/Usuario");
const ProductoAdmin = require("../models/ProductoAdmin");
const Producto = require("../models/Producto");
const nodemailer = require("nodemailer");

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AppGmail,
    pass: process.env.AppGmailPassword,
  },
});

// ============================================
// 📋 LISTAR VENDEDORES (con paginación)
// ============================================
exports.listarVendedores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Usuario.countDocuments({
      rol: { $in: ['vendedor', 'usuario'] }
    });

    const vendedores = await Usuario.find({
      rol: { $in: ['vendedor', 'usuario'] }
    })
      .select('nombre email rol whatsapp isVerified isFrozen createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: vendedores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error listando vendedores:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// 🎯 FUNCIÓN PRINCIPAL: Enviar productos a un vendedor específico
// ============================================
async function enviarProductosAVendedor(vendedor) {
  try {
    console.log(`\n🎯 Iniciando envío de productos a: ${vendedor.nombre}`);

    // 1️⃣ Obtener TODOS los productos admin
    const productosAdmin = await ProductoAdmin.find().lean();
    
    if (productosAdmin.length === 0) {
      console.log('⚠️ No hay productos admin para enviar');
      return { productosCreados: 0, productosEnviados: [] };
    }

    console.log(`📦 Se encontraron ${productosAdmin.length} productos admin`);

    // 2️⃣ Verificar qué productos ya tiene este vendedor
    const productosExistentes = await Producto.find({
      vendedorId: vendedor._id
    }).select('productoAdminId').lean();

    const idsProductosExistentes = new Set(
      productosExistentes.map(p => p.productoAdminId?.toString())
    );

    console.log(`📋 El vendedor ya tiene ${idsProductosExistentes.size} productos`);

    const productosCreados = [];

    // 3️⃣ Crear SOLO los productos que NO tiene
    for (const productoAdmin of productosAdmin) {
      const productoAdminId = productoAdmin._id.toString();

      // ✅ Saltar si ya tiene este producto
      if (idsProductosExistentes.has(productoAdminId)) {
        console.log(`   ⏭️  Producto ya existe: ${productoAdmin.nombre}`);
        continue;
      }

      // ✅ Crear nuevo producto personalizado para este vendedor
      const productoVendedor = new Producto({
        stock: productoAdmin.stock,
        codigo: `${productoAdmin.codigo}-${vendedor.nombre.replace(/\s/g, "")}`,
        nombre: productoAdmin.nombre,
        marca: productoAdmin.marca,
        descripcion: productoAdmin.descripcion,
        precio: productoAdmin.precioAdminFijo,
        precioFinal: productoAdmin.precioAdminFijo,
        precioAdminFijo: productoAdmin.precioAdminFijo,
        moneda: productoAdmin.moneda,
        descuento: 0,
        imagenUrl: productoAdmin.imagenUrl,
        categoria: productoAdmin.categoria,
        destacado: productoAdmin.destacado,
        whatsapp: vendedor.whatsapp || productoAdmin.whatsappAdmin || "",
        whatsappAdmin: productoAdmin.whatsappAdmin,
        recargos: {
          transporte: 0,
          margen: 0,
          otros: 0,
        },
        vendedorId: vendedor._id,
        productoAdminId: productoAdmin._id,
      });

      await productoVendedor.save();
      productosCreados.push(productoVendedor);
      console.log(`   ✅ Producto creado: ${productoAdmin.nombre}`);
    }

    console.log(`\n✅ Total de productos nuevos creados: ${productosCreados.length}`);

    // 4️⃣ Enviar email solo si se crearon nuevos productos
    if (productosCreados.length > 0) {
      await enviarEmailNuevosProductos(vendedor, productosCreados);
    } else {
      console.log('ℹ️  No se crearon productos nuevos, email no enviado');
    }

    return {
      productosCreados: productosCreados.length,
      productosEnviados: productosCreados
    };
  } catch (error) {
    console.error('❌ Error enviando productos:', error);
    throw error;
  }
}

// ============================================
// 📧 ENVIAR EMAIL CON LOS PRODUCTOS NUEVOS
// ============================================
async function enviarEmailNuevosProductos(vendedor, productos) {
  try {
    const listaProductos = productos
      .slice(0, 5)
      .map(p => `
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #667eea;">
          <h4 style="margin: 0; color: #667eea;">${p.nombre}</h4>
          <p style="margin: 5px 0; color: #666;">
            <strong>Código:</strong> ${p.codigo}<br>
            <strong>Marca:</strong> ${p.marca}<br>
            <strong>Precio:</strong> ${p.moneda === "ARS" ? "$" : "USD $"}${p.precioAdminFijo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}<br>
            <strong>Stock:</strong> ${p.stock} unidades
          </p>
        </div>
      `).join('');

    const mailOptions = {
      from: process.env.AppGmail,
      to: vendedor.email,
      subject: `🎉 ¡Bienvenido como Vendedor! ${productos.length} Productos Disponibles`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 20px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight-box { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
              color: white; 
              padding: 20px; 
              border-radius: 10px; 
              text-align: center; 
              margin: 20px 0; 
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Felicitaciones ${vendedor.nombre}!</h1>
              <p style="font-size: 18px;">Ahora eres vendedor oficial</p>
            </div>
            
            <div class="content">
              <div class="highlight-box">
                <h2 style="margin: 0;">📦 ${productos.length} Productos Nuevos</h2>
                <p style="margin: 10px 0;">Han sido añadidos a tu catálogo personal</p>
              </div>

              <h3 style="color: #667eea;">📋 Algunos de tus productos:</h3>
              ${listaProductos}
              
              ${productos.length > 5 ? `
                <div style="text-align: center; padding: 15px; background: #e0e7ff; border-radius: 8px;">
                  <strong style="color: #4f46e5;">Y ${productos.length - 5} productos más...</strong>
                </div>
              ` : ''}

              <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <strong style="color: #92400e;">💡 Importante:</strong>
                <p style="color: #92400e; margin: 10px 0 0 0;">
                  Estos productos son tuyos para editar. Puedes modificar precios, 
                  descuentos y recargos según tu estrategia de venta.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Sistema de Gestión Padel</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado a ${vendedor.email} con ${productos.length} productos`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email:`, error.message);
    return false;
  }
}

// ============================================
// 🔄 CAMBIAR ROL (usuario <-> vendedor)
// ============================================
exports.cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoRol } = req.body;

    if (!['usuario', 'vendedor'].includes(nuevoRol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "usuario" o "vendedor"'
      });
    }

    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const rolAnterior = usuario.rol;
    usuario.rol = nuevoRol;
    await usuario.save();

    // 🎯 SI SE CONVIRTIÓ EN VENDEDOR → ENVIAR PRODUCTOS
    let resultadoEnvio = null;
    if (nuevoRol === 'vendedor' && rolAnterior !== 'vendedor') {

      
      try {
        resultadoEnvio = await enviarProductosAVendedor(usuario);
        console.log(`✅ Envío completado: ${resultadoEnvio.productosCreados} productos`);
      } catch (error) {
        console.error('❌ Error en envío de productos:', error);
        // No fallar la operación completa si falla el envío
        resultadoEnvio = { productosCreados: 0, error: error.message };
      }
    }

    const mensaje = nuevoRol === 'vendedor' && resultadoEnvio
      ? `Rol actualizado a vendedor. ${resultadoEnvio.productosCreados} productos enviados exitosamente.`
      : 'Rol actualizado correctamente';

    res.json({
      success: true,
      data: {
        usuario: {
          _id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          whatsapp: usuario.whatsapp,
          isVerified: usuario.isVerified,
          isFrozen: usuario.isFrozen
        },
        productosEnviados: resultadoEnvio?.productosCreados || 0
      },
      message: mensaje
    });
  } catch (error) {
    console.error('❌ Error cambiando rol:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// 📤 REENVIAR PRODUCTOS MANUALMENTE
// ============================================
exports.enviarTodosProductos = async (req, res) => {
  try {
    const { id } = req.params;

    const vendedor = await Usuario.findById(id);
    
    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    if (vendedor.rol !== 'vendedor') {
      return res.status(400).json({
        success: false,
        message: 'El usuario debe tener rol de vendedor'
      });
    }

    const resultado = await enviarProductosAVendedor(vendedor);

    res.json({
      success: true,
      message: resultado.productosCreados > 0
        ? `${resultado.productosCreados} productos nuevos enviados a ${vendedor.nombre}`
        : `${vendedor.nombre} ya tiene todos los productos disponibles`,
      data: resultado
    });
  } catch (error) {
    console.error('❌ Error en reenvío manual:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// 🔄 TOGGLE FREEZE
// ============================================
exports.toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    usuario.isFrozen = !usuario.isFrozen;
    await usuario.save();

    console.log(`${usuario.isFrozen ? '❄️' : '☀️'} ${usuario.nombre} - Frozen: ${usuario.isFrozen}`);

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('❌ Error en toggleFreeze:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// 🗑️ ELIMINAR VENDEDOR
// ============================================
exports.eliminarVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByIdAndDelete(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Opcional: Eliminar también sus productos
    await Producto.deleteMany({ vendedorId: id });
    console.log(`🗑️ Usuario y productos eliminados: ${usuario.nombre}`);

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
