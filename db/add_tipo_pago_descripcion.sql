-- Script para añadir la columna tipo_pago_descripcion a la tabla solicitudes_pago
USE plataforma_solicitudes_pago;

-- Verificar si la columna ya existe
SET @exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'plataforma_solicitudes_pago'
  AND TABLE_NAME = 'solicitudes_pago'
  AND COLUMN_NAME = 'tipo_pago_descripcion'
);

-- Si la columna no existe, añadirla
SET @query = IF(@exists = 0,
  'ALTER TABLE solicitudes_pago ADD COLUMN tipo_pago_descripcion VARCHAR(100) NULL AFTER tipo_pago',
  'SELECT "La columna tipo_pago_descripcion ya existe en la tabla solicitudes_pago"'
);

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
