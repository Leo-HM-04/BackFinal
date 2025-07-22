const pool = require("../db/connection");

// Obtener todos los usuarios
const getAllUsuarios = async () => {
  const [rows] = await pool.query("SELECT id_usuario, nombre, email, rol, creado_en, bloqueado, activo FROM usuarios");
  return rows;
};

// Obtener un usuario por Rol
const getUsuarioByRol = async (rol) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE rol = ?", [rol]);
  return rows.length > 0 ? rows[0] : null;
};

// Obtener un usuario por ID
const getUsuarioById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id_usuario, nombre, email, rol, creado_en, bloqueado, activo FROM usuarios WHERE id_usuario = ?",
    [id]
  );
  return rows[0];
};

// Obtener un usuario por email (para validar duplicados)
const getUsuarioByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  return rows[0];
};

// Crear un nuevo usuario (puede marcarse como verificado y sin token)
const createUsuario = async (nombre, email, password, rol, email_token = null, verificado = true) => {
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, email, password, rol, email_token, verificado) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, email, password, rol, email_token, verificado]
  );
  return result.insertId;
};

// Actualizar un usuario (solo cambia la contraseña si se proporciona)
const updateUsuario = async (id, nombre, email, rol, password, bloqueado) => {
  let query = "UPDATE usuarios SET nombre = ?, email = ?, rol = ?, bloqueado = ?";
  const values = [nombre, email, rol, bloqueado];

  if (password && password.trim() !== "") {
    query += ", password = ?";
    values.push(password);
  }

  query += " WHERE id_usuario = ?";
  values.push(id);

  const [result] = await pool.query(query, values);
  return result.affectedRows;
};

// Eliminar un usuario
const deleteUsuario = async (id) => {
  const [result] = await pool.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
  return result.affectedRows;
};

// Exportar funciones
module.exports = {
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  getUsuarioByRol,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
