CREATE TABLE auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  rol VARCHAR(30) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  entidad VARCHAR(50) NOT NULL,
  entidad_id INT,
  fecha DATETIME NOT NULL,
  detalles TEXT,
  INDEX (usuario_id),
  INDEX (rol),
  INDEX (entidad),
  INDEX (entidad_id)
);

CREATE TABLE notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  rol VARCHAR(30) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  fecha DATETIME NOT NULL,
  entidad VARCHAR(50),
  entidad_id INT,
  INDEX (usuario_id),
  INDEX (rol),
  INDEX (entidad),
  INDEX (entidad_id)
);
