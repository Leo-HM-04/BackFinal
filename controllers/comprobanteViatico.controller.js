const ComprobanteViatico = require('../models/comprobanteViatico.model');
const path = require('path');
const { registrarAccion } = require('../services/accionLogger');

exports.subirComprobanteViatico = async (req, res) => {
  try {
    // Solo pagador puede subir
    if (req.user.rol !== 'pagador_banca') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const { id_viatico } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }
    // Validar que el viático esté pagado
    const Viatico = require('../models/viatico.model');
    const viatico = await Viatico.getPorId(id_viatico);
    if (!viatico) {
      return res.status(404).json({ error: 'Viático no encontrado' });
    }
    if (viatico.estado !== 'pagado') {
      return res.status(400).json({ error: 'Solo se puede subir comprobante cuando el viático está pagado' });
    }
    // Guarda la ruta relativa para servir el archivo correctamente
    const rutaRelativa = `/uploads/comprobante-viaticos/${req.file.filename}`;
    const comprobante = {
      id_viatico,
      archivo_url: rutaRelativa,
      id_usuario_subio: req.user.id_usuario
    };
    const id = await ComprobanteViatico.create(comprobante);

    // Registrar acción
    await registrarAccion({
      req,
      accion: 'subió',
      entidad: 'comprobante_viatico',
      entidadId: id,
      mensajeExtra: `para el viático #${id_viatico}`
    });

    // Notificar al admin
    try {
      const usuarioModel = require('../models/usuario.model');
      const [admins] = await usuarioModel.getAdmins();
      const notificacionesService = require('../services/notificacionesService');
      for (const admin of admins) {
        await notificacionesService.crearNotificacion({
          id_usuario: admin.id_usuario,
          mensaje: `Se subió un comprobante para el viático #${id_viatico}`,
        });
      }
    } catch (e) {
      // Si falla la notificación, solo loguea
      console.error('Error notificando admin:', e);
    }

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComprobantesPorViatico = async (req, res) => {
  try {
    const { id_viatico } = req.params;
    const comprobantes = await ComprobanteViatico.findByViatico(id_viatico);
    res.json(comprobantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarComprobanteViatico = async (req, res) => {
  try {
    const { id_comprobante } = req.params;
    const ok = await ComprobanteViatico.delete(id_comprobante);
    if (ok) return res.json({ success: true });
    res.status(404).json({ error: 'Comprobante no encontrado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
