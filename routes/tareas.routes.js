const express = require("express");
const router = express.Router();

const { ejecutarRecurrentes } = require("../tareas/recurrentes");
const { authMiddleware } = require("../middlewares/authMiddleware");
const controller = require("../controllers/tareas.controller");

// Endpoint para disparar la tarea manualmente
router.post("/recurrentes/ejecutar", async (req, res) => {
  try {
    await ejecutarRecurrentes();
    res.json({ message: "Tarea recurrente ejecutada manualmente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al ejecutar la tarea recurrente" });
  }
});
router.get("/", authMiddleware, controller.getTareas);
router.post("/", authMiddleware, controller.createTarea);
router.put("/:id", authMiddleware, controller.updateTarea);
router.delete("/:id", authMiddleware, controller.deleteTarea);

module.exports = router;
