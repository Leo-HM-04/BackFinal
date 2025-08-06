-- ====================================================================
-- Script para agregar la columna fecha_pagado a la tabla pagos_recurrentes
-- ====================================================================

-- Agregar la columna fecha_pagado
ALTER TABLE pagos_recurrentes 
ADD COLUMN fecha_pagado DATETIME DEFAULT NULL AFTER fecha_pago;

-- Opcional: Copiar los valores existentes de fecha_pago a fecha_pagado
UPDATE pagos_recurrentes 
SET fecha_pagado = fecha_pago 
WHERE fecha_pago IS NOT NULL;

-- Verificar que la columna se agregó correctamente
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pagos_recurrentes' 
  AND TABLE_SCHEMA = DATABASE()
  AND COLUMN_NAME IN ('fecha_pago', 'fecha_pagado')
ORDER BY ORDINAL_POSITION;
