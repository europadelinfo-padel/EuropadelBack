// Controller: productosController.js
const ProductoAdmin = require("../models/ProductoAdmin");

exports.obtenerProductosParaVendedor = async (req, res) => {
  try {
    const vendedorId = req.user?.id;
    if (!vendedorId) return res.status(400).json({ success: false, message: "No se identificó al vendedor" });

    // Traer productos del admin
    const productosAdmin = await ProductoAdmin.find().sort({ createdAt: -1 });

    // Mapear para mostrar solo lo necesario
    const productosParaVendedor = productosAdmin.map(p => ({
      _id: p._id,
      nombre: p.nombre,
      codigo: p.codigo,
      marca: p.marca,
      descripcion: p.descripcion,
      categoria: p.categoria,
      // No envío precioAdminFijo, whatsappAdmin ni otros campos sensibles
      precio: p.precioVendedor || 0 // precio sugerido o calculado para este vendedor
    }));

    res.status(200).json({
      success: true,
      data: productosParaVendedor,
      count: productosParaVendedor.length
    });

  } catch (error) {
    console.error("Error al obtener productos para vendedor:", error);
    res.status(500).json({ success: false, message: "Error al obtener productos", error: error.message });
  }
};
