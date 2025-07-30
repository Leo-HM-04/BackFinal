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
    const datos = await schema.validateAsync(req.body);
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

exports.actualizarViatico = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario } = req.user;
    const viatico = await ViaticoModel.getPorId(id);
    if (!viatico) {
      return res.status(404).json({ error: "Viático no encontrado" });
    }
    // Solo el solicitante puede editar su viático y solo si está pendiente
    if (rol === "solicitante") {
      if (viatico.id_usuario !== id_usuario) {
        return res.status(403).json({ error: "No tienes permiso para editar este viático" });
      }
      if (String(viatico.estado).toLowerCase() !== "pendiente") {
        return res.status(403).json({ error: "Solo puedes editar viáticos en estado pendiente" });
      }
    }
    const datos = req.body;
    await ViaticoModel.actualizar(id, datos);
    await registrarAccion({ req, accion: 'actualizar', entidad: 'viatico', entidadId: id });
    res.json({ message: "Viático actualizado" });
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