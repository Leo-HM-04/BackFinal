const ComprobanteViatico = require("../models/comprobanteViatico.model");
const path = require("path");
const { registrarAccion } = require("../services/accionLogger");

exports.subirComprobanteViatico = async (req, res) => {
  try {
    console.log(" Recibiendo solicitud para subir comprobante");
    console.log(" Headers:", req.headers);
    console.log(" Body:", req.body);
    console.log(" File:", req.file);
    
    // Solo pagador puede subir
    if (req.user.rol !== "pagador_banca") {
      return res.status(403).json({ error: "No autorizado" });
    }
    const { id_viatico } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Archivo requerido" });
    }
    
    // Validación adicional para id_viatico
    if (!id_viatico || isNaN(parseInt(id_viatico))) {
      console.error(" ID de viático inválido:", id_viatico);
      return res.status(400).json({ error: `ID de viático inválido: ${id_viatico}` });
    }
    
    // Validar que el viático exista
    const Viatico = require("../models/viatico.model");
    const viatico = await Viatico.getPorId(id_viatico);
    console.log(" Viático encontrado:", viatico);
    
    if (!viatico) {
      return res.status(404).json({ error: "Viático no encontrado" });
    }
    
    // Comprobar el estado
    console.log(" Estado del viático:", viatico.estado);
    
    // Temporalmente permitimos cualquier estado para pruebas
    // En producción, descomentar la siguiente validación:
    // if (viatico.estado !== "pagado") {
    //   return res.status(400).json({ error: "Solo se puede subir comprobante cuando el viático está pagado" });
    // }
    
    // Guarda la ruta relativa para servir el archivo correctamente
    console.log(" Archivo recibido:", req.file);
    const rutaRelativa = `/uploads/comprobante-viaticos/${req.file.filename}`;
    console.log(" Ruta relativa:", rutaRelativa);
    
    const comprobante = {
      id_viatico: parseInt(id_viatico),
      archivo_url: rutaRelativa,
      id_usuario_subio: req.user.id_usuario
    };
    console.log(" Guardando comprobante en la base de datos:", comprobante);
    
    let id; 
    try {
      id = await ComprobanteViatico.create(comprobante);
      console.log(" Comprobante guardado con ID:", id);
      
      // Verificar que se guardó realmente
      const saved = await ComprobanteViatico.findByViatico(comprobante.id_viatico);
      console.log(" Comprobantes en la DB:", saved);
      
      if (!id || saved.length === 0) {
        throw new Error("No se pudo confirmar la inserción en la base de datos");
      }
    } catch (dbError) {
      console.error(" ERROR AL GUARDAR EN LA BASE DE DATOS:", dbError);
      return res.status(500).json({ 
        error: "Error al guardar en la base de datos", 
        details: dbError.message,
        comprobante 
      });
    }
    
    // Registrar acción
    await registrarAccion({
      req,
      accion: "subió",
      entidad: "comprobante_viatico",
      entidadId: id,
      mensajeExtra: `para el viático #${id_viatico}`
    });

    // Notificar al admin
    try {
      const usuarioModel = require("../models/usuario.model");
      const [admins] = await usuarioModel.getAdmins();
      const notificacionesService = require("../services/notificacionesService");
      for (const admin of admins) {
        await notificacionesService.crearNotificacion({
          id_usuario: admin.id_usuario,
          mensaje: `Se subió un comprobante para el viático #${id_viatico}`,
        });
      }
    } catch (e) {
      // Si falla la notificación, solo loguea
      console.error("Error notificando admin:", e);
    }

    res.status(201).json({
      message: "Comprobante subido con éxito",
      id,
      comprobante_url: comprobante.archivo_url
    });
  } catch (err) {
    console.error(" Error general en subirComprobanteViatico:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: `Error al subir comprobante: ${err.message}` });
    }
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
    res.status(404).json({ error: "Comprobante no encontrado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
