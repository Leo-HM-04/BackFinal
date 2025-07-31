const ViaticoModel = require("../models/viatico.model");
const NotificacionService = require("../services/notificacionesService");
const pool = require("../db/connection");
const Joi = require('joi');
const { registrarAccion } = require('../services/accionLogger');

exports.getViaticos = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;
    let viaticos = [];
    if (rol === "solicitante") {
      viaticos = await ViaticoModel.getPorUsuario(id_usuario);
    } else if (rol === "pagador_banca") {
      viaticos = await ViaticoModel.getAutorizadas();
    } else {
      viaticos = await ViaticoModel.getTodas();
    }
    res.json(viaticos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener viáticos" });
  }
};

exports.getViatico = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;
    const { id } = req.params;
    const viatico = await ViaticoModel.getPorId(id);
    if (!viatico) {
      return res.status(404).json({ error: "Viático no encontrado" });
    }
    if (rol === "solicitante" && viatico.id_usuario !== id_usuario) {
      return res.status(403).json({ error: "No tienes permiso para ver este viático" });
    }
    res.json(viatico);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el viático" });
  }
};

exports.createViatico = async (req, res) => {
  try {
    // Asegurar que req.body sea un objeto
    if (!req.body || typeof req.body !== 'object') req.body = {};
    // Si se sube archivo, asignar la ruta a viatico_url y eliminar viatico_url de req.body para evitar conflicto de tipos
    if (req.file) {
      req.body.viatico_url = `/uploads/viaticos/${req.file.filename}`;
    } else {
      // Si no hay archivo, asegurar que viatico_url sea string vacía o null
      req.body.viatico_url = req.body.viatico_url || '';
    }
    // Forzar el id_usuario autenticado
    req.body.id_usuario = req.user ? req.user.id_usuario : undefined;
    const schema = Joi.object({
      id_usuario: Joi.number().required(),
      departamento: Joi.string().required(),
      monto: Joi.number().positive().required(),
      cuenta_destino: Joi.string().required(),
      concepto: Joi.string().required(),
      tipo_pago: Joi.string().valid('viaticos').required(),
      fecha_limite_pago: Joi.date().required(),
      tipo_cuenta_destino: Joi.string().default('CLABE'),
      tipo_tarjeta: Joi.string().allow(null, ''),
      banco_destino: Joi.string().allow(null, ''),
      viatico_url: Joi.string().allow(null, ''),
      estado: Joi.string().valid('pendiente','autorizada','rechazada','pagada').default('pendiente'),
      comentario_aprobador: Joi.string().allow(null, ''),
      id_aprobador: Joi.number().allow(null),
      id_pagador: Joi.number().allow(null),
      fecha_revision: Joi.date().allow(null),
      fecha_pago: Joi.date().allow(null),
      folio: Joi.string().allow(null, ''),
    });
    const datos = await schema.validateAsync(req.body, { convert: true });
    const viatico = await ViaticoModel.crear(datos);
    if (!req.user) {
      console.error('No hay usuario autenticado en la petición');
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    await registrarAccion({ req, accion: 'crear', entidad: 'viatico', entidadId: viatico.id_viatico });
    res.status(201).json(viatico);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }

};

// Editar viático (igual que solicitudes)
exports.editarViatico = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario } = req.user;
    const esAdminGeneral = rol === "admin_general";
    // Si hay archivo, agregar viatico_url
    let viatico_url = null;
    if (req.file) {
      viatico_url = `/uploads/viaticos/${req.file.filename}`;
    }
    // Tomar todos los campos permitidos
    const {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      fecha_limite_pago,
      tipo_cuenta_destino,
      tipo_tarjeta,
      banco_destino
    } = req.body;
    const datos = {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      fecha_limite_pago,
      tipo_cuenta_destino,
      tipo_tarjeta,
      banco_destino
    };
    // Solo incluir viatico_url si hay archivo nuevo
    if (viatico_url) {
      datos.viatico_url = viatico_url;
    }
    const filas = await ViaticoModel.editarViaticoSiPendiente(
      id,
      id_usuario,
      datos,
      esAdminGeneral
    );
    if (filas === 0) {
      return res.status(400).json({
        error: "No se puede editar: El viático no está pendiente o no tienes permiso.",
      });
    }
    await registrarAccion({ req, accion: 'editar', entidad: 'viatico', entidadId: id });
    res.json({ message: "Viático editado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarViatico = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario } = req.user;
    const viatico = await ViaticoModel.getPorId(id);
    if (!viatico) {
      return res.status(404).json({ error: "Viático no encontrado" });
    }
    // Si es solicitante, solo puede eliminar si es suyo y está pendiente
    if (rol === "solicitante") {
      if (viatico.id_usuario !== id_usuario) {
        return res.status(403).json({ error: "No tienes permiso para eliminar este viático" });
      }
      if (String(viatico.estado).toLowerCase() !== "pendiente") {
        return res.status(403).json({ error: "Solo puedes eliminar viáticos en estado pendiente" });
      }
    }
    await ViaticoModel.eliminar(id);
    await registrarAccion({ req, accion: 'eliminar', entidad: 'viatico', entidadId: id });
    res.json({ message: "Viático eliminado" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Subir archivo de viático y actualizar viatico_url
exports.subirArchivoViatico = async (req, res) => {
  try {
    const { id_viatico } = req.body;
    if (!req.file || !id_viatico) {
      return res.status(400).json({ error: "Archivo y id_viatico requeridos" });
    }
    const ruta = `/uploads/viaticos/${req.file.filename}`;
    await ViaticoModel.actualizar(id_viatico, { viatico_url: ruta });
    await registrarAccion({ req, accion: 'subir', entidad: 'viatico', entidadId: id_viatico });
    res.json({ message: "Archivo subido", viatico_url: ruta });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Aprobar viático individual
exports.aprobarViatico = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario: id_aprobador } = req.user;
    const { comentario_aprobador = '' } = req.body;
    const filas = await ViaticoModel.actualizarEstado(id, 'autorizada', comentario_aprobador, id_aprobador);
    if (filas === 0) {
      return res.status(400).json({ error: 'No se puede aprobar: El viático no está pendiente o no existe.' });
    }
    // Notificar al solicitante
    const viatico = await ViaticoModel.getPorId(id);
    if (viatico && viatico.id_usuario) {
      await NotificacionService.crearNotificacion({
        id_usuario: viatico.id_usuario,
        mensaje: `Tu viático folio ${viatico.folio} fue <b>aprobado</b>.`,
        enviarWebSocket: true
      });
    }
    await registrarAccion({ req, accion: 'aprobar', entidad: 'viatico', entidadId: id });
    res.json({ message: 'Viático aprobado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Rechazar viático individual
exports.rechazarViatico = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario: id_aprobador } = req.user;
    const { comentario_aprobador = '' } = req.body;
    const filas = await ViaticoModel.actualizarEstado(id, 'rechazada', comentario_aprobador, id_aprobador);
    if (filas === 0) {
      return res.status(400).json({ error: 'No se puede rechazar: El viático no está pendiente o no existe.' });
    }
    // Notificar al solicitante
    const viatico = await ViaticoModel.getPorId(id);
    if (viatico && viatico.id_usuario) {
      await NotificacionService.crearNotificacion({
        id_usuario: viatico.id_usuario,
        mensaje: `Tu viático folio ${viatico.folio} fue <b>rechazado</b>.`,
        enviarWebSocket: true
      });
    }
    await registrarAccion({ req, accion: 'rechazar', entidad: 'viatico', entidadId: id });
    res.json({ message: 'Viático rechazado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Aprobar viáticos en lote
exports.aprobarLoteViaticos = async (req, res) => {
  try {
    const { ids = [], comentario_aprobador = '' } = req.body;
    const { id_usuario: id_aprobador } = req.user;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ error: 'Debes enviar un arreglo de IDs' });
    }
    const filas = await ViaticoModel.aprobarLote(ids, id_aprobador, comentario_aprobador);
    // Notificar a los solicitantes de los viáticos aprobados
    for (const id of ids) {
      const viatico = await ViaticoModel.getPorId(id);
      if (viatico && viatico.id_usuario) {
        await NotificacionService.crearNotificacion({
          id_usuario: viatico.id_usuario,
          mensaje: `Tu viático folio ${viatico.folio} fue <b>aprobado</b>.`,
          enviarWebSocket: true
        });
      }
    }
    await registrarAccion({ req, accion: 'aprobar-lote', entidad: 'viatico', entidadId: ids.join(',') });
    res.json({ message: `Se aprobaron ${filas} viáticos` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Rechazar viáticos en lote
exports.rechazarLoteViaticos = async (req, res) => {
  try {
    const { ids = [], comentario_aprobador = '' } = req.body;
    const { id_usuario: id_aprobador } = req.user;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ error: 'Debes enviar un arreglo de IDs' });
    }
    const filas = await ViaticoModel.rechazarLote(ids, id_aprobador, comentario_aprobador);
    // Notificar a los solicitantes de los viáticos rechazados
    for (const id of ids) {
      const viatico = await ViaticoModel.getPorId(id);
      if (viatico && viatico.id_usuario) {
        await NotificacionService.crearNotificacion({
          id_usuario: viatico.id_usuario,
          mensaje: `Tu viático folio ${viatico.folio} fue <b>rechazado</b>.`,
          enviarWebSocket: true
        });
      }
    }
    await registrarAccion({ req, accion: 'rechazar-lote', entidad: 'viatico', entidadId: ids.join(',') });
    res.json({ message: `Se rechazaron ${filas} viáticos` });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ──────────────── Marcar viático como pagado (pagador) ────────────────
exports.marcarComoPagado = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario: id_pagador } = req.user;
    if (rol !== "pagador_banca") {
      return res.status(403).json({ error: "No tienes permisos para marcar el viático como pagado" });
    }
    const filas = await ViaticoModel.marcarComoPagado(id, id_pagador);
    if (filas === 0) {
      // Verifica el estado actual en BD para debug
      const [rows] = await pool.query(
        `SELECT estado FROM solicitudes_viaticos WHERE id_viatico = ?`,
        [id]
      );
      const estadoActual = rows[0]?.estado;
      return res.status(404).json({ error: `No se pudo marcar como pagado. Estado actual: ${estadoActual}` });
    }
    await registrarAccion({ req, accion: 'pagar', entidad: 'viatico', entidadId: id });
    res.json({ message: "Viático marcado como pagado" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};