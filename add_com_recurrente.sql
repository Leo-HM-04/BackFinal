-- Script para añadir la columna com_recurrente a la tabla pagos_recurrentes
-- Esta columna es necesaria para almacenar la ruta del comprobante

ALTER TABLE pagos_recurrentes 
ADD COLUMN com_recurrente VARCHAR(255) NULL AFTER fact_recurrente;

-- Verificar si se añadió correctamente
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'pagos_recurrentes' 
AND COLUMN_NAME = 'com_recurrente';
