const Comprobante = require('../models/comprobante.model');
const path = require('path');
const notificacionesService = require('../services/notificacionesService');
const usuarioModel = require('../models/usuario.model');
const { registrarAccion } = require('../services/accionLogger');

exports.subirComprobante = async (req, res) => {
  try {
    // Solo pagador puede subir
    if (req.user.rol !== 'pagador_banca') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const { id_solicitud, comentario } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }
    // Validar que la solicitud esté pagada
    const Solicitud = require('../models/solicitud.model');
    const solicitud = await Solicitud.getPorId(id_solicitud);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    if (solicitud.estado !== 'pagada') {
      return res.status(400).json({ error: 'Solo se puede subir comprobante cuando la solicitud está pagada' });
    }
    const comprobante = {
      id_solicitud,
      nombre_archivo: req.file.originalname,
      ruta_archivo: req.file.path,
      usuario_subio: req.user.id_usuario,
      comentario
    };
    const id = await Comprobante.create(comprobante);


    // Registrar acción y notificar admin
    await registrarAccion({
      req,
      accion: 'subió',
      entidad: 'comprobante',
      entidadId: id,
      mensajeExtra: `para la solicitud #${id_solicitud}`
    });

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComprobantesPorSolicitud = async (req, res) => {
  try {
    const { id_solicitud } = req.params;
    const comprobantes = await Comprobante.findBySolicitud(id_solicitud);
    res.json(comprobantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarComprobante = async (req, res) => {
  try {
    const { id_comprobante } = req.params;
    const ok = await Comprobante.delete(id_comprobante);
    if (ok) {
      // Registrar acción y notificar admin
      await registrarAccion({
        req,
        accion: 'eliminó',
        entidad: 'comprobante',
        entidadId: id_comprobante
      });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'No encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
