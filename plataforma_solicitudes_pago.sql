-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-07-2025 a las 00:26:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `plataforma_solicitudes_pago`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantes_pago`
--

CREATE TABLE `comprobantes_pago` (
  `id_comprobante` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  `usuario_subio` int(11) NOT NULL,
  `comentario` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comprobantes_pago`
--

INSERT INTO `comprobantes_pago` (`id_comprobante`, `id_solicitud`, `nombre_archivo`, `ruta_archivo`, `fecha_subida`, `usuario_subio`, `comentario`) VALUES
(1, 14, 'Captura de pantalla 2025-07-14 135016.png', 'uploads\\facturas\\1752528568478-982446442.png', '2025-07-14 15:29:28', 24, NULL),
(2, 11, 'Captura de pantalla 2025-07-14 135016.png', 'uploads\\facturas\\1752528605251-279067567.png', '2025-07-14 15:30:05', 24, NULL),
(3, 11, 'Captura de pantalla 2025-07-14 134309.png', 'uploads\\comprobantes\\1752528787220-134358371.png', '2025-07-14 15:33:07', 24, NULL),
(4, 12, 'Captura de pantalla 2025-07-14 154244.png', 'uploads\\comprobantes\\1752529407173-514779375.png', '2025-07-14 15:43:27', 24, NULL),
(5, 18, 'A_Sample_PDF__1_.pdf', 'uploads\\comprobantes\\1752529750537-751460955.pdf', '2025-07-14 15:49:10', 24, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ejecuciones_recurrentes`
--

CREATE TABLE `ejecuciones_recurrentes` (
  `id_ejecucion` int(11) NOT NULL,
  `id_recurrente` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `fecha_ejecucion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint(1) DEFAULT 0,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificacion`, `id_usuario`, `mensaje`, `leida`, `fecha_creacion`) VALUES
(3, 6, '? Nueva solicitud autorizada para pago.', 0, '2025-07-02 13:55:09'),
(5, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 12:09:01'),
(6, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 12:11:08'),
(7, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 12:17:06'),
(8, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 12:45:00'),
(9, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 12:46:38'),
(10, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 12:58:20'),
(11, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 13:36:44'),
(12, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 13:45:13'),
(13, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 13:52:14'),
(14, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 13:54:44'),
(15, 5, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-10 15:10:01'),
(16, 20, '✅ Tu solicitud fue autorizada.', 0, '2025-07-11 10:23:09'),
(17, 6, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-11 10:23:11'),
(18, 25, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-11 10:23:12'),
(19, 20, '✅ Tu solicitud fue autorizada.', 0, '2025-07-11 10:23:17'),
(20, 6, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-11 10:23:18'),
(21, 25, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-11 10:23:19'),
(22, 20, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-11 10:24:09'),
(23, 23, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-11 10:24:10'),
(24, 20, '✅ Tu solicitud fue autorizada.', 0, '2025-07-11 11:05:20'),
(25, 6, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-11 11:05:21'),
(26, 20, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-11 11:08:37'),
(27, 25, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-11 11:08:37'),
(28, 20, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-11 11:17:09'),
(29, 23, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-11 11:17:09'),
(30, 20, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-11 11:26:49'),
(31, 5, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-11 11:26:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos_recurrentes`
--

CREATE TABLE `pagos_recurrentes` (
  `id_recurrente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `departamento` enum('contabilidad','facturacion','cobranza','vinculacion','administracion','ti','automatizaciones','comercial','atencion a clientes','tesoreria','nomina') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `cuenta_destino` varchar(100) NOT NULL,
  `concepto` text NOT NULL,
  `tipo_pago` enum('viaticos','efectivo','factura','nominas','tarjeta','proveedores','administrativos') NOT NULL,
  `frecuencia` enum('diario','semanal','quincenal','mensual') NOT NULL,
  `siguiente_fecha` date NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_pago`
--

CREATE TABLE `solicitudes_pago` (
  `id_solicitud` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `departamento` enum('contabilidad','facturacion','cobranza','vinculacion','administracion','ti','automatizaciones','comercial','atencion a clientes','tesoreria','nomina') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `cuenta_destino` varchar(100) NOT NULL,
  `factura_url` text DEFAULT NULL,
  `concepto` text NOT NULL,
  `tipo_pago` enum('viaticos','efectivo','factura','nominas','tarjeta','proveedores','administrativos') NOT NULL,
  `fecha_limite_pago` date NOT NULL,
  `estado` enum('pendiente','autorizada','rechazada','pagada') DEFAULT 'pendiente',
  `comentario_aprobador` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `id_aprobador` int(11) DEFAULT NULL,
  `id_pagador` int(11) DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `id_recurrente_origen` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_pago`
--

INSERT INTO `solicitudes_pago` (`id_solicitud`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `factura_url`, `concepto`, `tipo_pago`, `fecha_limite_pago`, `estado`, `comentario_aprobador`, `fecha_creacion`, `id_aprobador`, `id_pagador`, `fecha_revision`, `fecha_pago`, `id_recurrente_origen`) VALUES
(11, 20, 'cobranza', 12342.00, '12345678907', '/uploads/facturas/1752171068008-464643402.png', 'prueba ', 'efectivo', '2025-08-09', 'pagada', 'Solicitud aprobada', '2025-07-10 12:11:08', 25, 22, '2025-07-11 11:05:20', '2025-07-11 11:08:37', NULL),
(12, 20, 'automatizaciones', 42.00, '3454765', '/uploads/facturas/1752171426628-537657791.pdf', 'XDDD', 'efectivo', '2025-07-23', 'pagada', 'Solicitud aprobada', '2025-07-10 12:17:06', 23, 25, '2025-07-11 10:23:17', '2025-07-11 10:24:09', NULL),
(13, 20, 'automatizaciones', 1000.00, '1234567890', '/uploads/facturas/1752173100147-909676920.pdf', 'PRUEBA ', 'efectivo', '2025-08-09', 'pendiente', NULL, '2025-07-10 12:45:00', NULL, NULL, NULL, NULL, NULL),
(14, 20, 'ti', 2222222.00, '1234567890', '/uploads/facturas/1752173198561-209150711.png', '98765432', 'efectivo', '2025-08-09', 'pagada', 'bsb', '2025-07-10 12:46:38', 5, 22, '2025-07-11 11:25:30', '2025-07-11 11:26:49', NULL),
(15, 20, 'vinculacion', 10033.00, '1234567890', '/uploads/facturas/1752173900916-983062405.png', 'test ', 'efectivo', '2025-08-09', 'autorizada', NULL, '2025-07-10 12:58:20', NULL, NULL, NULL, NULL, NULL),
(17, 20, 'atencion a clientes', 1223344.00, '1234567890', '/uploads/facturas/1752176713500-269532798.png', 'test ', 'tarjeta', '2026-05-10', 'pendiente', NULL, '2025-07-10 13:45:13', NULL, NULL, NULL, NULL, NULL),
(18, 20, 'cobranza', 400000.00, '76543098765432', '/uploads/facturas/1752177133885-761981579.png', 'esa', '', '2025-07-12', 'pagada', 'Solicitud aprobada', '2025-07-10 13:52:13', 23, 22, '2025-07-11 10:23:09', '2025-07-11 11:17:09', NULL),
(19, 20, 'comercial', 2000.00, '76543098765432198765432', '/uploads/facturas/1752185844451-591752214.pdf', '65432', 'nominas', '2025-07-12', 'pendiente', NULL, '2025-07-10 13:54:44', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin_general','solicitante','aprobador','pagador_banca') NOT NULL DEFAULT 'solicitante',
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado` tinyint(1) DEFAULT 0,
  `bloqueo_temporal_fin` datetime DEFAULT NULL,
  `bloqueo_temporal_activado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password`, `rol`, `creado_en`, `intentos_fallidos`, `bloqueado`, `bloqueo_temporal_fin`, `bloqueo_temporal_activado`) VALUES
(3, 'Leonardo Admin', 'admin@bechapra.com', '$2b$10$d0r2Uhx4p2CXuns3ib6J/.uzbZHUxZ0db0vCqeSR5cN8H0pooorOu', 'admin_general', '2025-06-17 19:32:30', 0, 0, NULL, 0),
(5, 'Aprobador Uno', 'aprobador@bechapra.com', '$2b$10$OFRyDdjyQlfAanLNzFXHR.mM/Tb6UCBp.q0xOujDbyDkurwhhcIqS', 'aprobador', '2025-06-17 19:32:30', 0, 0, NULL, 0),
(6, 'Pagador Uno', 'pagador@bechapra.com', '$2b$10$GxEQD8KJE.7j6Qvsh.GQMOooJWXclLYwX.NL/mmDKOKXdlXUr36EW', 'pagador_banca', '2025-06-17 19:32:30', 0, 0, NULL, 0),
(20, 'solicitante2', 'solicitante2@bechapra.com', '$2b$10$J0DnjcyEdvY7tUBpbIkOpu4V9hjxIsXgygOWeFw2Jj5fxSxA54Hl6', 'solicitante', '2025-07-08 19:13:17', 0, 0, NULL, 0),
(22, 'panchito', 'panchito@bechapra.com', '$2b$10$w.qpewn5UbNoqKnQwCdD4OH6qylpXGTb3XtxtRm5JX1q7tzCaXi1q', 'pagador_banca', '2025-07-08 22:38:13', 0, 0, NULL, 0),
(23, 'luis enrike peña nito', 'kike@bechapra.com', '$2b$10$P5pmeOyAXht/01OJXFLYfeFqM2YYacVtWprIz6oE3ErX3FQ5s3e8a', 'aprobador', '2025-07-09 19:18:52', 0, 0, NULL, 0),
(24, 'luis enrike peña nieoto', 'kiike@bechapra.com', '$2b$10$ngy21wrY1fx1WPNmvDyRH.PTqQ3.8ES2PwNjXk2gswFkdn.6P4ZLW', 'pagador_banca', '2025-07-09 19:19:42', 0, 0, NULL, 0),
(25, 'leonardo', 'leo@bechapra.com', '$2b$10$9ItkIc671diE144NI5Wwg.p4jzpxMD5bKnpSlVjrM73vBgOMsqY8.', 'aprobador', '2025-07-09 19:29:25', 0, 0, NULL, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comprobantes_pago`
--
ALTER TABLE `comprobantes_pago`
  ADD PRIMARY KEY (`id_comprobante`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `usuario_subio` (`usuario_subio`);

--
-- Indices de la tabla `ejecuciones_recurrentes`
--
ALTER TABLE `ejecuciones_recurrentes`
  ADD PRIMARY KEY (`id_ejecucion`),
  ADD KEY `id_recurrente` (`id_recurrente`),
  ADD KEY `id_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `notificaciones_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `pagos_recurrentes`
--
ALTER TABLE `pagos_recurrentes`
  ADD PRIMARY KEY (`id_recurrente`),
  ADD KEY `pagos_recurrentes_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `id_aprobador` (`id_aprobador`),
  ADD KEY `id_pagador` (`id_pagador`),
  ADD KEY `solicitudes_pago_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comprobantes_pago`
--
ALTER TABLE `comprobantes_pago`
  MODIFY `id_comprobante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ejecuciones_recurrentes`
--
ALTER TABLE `ejecuciones_recurrentes`
  MODIFY `id_ejecucion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `pagos_recurrentes`
--
ALTER TABLE `pagos_recurrentes`
  MODIFY `id_recurrente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comprobantes_pago`
--
ALTER TABLE `comprobantes_pago`
  ADD CONSTRAINT `fk_comprobante_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_pago` (`id_solicitud`),
  ADD CONSTRAINT `fk_comprobante_usuario` FOREIGN KEY (`usuario_subio`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `ejecuciones_recurrentes`
--
ALTER TABLE `ejecuciones_recurrentes`
  ADD CONSTRAINT `ejecuciones_recurrentes_ibfk_1` FOREIGN KEY (`id_recurrente`) REFERENCES `pagos_recurrentes` (`id_recurrente`) ON DELETE CASCADE,
  ADD CONSTRAINT `ejecuciones_recurrentes_ibfk_2` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_pago` (`id_solicitud`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos_recurrentes`
--
ALTER TABLE `pagos_recurrentes`
  ADD CONSTRAINT `pagos_recurrentes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  ADD CONSTRAINT `solicitudes_pago_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitudes_pago_ibfk_2` FOREIGN KEY (`id_aprobador`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_pago_ibfk_3` FOREIGN KEY (`id_pagador`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
