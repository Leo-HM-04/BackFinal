-- Script para actualizar el ENUM del campo estado en la tabla pagos_recurrentes
-- Ejecutar este script para asegurar que el campo incluya la opción 'pagada'

ALTER TABLE pagos_recurrentes 
MODIFY COLUMN estado ENUM('pendiente', 'aprobada', 'rechazada', 'pagada') NOT NULL;
