// ============================================
// 📁 scripts/hashPasswords.js
// ============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  rol: String,
  whatsapp: String,
  isVerified: Boolean
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', usuarioSchema);

async function hashPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const usuarios = await Usuario.find({});
    console.log(`📋 Encontrados ${usuarios.length} usuarios`);

    for (const usuario of usuarios) {
      // Verificar si ya está hasheada (las hasheadas tienen $2a$ o $2b$)
      if (usuario.password.startsWith('$2a$') || usuario.password.startsWith('$2b$')) {
        console.log(`⏭️  ${usuario.email} - Password ya hasheada`);
        continue;
      }

      console.log(`🔐 Hasheando password para: ${usuario.email}`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(usuario.password, salt);
      
      await Usuario.updateOne(
        { _id: usuario._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log(`✅ Password actualizada para: ${usuario.email}`);
    }

    console.log('✅ Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

hashPasswords();