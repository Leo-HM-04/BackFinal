-- Agregar campo de verificación de email y token de verificación
ALTER TABLE usuarios ADD COLUMN verificado BOOLEAN DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN email_token VARCHAR(255);
