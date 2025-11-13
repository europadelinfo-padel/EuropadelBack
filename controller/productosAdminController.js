// const ProductoAdmin = require("../models/ProductoAdmin");
// const Producto = require("../models/Producto");
// const Usuario = require("../models/Usuario");
// const nodemailer = require("nodemailer");
// const cloudinary = require("cloudinary").v2;

// // Configurar Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configurar Nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.AppGmail,
//     pass: process.env.AppGmailPassword,
//   },
// });

// // Verificar configuración de email al iniciar
// transporter.verify(function (error, success) {
//   if (error) {
//     console.error("❌ Error en configuración de email:", error);
//   } else {
//     console.log("✅ Servidor de email listo para enviar mensajes");
//   }
// });

// // Obtener vendedores desde la base de datos
// const obtenerVendedores = async () => {
//   try {
//     const vendedores = await Usuario.find({
//       rol: "vendedor",
//       isVerified: true,
//     }).select("_id nombre email whatsapp");

//     console.log(
//       `📋 Se encontraron ${vendedores.length} vendedores verificados`
//     );

//     return vendedores.map((vendedor) => ({
//       id: vendedor._id, // ✅ AGREGADO: ID del vendedor
//       nombre: vendedor.nombre,
//       email: vendedor.email,
//       whatsapp: vendedor.whatsapp || null,
//     }));
//   } catch (error) {
//     console.error("Error obteniendo vendedores:", error);
//     return [];
//   }
// };

// // Función para enviar WhatsApp (simulado - requiere API de WhatsApp Business)
// const enviarWhatsApp = async (numero, mensaje) => {
//   try {
//     if (!numero) {
//       console.log("⚠️ No se puede enviar WhatsApp: número no proporcionado");
//       return false;
//     }

//     console.log(`📱 WhatsApp simulado enviado a ${numero}`);


//     return true;
//   } catch (error) {
//     console.error("Error enviando WhatsApp:", error);
//     return false;
//   }
// };

// // Función para enviar Email
// const enviarEmail = async (destinatario, producto) => {
//   try {
//     const mailOptions = {
//       from: process.env.AppGmail,
//       to: destinatario.email,
//       subject: `🆕 Nuevo Producto Disponible: ${producto.nombre}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//             .product-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//             .product-image { max-width: 100%; height: auto; border-radius: 10px; margin-bottom: 15px; }
//             .price-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 15px 0; }
//             .price { font-size: 32px; font-weight: bold; }
//             .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
//             .label { font-weight: bold; color: #667eea; }
//             .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
//             .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 10px 0; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>⭐ Nuevo Producto Disponible</h1>
//               <p>Hola ${
//                 destinatario.nombre
//               }, tenemos un nuevo producto para ti</p>
//             </div>
            
//             <div class="content">
//               <div class="product-card">
//                 ${
//                   producto.imagenUrl
//                     ? `<img src="${producto.imagenUrl}" alt="${producto.nombre}" class="product-image" />`
//                     : ""
//                 }
                
//                 <h2 style="color: #667eea; margin-top: 0;">${
//                   producto.nombre
//                 }</h2>
                
//                 <div class="detail-row">
//                   <span class="label">Código:</span>
//                   <span>${producto.codigo}</span>
//                 </div>
                
//                 <div class="detail-row">
//                   <span class="label">Marca:</span>
//                   <span>${producto.marca}</span>
//                 </div>
                
//                 <div class="detail-row">
//                   <span class="label">Categoría:</span>
//                   <span style="text-transform: capitalize;">${
//                     producto.categoria
//                   }</span>
//                 </div>
                
//                 <div class="detail-row">
//                   <span class="label">Stock Disponible:</span>
//                   <span style="color: ${
//                     producto.stock > 5
//                       ? "#10b981"
//                       : producto.stock > 0
//                       ? "#f59e0b"
//                       : "#ef4444"
//                   }; font-weight: bold;">${producto.stock} unidades</span>
//                 </div>
                
//                 <div class="price-box">
//                   <div style="font-size: 14px; margin-bottom: 5px;">Precio Fijo para Vendedores</div>
//                   <div class="price">${
//                     producto.moneda === "ARS" ? "$" : "USD $"
//                   }${producto.precioAdminFijo.toLocaleString("es-AR", {
//         minimumFractionDigits: 2,
//       })}</div>
//                   <div style="font-size: 12px; margin-top: 5px;">Moneda: ${
//                     producto.moneda
//                   }</div>
//                 </div>
                
//                 <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #667eea;">
//                   <strong style="color: #667eea;">Descripción:</strong>
//                   <p style="margin: 10px 0 0 0;">${producto.descripcion}</p>
//                 </div>
                
//                 ${
//                   producto.destacado
//                     ? `
//                 <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #78350f; padding: 10px; border-radius: 10px; text-align: center; font-weight: bold;">
//                   ⭐ PRODUCTO DESTACADO ⭐
//                 </div>
//                 `
//                     : ""
//                 }
                
//                 <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
//                   <strong style="color: #92400e;">💡 Importante:</strong>
//                   <p style="margin: 10px 0 0 0; color: #92400e;">Este es el precio base establecido por el administrador. Puedes aplicar tus propios descuentos y recargos según tu estrategia de venta.</p>
//                 </div>
                
//                 <div style="text-align: center; margin-top: 20px;">
//                   <a href="https://europadel-front-lemon.vercel.app/login" class="button">Ver en Mi Panel de Vendedor</a>
//                 </div>
//               </div>
              
//               <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
//                 <h3 style="color: #667eea; margin-top: 0;">📞 Información de Contacto Admin</h3>
//                 <p><strong>WhatsApp:</strong> ${producto.whatsappAdmin}</p>
//                 <p style="margin-top: 10px; color: #666; font-size: 14px;">Si tienes alguna pregunta sobre este producto, no dudes en contactar al administrador.</p>
//               </div>
//             </div>
            
//             <div class="footer">
//               <p>Este es un correo automático del sistema de gestión de productos.</p>
//               <p>© ${new Date().getFullYear()} Sistema de Gestión Padel. Todos los derechos reservados.</p>
//               <p style="color: #999; margin-top: 10px;">Fecha de envío: ${new Date().toLocaleString(
//                 "es-AR"
//               )}</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Email enviado exitosamente a ${destinatario.email}`);
//     return true;
//   } catch (error) {
//     console.error(
//       `❌ Error enviando email a ${destinatario.email}:`,
//       error.message
//     );
//     return false;
//   }
// };

// // Notificar a vendedores
// const notificarVendedores = async (producto) => {
//   const whatsappEnviados = [];
//   const emailsEnviados = [];
//   const errores = [];

//   // Obtener vendedores desde la base de datos
//   const vendedores = await obtenerVendedores();

//   if (vendedores.length === 0) {
//     console.log(
//       "⚠️ No se encontraron vendedores verificados en la base de datos"
//     );
//     return {
//       whatsappEnviados,
//       emailsEnviados,
//       errores: ["No se encontraron vendedores verificados"],
//     };
//   }

//   console.log(
//     `📧 Iniciando notificaciones a ${vendedores.length} vendedores...`
//   );

//   const mensaje =
//     `🆕 *Nuevo Producto Disponible*\n\n` +
//     `📦 *${producto.nombre}*\n` +
//     `🏷️ Código: ${producto.codigo}\n` +
//     `🔖 Marca: ${producto.marca}\n` +
//     `📂 Categoría: ${producto.categoria}\n` +
//     `💰 Precio: ${
//       producto.moneda === "ARS" ? "$" : "USD $"
//     }${producto.precioAdminFijo.toLocaleString("es-AR")}\n` +
//     `📦 Stock: ${producto.stock} unidades\n` +
//     `${producto.destacado ? "⭐ *PRODUCTO DESTACADO*\n" : ""}` +
//     `\n📝 ${producto.descripcion}\n\n` +
//     `📞 Contacto Admin: ${producto.whatsappAdmin}`;

//   // Intentar enviar WhatsApp (solo a vendedores que tengan número)
//   for (const vendedor of vendedores) {
//     if (vendedor.whatsapp) {
//       const enviado = await enviarWhatsApp(vendedor.whatsapp, mensaje);
//       if (enviado) {
//         whatsappEnviados.push(vendedor.whatsapp);
//       } else {
//         errores.push(`Error enviando WhatsApp a ${vendedor.nombre}`);
//       }
//     }
//   }

//   // Enviar emails a TODOS los vendedores
//   for (const vendedor of vendedores) {
//     const enviado = await enviarEmail(vendedor, producto);
//     if (enviado) {
//       emailsEnviados.push(vendedor.email);
//     } else {
//       errores.push(
//         `Error enviando email a ${vendedor.nombre} (${vendedor.email})`
//       );
//     }
//   }
//   console.log(`✅ Notificaciones completadas:`);
//   return {
//     whatsappEnviados,
//     emailsEnviados,
//     errores,
//   };
// };

// // ✅ FUNCIÓN CORREGIDA: Crear producto en la base de vendedores
// const crearProductoVendedores = async (productoAdmin) => {
//   try {
//     const vendedores = await obtenerVendedores();

//     if (vendedores.length === 0) {
//       console.log("⚠️ No se encontraron vendedores para crear productos");
//       return [];
//     }

//     console.log(`🏭 Creando productos para ${vendedores.length} vendedores...`);
//     const productosCreados = [];

//     for (const vendedor of vendedores) {
//       const productoVendedor = new Producto({
//         // ✅ Campos básicos
//         stock: productoAdmin.stock,
//         codigo: `${productoAdmin.codigo}-${vendedor.nombre.replace(/\s/g, "")}`,
//         nombre: productoAdmin.nombre,
//         marca: productoAdmin.marca,
//         descripcion: productoAdmin.descripcion,

//         // ✅ Precios
//         precio: productoAdmin.precioAdminFijo,
//         precioFinal: productoAdmin.precioAdminFijo,
//         precioAdminFijo: productoAdmin.precioAdminFijo, // ✅ AGREGADO
//         moneda: productoAdmin.moneda,
//         descuento: 0,

//         // ✅ Otros campos
//         imagenUrl: productoAdmin.imagenUrl,
//         categoria: productoAdmin.categoria,
//         destacado: productoAdmin.destacado,

//         // ✅ WhatsApp - usar el del vendedor si existe, si no el del admin
//         whatsapp: vendedor.whatsapp || productoAdmin.whatsappAdmin || "",
//         whatsappAdmin: productoAdmin.whatsappAdmin, // ✅ AGREGADO

//         // ✅ Recargos
//         recargos: {
//           transporte: 0,
//           margen: 0,
//           otros: 0,
//         },

//         // ✅ IDs de relación - CAMPOS CRÍTICOS QUE FALTABAN
//         vendedorId: vendedor.id, // ✅ AGREGADO
//         productoAdminId: productoAdmin._id, // ✅ AGREGADO
//       });

//       await productoVendedor.save();
//       productosCreados.push(productoVendedor);
//       console.log(`   ✅ Producto creado para ${vendedor.nombre}`);
//     }

//     console.log(
//       `✅ ${productosCreados.length} productos creados exitosamente para vendedores`
//     );
//     return productosCreados;
//   } catch (error) {
//     console.error("❌ Error creando productos para vendedores:", error);
//     throw error;
//   }
// };

// // ============================================
// // 📁 controller/productosAdminController.js
// // ============================================
// exports.obtenerProductos = async (req, res) => {
//   try {
//     console.log('📦 Usuario solicitando productos');

//     let productos;

//     if (req.user.rol === 'admin') {
//       // ✅ Admin ve TODOS los productos de ambas colecciones
//       const productosAdmin = await ProductoAdmin.find().lean();
//       const productosVendedores = await Producto.find().lean();
      
//       // Normalizar productos admin
//       const productosAdminNormalizados = productosAdmin.map(p => ({
//         ...p,
//         precio: p.precioAdminFijo || p.precio || 0,
//         precioFinal: p.precioAdminFijo || p.precio || 0,
//         productoAdmin: true,
//         productoVendedor: false
//       }));
      
//       // Normalizar productos vendedores
//       const productosVendedoresNormalizados = productosVendedores.map(p => ({
//         ...p,
//         productoAdmin: false,
//         productoVendedor: true
//       }));
      
//       // Combinar ambos
//       productos = [...productosAdminNormalizados, ...productosVendedoresNormalizados];
      
//       console.log(`✅ Admin obtuvo ${productos.length} productos (${productosAdminNormalizados.length} admin + ${productosVendedoresNormalizados.length} vendedores)`);
//     } else {
//       return res.status(403).json({
//         success: false,
//         message: 'Acceso denegado: Solo administradores'
//       });
//     }

//     res.json({ success: true, data: productos });
//   } catch (error) {
//     console.error('❌ Error en obtenerProductos:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// // controllers/productosAdminController.js
// exports.obtenerProductosAdmin = async (req, res) => {
//   try {
//     console.log('📦 Obteniendo SOLO productos admin');

//     // Verificar que sea admin
//     if (req.user.rol !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Acceso denegado: Solo administradores'
//       });
//     }

//     // ✅ Traer todos los productos admin
//     const productosAdmin = await ProductoAdmin.find().lean();
//     console.log(`✅ ${productosAdmin.length} productos admin encontrados`);

//     res.json({ 
//       success: true, 
//       data: productosAdmin 
//     });
//   } catch (error) {
//     console.error('❌ Error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };



// // Crear producto
// exports.crearProducto = async (req, res) => {
//   try {
//     let imagenUrl = "";

//     // Subir imagen a Cloudinary si existe
//     if (req.body.imagen) {
//       const uploadResult = await cloudinary.uploader.upload(req.body.imagen, {
//         folder: "productos-admin",
//         transformation: [{ width: 800, height: 800, crop: "limit" }],
//       });
//       imagenUrl = uploadResult.secure_url;
//     }

//     // Crear producto del admin
//     const nuevoProducto = new ProductoAdmin({
//       stock: req.body.stock,
//       codigo: req.body.codigo,
//       nombre: req.body.nombre,
//       marca: req.body.marca,
//       descripcion: req.body.descripcion,
//       precioAdminFijo: req.body.precioAdminFijo,
//       moneda: req.body.moneda,
//       imagenUrl: imagenUrl,
//       categoria: req.body.categoria,
//       destacado: req.body.destacado,
//       soloVendedores: true,
//       soloUsuarios: false,
//       whatsappAdmin: req.body.whatsappAdmin,
//     });

//     await nuevoProducto.save();
//     console.log(`✅ Producto Admin creado: ${nuevoProducto.nombre}`);

//     // Crear productos para vendedores
//     const productosCreados = await crearProductoVendedores(nuevoProducto);

//     // Notificar a vendedores
//     const notificaciones = await notificarVendedores(nuevoProducto);

//     res.json({
//       success: true,
//       data: nuevoProducto,
//       notificaciones: {
//         success: true,
//         message: `Producto creado y notificado a ${notificaciones.emailsEnviados.length} vendedores`,
//         whatsappEnviados: notificaciones.whatsappEnviados,
//         emailsEnviados: notificaciones.emailsEnviados,
//         errores: notificaciones.errores,
//         productosVendedoresCreados: productosCreados.length,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error en crearProducto:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Actualizar producto
// exports.actualizarProducto = async (req, res) => {
//   try {
//     const { id, imagen, ...datosActualizados } = req.body;

//     // Actualizar imagen si se envió una nueva
//     if (imagen && imagen.startsWith("data:image")) {
//       const uploadResult = await cloudinary.uploader.upload(imagen, {
//         folder: "productos-admin",
//         transformation: [{ width: 800, height: 800, crop: "limit" }],
//       });
//       datosActualizados.imagenUrl = uploadResult.secure_url;
//     }

//     const productoActualizado = await ProductoAdmin.findByIdAndUpdate(
//       id,
//       datosActualizados,
//       { new: true, runValidators: true }
//     );

//     if (!productoActualizado) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Producto no encontrado" });
//     }

//     res.json({ success: true, data: productoActualizado });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Eliminar producto
// exports.eliminarProducto = async (req, res) => {
//   try {
//     const { id } = req.query;
//     const producto = await ProductoAdmin.findByIdAndDelete(id);

//     if (!producto) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Producto no encontrado" });
//     }

//     res.json({ success: true, message: "Producto eliminado correctamente" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const ProductoAdmin = require("../models/ProductoAdmin");
const ProductoUsuario = require('../models/ProductoUsuario');
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AppGmail,
    pass: process.env.AppGmailPassword,
  },
});

// Verificar configuración de email al iniciar
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Error en configuración de email:", error);
  } else {
    console.log("✅ Servidor de email listo para enviar mensajes");
  }
});

// Obtener vendedores desde la base de datos
const obtenerVendedores = async () => {
  try {
    const vendedores = await Usuario.find({
      rol: "vendedor",
      isVerified: true,
    }).select("_id nombre email whatsapp");

    console.log(`📋 Se encontraron ${vendedores.length} vendedores verificados`);

    return vendedores.map((vendedor) => ({
      id: vendedor._id,
      nombre: vendedor.nombre,
      email: vendedor.email,
      whatsapp: vendedor.whatsapp || null,
    }));
  } catch (error) {
    console.error("Error obteniendo vendedores:", error);
    return [];
  }
};

// Función para enviar WhatsApp (simulado)
const enviarWhatsApp = async (numero, mensaje) => {
  try {
    if (!numero) {
      console.log("⚠️ No se puede enviar WhatsApp: número no proporcionado");
      return false;
    }
    console.log(`📱 WhatsApp simulado enviado a ${numero}`);
    return true;
  } catch (error) {
    console.error("Error enviando WhatsApp:", error);
    return false;
  }
};

// Función para enviar Email
const enviarEmail = async (destinatario, producto, tipo = "nuevo") => {
  try {
    let subject = "";
    let accion = "";
    
    switch(tipo) {
      case "nuevo":
        subject = `🆕 Nuevo Producto Disponible: ${producto.nombre}`;
        accion = "Un nuevo producto ha sido agregado";
        break;
      case "actualizado":
        subject = `🔄 Producto Actualizado: ${producto.nombre}`;
        accion = "Un producto ha sido actualizado";
        break;
      case "eliminado":
        subject = `🗑️ Producto Eliminado: ${producto.nombre}`;
        accion = "Un producto ha sido eliminado";
        break;
    }

    const mailOptions = {
      from: process.env.AppGmail,
      to: destinatario.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .product-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .product-image { max-width: 100%; height: auto; border-radius: 10px; margin-bottom: 15px; }
            .price-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 15px 0; }
            .price { font-size: 32px; font-weight: bold; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .alert { background: ${tipo === 'eliminado' ? '#fee2e2' : '#dbeafe'}; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid ${tipo === 'eliminado' ? '#ef4444' : '#3b82f6'}; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${tipo === 'nuevo' ? '🆕' : tipo === 'actualizado' ? '🔄' : '🗑️'} ${accion}</h1>
              <p>Hola ${destinatario.nombre}</p>
            </div>
            
            <div class="content">
              ${tipo === 'eliminado' ? `
                <div class="alert">
                  <strong>⚠️ Producto Eliminado</strong>
                  <p>El siguiente producto ha sido eliminado del catálogo por el administrador. El producto asociado en tu panel también ha sido eliminado automáticamente.</p>
                </div>
              ` : ''}
              
              <div class="product-card">
                ${producto.imagenUrl && tipo !== 'eliminado' ? `<img src="${producto.imagenUrl}" alt="${producto.nombre}" class="product-image" />` : ''}
                
                <h2 style="color: #667eea; margin-top: 0;">${producto.nombre}</h2>
                
                <div class="detail-row">
                  <span class="label">Código:</span>
                  <span>${producto.codigo}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Marca:</span>
                  <span>${producto.marca}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Categoría:</span>
                  <span style="text-transform: capitalize;">${producto.categoria}</span>
                </div>
                
                ${tipo !== 'eliminado' ? `
                  <div class="detail-row">
                    <span class="label">Stock Disponible:</span>
                    <span style="color: ${producto.stock > 5 ? '#10b981' : producto.stock > 0 ? '#f59e0b' : '#ef4444'}; font-weight: bold;">${producto.stock} unidades</span>
                  </div>
                  
                  <div class="price-box">
                    <div style="font-size: 14px; margin-bottom: 5px;">Precio Fijo para Vendedores</div>
                    <div class="price">${producto.moneda === 'ARS' ? '$' : 'USD $'}${producto.precioAdminFijo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
                    <div style="font-size: 12px; margin-top: 5px;">Moneda: ${producto.moneda}</div>
                  </div>
                  
                  <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #667eea;">
                    <strong style="color: #667eea;">Descripción:</strong>
                    <p style="margin: 10px 0 0 0;">${producto.descripcion}</p>
                  </div>
                  
                  ${producto.destacado ? `
                    <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #78350f; padding: 10px; border-radius: 10px; text-align: center; font-weight: bold;">
                      ⭐ PRODUCTO DESTACADO ⭐
                    </div>
                  ` : ''}
                  
                  ${tipo === 'actualizado' ? `
                    <div class="alert">
                      <strong>🔄 Cambios Aplicados</strong>
                      <p>El producto en tu panel ha sido actualizado automáticamente con la información más reciente del administrador.</p>
                    </div>
                  ` : ''}
                ` : ''}
              </div>
              
              ${tipo !== 'eliminado' ? `
                <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
                  <h3 style="color: #667eea; margin-top: 0;">📞 Información de Contacto Admin</h3>
                  <p><strong>WhatsApp:</strong> ${producto.whatsappAdmin}</p>
                  <p style="margin-top: 10px; color: #666; font-size: 14px;">Si tienes alguna pregunta sobre este producto, no dudes en contactar al administrador.</p>
                </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p>Este es un correo automático del sistema de gestión de productos.</p>
              <p>© ${new Date().getFullYear()} Sistema de Gestión Padel. Todos los derechos reservados.</p>
              <p style="color: #999; margin-top: 10px;">Fecha de envío: ${new Date().toLocaleString('es-AR')}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email ${tipo} enviado a ${destinatario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${destinatario.email}:`, error.message);
    return false;
  }
};

// Notificar a vendedores
const notificarVendedores = async (producto, tipo = "nuevo") => {
  const whatsappEnviados = [];
  const emailsEnviados = [];
  const errores = [];

  const vendedores = await obtenerVendedores();

  if (vendedores.length === 0) {
    console.log("⚠️ No se encontraron vendedores verificados");
    return { whatsappEnviados, emailsEnviados, errores: ["No hay vendedores"] };
  }

  console.log(`📧 Notificando ${tipo} a ${vendedores.length} vendedores...`);

  let accionEmoji = tipo === 'nuevo' ? '🆕' : tipo === 'actualizado' ? '🔄' : '🗑️';
  let accionTexto = tipo === 'nuevo' ? 'Nuevo Producto' : tipo === 'actualizado' ? 'Producto Actualizado' : 'Producto Eliminado';

  const mensaje =
    `${accionEmoji} *${accionTexto}*\n\n` +
    `📦 *${producto.nombre}*\n` +
    `🏷️ Código: ${producto.codigo}\n` +
    `🔖 Marca: ${producto.marca}\n` +
    `📂 Categoría: ${producto.categoria}\n` +
    `${tipo !== 'eliminado' ? `💰 Precio: ${producto.moneda === 'ARS' ? '$' : 'USD $'}${producto.precioAdminFijo.toLocaleString('es-AR')}\n` : ''}` +
    `${tipo !== 'eliminado' ? `📦 Stock: ${producto.stock} unidades\n` : ''}` +
    `${producto.destacado && tipo !== 'eliminado' ? '⭐ *PRODUCTO DESTACADO*\n' : ''}` +
    `${tipo !== 'eliminado' ? `\n📝 ${producto.descripcion}\n` : ''}` +
    `\n${tipo === 'eliminado' ? '⚠️ Este producto ha sido eliminado de tu catálogo\n' : ''}` +
    `📞 Contacto Admin: ${producto.whatsappAdmin}`;

  // WhatsApp
  for (const vendedor of vendedores) {
    if (vendedor.whatsapp) {
      const enviado = await enviarWhatsApp(vendedor.whatsapp, mensaje);
      if (enviado) whatsappEnviados.push(vendedor.whatsapp);
      else errores.push(`Error WhatsApp a ${vendedor.nombre}`);
    }
  }

  // Emails
  for (const vendedor of vendedores) {
    const enviado = await enviarEmail(vendedor, producto, tipo);
    if (enviado) emailsEnviados.push(vendedor.email);
    else errores.push(`Error email a ${vendedor.email}`);
  }

  return { whatsappEnviados, emailsEnviados, errores };
};

// ✅ Crear productos para vendedores
const crearProductoVendedores = async (productoAdmin) => {
  try {
    const vendedores = await obtenerVendedores();
    if (vendedores.length === 0) {
      console.log("⚠️ No hay vendedores para crear productos");
      return [];
    }

    console.log(`🏭 Creando productos para ${vendedores.length} vendedores...`);
    const productosCreados = [];

    for (const vendedor of vendedores) {
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
        recargos: { transporte: 0, margen: 0, otros: 0 },
        vendedorId: vendedor.id,
        productoAdminId: productoAdmin._id,
      });

      await productoVendedor.save();
      productosCreados.push(productoVendedor);
      console.log(`   ✅ Producto creado para ${vendedor.nombre}`);
    }

    console.log(`✅ ${productosCreados.length} productos creados`);
    return productosCreados;
  } catch (error) {
    console.error("❌ Error creando productos:", error);
    throw error;
  }
};


const actualizarProductosVendedores = async (productoAdmin) => {
  try {
    console.log(`🔄 Actualizando productos de vendedores para producto admin: ${productoAdmin._id}`);

    // 1️⃣ Buscar TODOS los productos de vendedores vinculados
    const productosVendedores = await Producto.find({ 
      productoAdminId: productoAdmin._id 
    });

    if (productosVendedores.length === 0) {
      console.log('ℹ️ No hay productos de vendedores para actualizar');
      return 0;
    }

    let productosActualizados = 0;

    // 2️⃣ Actualizar cada producto INDIVIDUALMENTE para recalcular precios
    for (const productoVendedor of productosVendedores) {
      console.log(`\n📦 Actualizando producto vendedor: ${productoVendedor._id}`);
      console.log(`   Precio admin anterior: ${productoVendedor.precioAdminFijo}`);
      console.log(`   Precio admin nuevo: ${productoAdmin.precioAdminFijo}`);
      console.log(`   Descuento vendedor: ${productoVendedor.descuento}%`);
      console.log(`   Recargos vendedor: T:${productoVendedor.recargos.transporte}% M:${productoVendedor.recargos.margen}% O:${productoVendedor.recargos.otros}%`);

      // 3️⃣ RECALCULAR precio final con la configuración del vendedor
      const nuevoPrecioBase = productoAdmin.precioAdminFijo;
      
      // Aplicar descuento
      const precioConDescuento = nuevoPrecioBase * (1 - (productoVendedor.descuento / 100));
      
      // Aplicar recargos
      const totalRecargos = 
        (productoVendedor.recargos?.transporte || 0) + 
        (productoVendedor.recargos?.margen || 0) + 
        (productoVendedor.recargos?.otros || 0);
      
      const nuevoPrecioFinal = precioConDescuento * (1 + (totalRecargos / 100));

      console.log(`   💰 Precio final recalculado: ${nuevoPrecioFinal.toFixed(2)}`);

      // 4️⃣ Actualizar el producto con el nuevo precio base y precio final recalculado
      await Producto.findByIdAndUpdate(
        productoVendedor._id,
        {
          $set: {
            // ✅ Actualizar campos del admin
            stock: productoAdmin.stock,
            nombre: productoAdmin.nombre,
            marca: productoAdmin.marca,
            descripcion: productoAdmin.descripcion,
            moneda: productoAdmin.moneda,
            imagenUrl: productoAdmin.imagenUrl,
            categoria: productoAdmin.categoria,
            destacado: productoAdmin.destacado,
            whatsappAdmin: productoAdmin.whatsappAdmin,
            precio: nuevoPrecioBase,
            precioAdminFijo: nuevoPrecioBase,
            precioFinal: nuevoPrecioFinal,
          }
          // ⚠️ NO tocamos: descuento, recargos, userWhatsapp (son del vendedor)
        },
        { runValidators: true }
      );

      productosActualizados++;
    }

    console.log(`\n✅ ${productosActualizados} productos de vendedores actualizados con precios recalculados`);
    return productosActualizados;
    
  } catch (error) {
    console.error("❌ Error actualizando productos de vendedores:", error);
    throw error;
  }
};

// ✅ NUEVO: Eliminar productos de vendedores
const eliminarProductosVendedores = async (productoAdminId) => {
  try {
    console.log(`🗑️ Eliminando productos de vendedores para producto admin: ${productoAdminId}`);

    const resultado = await Producto.deleteMany({
      productoAdminId: productoAdminId
    });

    console.log(`✅ ${resultado.deletedCount} productos de vendedores eliminados`);
    return resultado.deletedCount;
  } catch (error) {
    console.error("❌ Error eliminando productos de vendedores:", error);
    throw error;
  }
};

// ============================================
// CONTROLADORES
// ============================================

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    console.log('📦 Usuario solicitando productos');

    let productos;

    if (req.user.rol === 'admin') {
      const productosAdmin = await ProductoAdmin.find().lean();
      const productosVendedores = await Producto.find().lean();
      
      const productosAdminNormalizados = productosAdmin.map(p => ({
        ...p,
        precio: p.precioAdminFijo || p.precio || 0,
        precioFinal: p.precioAdminFijo || p.precio || 0,
        productoAdmin: true,
        productoVendedor: false
      }));
      
      const productosVendedoresNormalizados = productosVendedores.map(p => ({
        ...p,
        productoAdmin: false,
        productoVendedor: true
      }));
      
      productos = [...productosAdminNormalizados, ...productosVendedoresNormalizados];
      
      console.log(`✅ Admin obtuvo ${productos.length} productos`);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: Solo administradores'
      });
    }

    res.json({ success: true, data: productos });
  } catch (error) {
    console.error('❌ Error en obtenerProductos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener solo productos admin
exports.obtenerProductosAdmin = async (req, res) => {
  try {
    console.log('📦 Obteniendo SOLO productos admin');

    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: Solo administradores'
      });
    }

    const productosAdmin = await ProductoAdmin.find().lean();
    console.log(`✅ ${productosAdmin.length} productos admin encontrados`);

    res.json({ success: true, data: productosAdmin });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Crear producto
exports.crearProducto = async (req, res) => {
  try {
    let imagenUrl = "";

    if (req.body.imagen) {
      const uploadResult = await cloudinary.uploader.upload(req.body.imagen, {
        folder: "productos-admin",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      imagenUrl = uploadResult.secure_url;
    }

    const nuevoProducto = new ProductoAdmin({
      stock: req.body.stock,
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      marca: req.body.marca,
      descripcion: req.body.descripcion,
      precioAdminFijo: req.body.precioAdminFijo,
      moneda: req.body.moneda,
      imagenUrl: imagenUrl,
      categoria: req.body.categoria,
      destacado: req.body.destacado,
      soloVendedores: true,
      soloUsuarios: false,
      whatsappAdmin: req.body.whatsappAdmin,
    });

    await nuevoProducto.save();
    console.log(`✅ Producto Admin creado: ${nuevoProducto.nombre}`);

    const productosCreados = await crearProductoVendedores(nuevoProducto);
    const notificaciones = await notificarVendedores(nuevoProducto, "nuevo");

    res.json({
      success: true,
      data: nuevoProducto,
      notificaciones: {
        success: true,
        message: `Producto creado y notificado a ${notificaciones.emailsEnviados.length} vendedores`,
        whatsappEnviados: notificaciones.whatsappEnviados,
        emailsEnviados: notificaciones.emailsEnviados,
        errores: notificaciones.errores,
        productosVendedoresCreados: productosCreados.length,
      },
    });
  } catch (error) {
    console.error("❌ Error en crearProducto:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Actualizar producto (CON SINCRONIZACIÓN)
exports.actualizarProducto = async (req, res) => {
  try {
    const { id, imagen, ...datosActualizados } = req.body;

    // Subir imagen si existe
    if (imagen && imagen.startsWith("data:image")) {
      const uploadResult = await cloudinary.uploader.upload(imagen, {
        folder: "productos-admin",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      datosActualizados.imagenUrl = uploadResult.secure_url;
    }

    // 1️⃣ Actualizar producto admin
    const productoActualizado = await ProductoAdmin.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ 
        success: false, 
        message: "Producto no encontrado" 
      });
    }

    console.log(`✅ Producto Admin actualizado: ${productoActualizado.nombre}`);
    console.log(`   Precio Admin nuevo: ${productoActualizado.precioAdminFijo}`);

    // 2️⃣ Actualizar productos de vendedores (con precios recalculados)
    const productosVendedoresActualizados = await actualizarProductosVendedores(
      productoActualizado
    );

    // 3️⃣ ⚠️ CRÍTICO: Actualizar productos PÚBLICOS después de actualizar vendedores
    const productosPublicosActualizados = await actualizarProductosPublicos(
      productoActualizado._id
    );

    // 4️⃣ Notificar vendedores
    const notificaciones = await notificarVendedores(
      productoActualizado, 
      "actualizado"
    );

    // 5️⃣ Respuesta con toda la información
    res.json({
      success: true,
      data: productoActualizado,
      sincronizacion: {
        productosVendedoresActualizados: productosVendedoresActualizados,
        productosPublicosActualizados: productosPublicosActualizados, // ← NUEVO
        mensaje: `Se actualizaron ${productosVendedoresActualizados} productos de vendedores y ${productosPublicosActualizados} productos públicos`
      },
      notificaciones: {
        success: true,
        message: `Producto actualizado. ${productosVendedoresActualizados} productos de vendedores y ${productosPublicosActualizados} productos públicos sincronizados`,
        whatsappEnviados: notificaciones.whatsappEnviados,
        emailsEnviados: notificaciones.emailsEnviados,
        errores: notificaciones.errores,
      },
    });
  } catch (error) {
    console.error("❌ Error en actualizarProducto:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const actualizarProductosPublicos = async (productoAdminId) => {
  try {
    console.log(`\n🌍 Actualizando productos PÚBLICOS para admin: ${productoAdminId}`);

    // 1️⃣ Obtener todos los productos de vendedores actualizados
    const productosVendedores = await Producto.find({ 
      productoAdminId: productoAdminId 
    });

    if (productosVendedores.length === 0) {
      console.log('ℹ️ No hay productos de vendedores para sincronizar a público');
      return 0;
    }

    let productosPublicosActualizados = 0;

    // 2️⃣ Por cada producto de vendedor, actualizar su versión pública
    for (const productoVendedor of productosVendedores) {
      console.log(`\n📢 Sincronizando producto público: ${productoVendedor.nombre}`);
      console.log(`   Precio Admin Fijo: ${productoVendedor.precioAdminFijo}`);
      console.log(`   Precio Final Calculado: ${productoVendedor.precioFinal}`);

      // 3️⃣ Buscar el producto público correspondiente
      const productoPublico = await ProductoUsuario.findOne({
        productoVendedorId: productoVendedor._id
      });

      if (productoPublico) {
        // 4️⃣ Actualizar el producto público con los datos recalculados del vendedor
        await ProductoUsuario.findByIdAndUpdate(
          productoPublico._id,
          {
            $set: {
              // ✅ Datos básicos del admin
              codigo: productoVendedor.codigo,
              nombre: productoVendedor.nombre,
              marca: productoVendedor.marca,
              descripcion: productoVendedor.descripcion,
              moneda: productoVendedor.moneda,
              imagenUrl: productoVendedor.imagenUrl,
              categoria: productoVendedor.categoria,
              destacado: productoVendedor.destacado,
              whatsappAdmin: productoVendedor.whatsappAdmin,
              stock: productoVendedor.stock,
              
              // ✅ Precios RECALCULADOS del vendedor
              precio: productoVendedor.precio,
              precioAdminFijo: productoVendedor.precioAdminFijo,
              precioFinal: productoVendedor.precioFinal,
              
              // ✅ Configuración del vendedor
              descuento: productoVendedor.descuento,
              recargos: productoVendedor.recargos,
              userWhatsapp: productoVendedor.userWhatsapp,
            }
          },
          { runValidators: true }
        );

        console.log(`   ✅ Producto público actualizado con precio final: ${productoVendedor.precioFinal}`);
        productosPublicosActualizados++;
      } else {
        console.log(`   ⚠️ No se encontró producto público para vendedor ID: ${productoVendedor._id}`);
      }
    }

    console.log(`\n✅ ${productosPublicosActualizados} productos públicos actualizados`);
    return productosPublicosActualizados;
    
  } catch (error) {
    console.error("❌ Error actualizando productos públicos:", error);
    throw error;
  }
};

// ✅ Eliminar producto (CON SINCRONIZACIÓN)
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.query;
    
    // Primero obtener el producto para notificar
    const producto = await ProductoAdmin.findById(id);

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    console.log(`🗑️ Eliminando producto Admin: ${producto.nombre}`);

    // ✅ Eliminar productos de vendedores PRIMERO
    const productosEliminados = await eliminarProductosVendedores(id);

    // ✅ Notificar vendedores
    const notificaciones = await notificarVendedores(producto, "eliminado");

    // ✅ Eliminar producto admin
    await ProductoAdmin.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Producto eliminado correctamente",
      notificaciones: {
        success: true,
        message: `Producto eliminado. ${productosEliminados} productos de vendedores eliminados`,
        productosVendedoresEliminados: productosEliminados,
        whatsappEnviados: notificaciones.whatsappEnviados,
        emailsEnviados: notificaciones.emailsEnviados,
        errores: notificaciones.errores,
      },
    });
  } catch (error) {
    console.error("❌ Error en eliminarProducto:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
