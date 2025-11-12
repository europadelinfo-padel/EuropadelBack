// ============================================
// 📁 controllers/vendedoractivoController.js
// ============================================
const Usuario = require('../models/Usuario');

// 📋 LISTAR TODOS LOS VENDEDORES CON PAGINACIÓN
const listarVendedores = async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query; // 9 items (3x3 por página)
    const skip = (parseInt(page) - 1) * parseInt(limit);

    console.log('📋 Listando vendedores - Página:', page);

    // Buscar todos los usuarios (excluyendo admins)
    const vendedores = await Usuario.find({ rol: { $ne: 'admin' } })
      .select('nombre email rol whatsapp isVerified isFrozen createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Usuario.countDocuments({ rol: { $ne: 'admin' } });

    console.log(`✅ ${vendedores.length} vendedores encontrados de ${total} totales`);

    res.status(200).json({
      success: true,
      data: vendedores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Error al listar vendedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vendedores',
      error: error.message
    });
  }
};

// 🔄 CONGELAR/DESCONGELAR VENDEDOR
const toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔄 Cambiando estado freeze para usuario:', id);

    const vendedor = await Usuario.findById(id);

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    // No permitir congelar admins
    if (vendedor.rol === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No se puede congelar a un administrador'
      });
    }

    // Toggle del estado
    vendedor.isFrozen = !vendedor.isFrozen;
    await vendedor.save();

    console.log(`✅ Vendedor ${vendedor.isFrozen ? 'congelado' : 'descongelado'}:`, vendedor.nombre);

    res.status(200).json({
      success: true,
      message: `Vendedor ${vendedor.isFrozen ? 'congelado' : 'descongelado'} exitosamente`,
      data: {
        _id: vendedor._id,
        nombre: vendedor.nombre,
        isFrozen: vendedor.isFrozen
      }
    });
  } catch (error) {
    console.error('❌ Error al cambiar estado freeze:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del vendedor',
      error: error.message
    });
  }
};

// 🔄 CAMBIAR ROL (usuario <-> vendedor)
const cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoRol } = req.body;

    console.log('🔄 Cambiando rol para usuario:', id, 'Nuevo rol:', nuevoRol);

    // Validar que el nuevo rol sea válido
    if (!['usuario', 'vendedor'].includes(nuevoRol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Solo se permite "usuario" o "vendedor"'
      });
    }

    const vendedor = await Usuario.findById(id);

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir cambiar rol de admins
    if (vendedor.rol === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No se puede cambiar el rol de un administrador'
      });
    }

    // Actualizar rol
    vendedor.rol = nuevoRol;
    await vendedor.save();

    console.log(`✅ Rol cambiado a "${nuevoRol}" para:`, vendedor.nombre);

    res.status(200).json({
      success: true,
      message: `Rol cambiado a ${nuevoRol} exitosamente`,
      data: {
        _id: vendedor._id,
        nombre: vendedor.nombre,
        email: vendedor.email,
        rol: vendedor.rol
      }
    });
  } catch (error) {
    console.error('❌ Error al cambiar rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar rol del usuario',
      error: error.message
    });
  }
};

// 🗑️ ELIMINAR VENDEDOR
const eliminarVendedor = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Eliminando vendedor:', id);

    const vendedor = await Usuario.findById(id);

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    // No permitir eliminar admins
    if (vendedor.rol === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No se puede eliminar a un administrador'
      });
    }

    await Usuario.findByIdAndDelete(id);

    console.log('✅ Vendedor eliminado exitosamente:', vendedor.nombre);

    res.status(200).json({
      success: true,
      message: 'Vendedor eliminado exitosamente',
      data: {
        _id: vendedor._id,
        nombre: vendedor.nombre
      }
    });
  } catch (error) {
    console.error('❌ Error al eliminar vendedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar vendedor',
      error: error.message
    });
  }
};

module.exports = {
  listarVendedores,
  toggleFreeze,
  cambiarRol,
  eliminarVendedor
};