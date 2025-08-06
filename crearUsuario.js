const bcrypt = require("bcrypt");
const pool = require("./db/connection");

// Datos del usuario administrador
const adminUser = {
  nombre: "Administrador Bechapra",
  email: "enrique.bechapra@gmail.com",
  password: "admin123",
  rol: "admin_general",
  verificado: 1,
};

async function crearUsuarioAdministrador() {
  console.log('🔹 Iniciando creación del usuario administrador...');
  
  try {
    // Verificar si ya existe un usuario con ese email o si ya existe un admin_general
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? OR rol = ?",
      [adminUser.email, "admin_general"]
    );

    if (rows.length > 0) {
      console.log(`⚠️ El usuario administrador ya existe (email: ${adminUser.email}).`);
      await pool.end();
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);

    // Insertar el usuario administrador
    await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol, verificado)
       VALUES (?, ?, ?, ?, ?)`,
      [adminUser.nombre, adminUser.email, hashedPassword, adminUser.rol, adminUser.verificado]
    );

    console.log(`✅ Usuario administrador creado exitosamente:`);
    console.log(`   📧 Email: ${adminUser.email}`);
    console.log(`   🔑 Password: ${adminUser.password}`);
    console.log(`   👤 Rol: ${adminUser.rol}`);
  } catch (error) {
    console.error(`❌ Error al crear el usuario administrador:`, error);
  } finally {
    // Cerrar la conexión a la base de datos
    await pool.end();
  }
}

// Ejecutar la función para crear el usuario administrador
crearUsuarioAdministrador();
