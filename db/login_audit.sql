-- Tabla para auditoría de intentos de login
CREATE TABLE IF NOT EXISTS login_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    ip VARCHAR(45),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    exito BOOLEAN
);
