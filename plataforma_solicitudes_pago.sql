-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-08-2025 a las 08:42:39
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
(1, 1, 'Captura de pantalla 2025-08-05 231015.png', '/uploads/comprobantes/1754459589621-377075805.png', '2025-08-05 23:53:09', 4, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantes_viaticos`
--

CREATE TABLE `comprobantes_viaticos` (
  `id_comprobante` int(11) NOT NULL,
  `id_viatico` int(11) NOT NULL,
  `id_usuario_subio` int(11) NOT NULL,
  `archivo_url` varchar(255) NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comprobantes_viaticos`
--

INSERT INTO `comprobantes_viaticos` (`id_comprobante`, `id_viatico`, `id_usuario_subio`, `archivo_url`, `fecha_subida`) VALUES
(1, 1, 4, 'uploads/comprobante-viaticos/1754462387812-830066793.png', '2025-08-06 00:39:47');

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
-- Estructura de tabla para la tabla `login_audit`
--

CREATE TABLE `login_audit` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `exito` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `login_audit`
--

INSERT INTO `login_audit` (`id`, `email`, `ip`, `fecha`, `exito`) VALUES
(1, 'enrique.bechapra@gmail.com', '::1', '2025-08-05 23:23:20', 1),
(2, 'test@bechapra.com', '::1', '2025-08-05 23:28:08', 1),
(3, 'test2@bechapra.com', '::1', '2025-08-05 23:46:53', 1),
(4, 'test3@bechapra.com', '::1', '2025-08-05 23:48:58', 1),
(5, 'enrique.bechapra@gmail.com', '::1', '2025-08-06 00:27:49', 1),
(6, 'test3@bechapra.com', '::1', '2025-08-06 00:27:56', 1),
(7, 'test@bechapra.com', '::1', '2025-08-06 00:40:41', 1);

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
(1, 2, '🎉 ¡Bienvenido/a Test de Solicitante! Tu cuenta ha sido creada exitosamente.', 0, '2025-08-05 23:25:25'),
(2, 1, '👤 Se ha creado un nuevo usuario:<br><b>Nombre:</b> Test de Solicitante<br><b>Email:</b> test@bechapra.com<br><b>Rol:</b> solicitante', 0, '2025-08-05 23:25:25'),
(3, 1, 'El usuario 1 (admin_general) creó usuario (ID: 2). Nombre: Test de Solicitante, Email: test@bechapra.com, Rol: solicitante', 0, '2025-08-05 23:25:30'),
(4, 3, '🎉 ¡Bienvenido/a Test de Aprobador! Tu cuenta ha sido creada exitosamente.', 0, '2025-08-05 23:26:06'),
(5, 1, '👤 Se ha creado un nuevo usuario:<br><b>Nombre:</b> Test de Aprobador<br><b>Email:</b> test2@bechapra.com<br><b>Rol:</b> aprobador', 0, '2025-08-05 23:26:06'),
(6, 1, 'El usuario 1 (admin_general) creó usuario (ID: 3). Nombre: Test de Aprobador, Email: test2@bechapra.com, Rol: aprobador', 0, '2025-08-05 23:26:11'),
(7, 4, '🎉 ¡Bienvenido/a Test de Pagador! Tu cuenta ha sido creada exitosamente.', 0, '2025-08-05 23:27:20'),
(8, 1, '👤 Se ha creado un nuevo usuario:<br><b>Nombre:</b> Test de Pagador<br><b>Email:</b> test3@bechapra.com<br><b>Rol:</b> pagador_banca', 0, '2025-08-05 23:27:20'),
(9, 1, 'El usuario 1 (admin_general) creó usuario (ID: 4). Nombre: Test de Pagador, Email: test3@bechapra.com, Rol: pagador_banca', 0, '2025-08-05 23:27:25'),
(10, 3, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-08-05 23:35:38'),
(11, 2, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-08-05 23:35:40'),
(12, 1, 'El usuario 2 (solicitante) creó solicitud', 0, '2025-08-05 23:35:40'),
(13, 2, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-05 23:36:48'),
(14, 1, 'El usuario 2 (solicitante) crear viatico (ID: 1)', 0, '2025-08-05 23:41:05'),
(15, 1, 'El usuario 2 (solicitante) crear viatico (ID: 2)', 0, '2025-08-05 23:41:05'),
(16, 3, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-08-05 23:44:49'),
(17, 2, '¡Tu plantilla recurrente fue registrada exitosamente!', 0, '2025-08-05 23:44:51'),
(18, 2, '✏️ Tu plantilla recurrente fue actualizada.', 0, '2025-08-05 23:46:14'),
(19, 2, '✅ Tu solicitud fue autorizada.', 0, '2025-08-05 23:47:23'),
(20, 4, '📝 Nueva solicitud autorizada para pago.', 0, '2025-08-05 23:47:23'),
(21, 3, '✅ Autorizaste la solicitud (ID: 1) correctamente.', 0, '2025-08-05 23:47:23'),
(22, 1, 'El usuario 3 (aprobador) actualizó solicitud (ID: 1). Nuevo estado: autorizada', 0, '2025-08-05 23:47:23'),
(23, 2, '✅ Tu plantilla recurrente fue aprobada.', 0, '2025-08-05 23:48:16'),
(24, 4, '📝 Nueva plantilla recurrente aprobada: solicitudes futuras listas para pago.', 0, '2025-08-05 23:48:16'),
(25, 2, 'Tu viático folio TS-0001 fue <b>aprobado</b>.', 0, '2025-08-05 23:48:44'),
(26, 2, 'Tu viático folio AT-0001 fue <b>aprobado</b>.', 0, '2025-08-05 23:48:44'),
(27, 1, 'El usuario 3 (aprobador) aprobar-lote viatico (ID: 2,1)', 0, '2025-08-05 23:48:44'),
(28, 1, 'El usuario 4 (pagador_banca) pagar viatico (ID: 2)', 0, '2025-08-05 23:49:24'),
(29, 2, '💸 Tu solicitud ha sido pagada.', 0, '2025-08-05 23:49:51'),
(30, 3, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-08-05 23:49:51'),
(31, 4, '✅ Marcaste como pagada la solicitud (ID: 1).', 0, '2025-08-05 23:49:51'),
(32, 2, '💸 Tu pago recurrente ha sido marcado como pagado.', 0, '2025-08-05 23:51:51'),
(33, 3, '💸 Se pagó la plantilla recurrente que aprobaste.', 0, '2025-08-05 23:51:51'),
(34, 4, '✅ Marcaste como pagada la plantilla recurrente (ID: 1).', 0, '2025-08-05 23:51:51'),
(35, 1, 'El usuario 4 (pagador_banca) subió comprobante (ID: 1). para la solicitud #1', 0, '2025-08-05 23:53:09'),
(36, 4, '💾 Se subió un comprobante a la plantilla recurrente.', 0, '2025-08-06 00:39:18'),
(37, 1, 'El usuario 4 (pagador_banca) subió comprobante_viatico (ID: 1). para el viático #1', 0, '2025-08-06 00:39:47');

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
  `tipo_pago_descripcion` varchar(100) DEFAULT NULL,
  `empresa_a_pagar` varchar(100) DEFAULT NULL,
  `nombre_persona` varchar(100) DEFAULT NULL,
  `frecuencia` enum('diario','semanal','quincenal','mensual') NOT NULL,
  `tipo_cuenta_destino` varchar(50) DEFAULT NULL,
  `tipo_tarjeta` varchar(50) DEFAULT NULL,
  `banco_destino` varchar(50) DEFAULT NULL,
  `siguiente_fecha` date NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `estado` enum('pendiente','aprobada','rechazada','pagada') NOT NULL,
  `fact_recurrente` varchar(255) DEFAULT NULL,
  `com_recurrente` varchar(255) DEFAULT NULL,
  `id_aprobador` int(11) DEFAULT NULL,
  `id_pagador` int(11) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `comentario_aprobador` text DEFAULT NULL,
  `folio` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos_recurrentes`
--

INSERT INTO `pagos_recurrentes` (`id_recurrente`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `concepto`, `tipo_pago`, `tipo_pago_descripcion`, `empresa_a_pagar`, `nombre_persona`, `frecuencia`, `tipo_cuenta_destino`, `tipo_tarjeta`, `banco_destino`, `siguiente_fecha`, `activo`, `estado`, `fact_recurrente`, `com_recurrente`, `id_aprobador`, `id_pagador`, `fecha_pago`, `fecha_revision`, `comentario_aprobador`, `folio`, `created_at`) VALUES
(1, 2, 'atencion a clientes', 230.00, '7264876234693859', 'TEST DE PLATILLA CRE', 'administrativos', 'TEST DE PLATILLA UPDATE ', '', 'TEST DE PLANTILLA ', 'quincenal', 'Tarjeta', 'Crédito', 'BANCREA', '2025-08-29', 1, 'pagada', '/uploads/recurrente/1754459174656-512101245.pdf', '/uploads/comprobante-recurrentes/1754462298477-123136894.png', 3, 4, '2025-08-05 23:51:44', '2025-08-05 23:48:10', 'Solicitud aprobada', 'AC-0001', '2025-08-05 23:44:47');

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
  `tipo_pago_descripcion` varchar(100) DEFAULT NULL,
  `empresa_a_pagar` varchar(100) DEFAULT NULL,
  `nombre_persona` varchar(100) DEFAULT NULL,
  `fecha_limite_pago` date NOT NULL,
  `estado` enum('pendiente','autorizada','rechazada','pagada') DEFAULT 'pendiente',
  `comentario_aprobador` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `id_aprobador` int(11) DEFAULT NULL,
  `id_pagador` int(11) DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `id_recurrente_origen` int(11) DEFAULT NULL,
  `folio` varchar(20) DEFAULT NULL,
  `tipo_cuenta_destino` varchar(20) NOT NULL DEFAULT 'CLABE',
  `tipo_tarjeta` varchar(20) DEFAULT NULL,
  `banco_destino` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_pago`
--

INSERT INTO `solicitudes_pago` (`id_solicitud`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `factura_url`, `concepto`, `tipo_pago`, `tipo_pago_descripcion`, `empresa_a_pagar`, `nombre_persona`, `fecha_limite_pago`, `estado`, `comentario_aprobador`, `fecha_creacion`, `id_aprobador`, `id_pagador`, `fecha_revision`, `fecha_pago`, `id_recurrente_origen`, `folio`, `tipo_cuenta_destino`, `tipo_tarjeta`, `banco_destino`) VALUES
(1, 2, 'tesoreria', 203.00, '127364849585302393', '/uploads/facturas/1754458534659-117592303.pdf', 'TEST DE UN SOLICITANTE UPDATE ', 'efectivo', 'TEST DE SOLICITANTE UPDATE ', 'UPDATE ', 'TEST PRUEBA UPDATE ', '2025-08-30', 'pagada', 'Solicitud aprobada', '2025-08-05 23:35:34', 3, 4, '2025-08-05 23:47:16', '2025-08-05 23:49:43', NULL, 'XX-0001', 'CLABE', '', 'ASP INTEGRA OPC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_viaticos`
--

CREATE TABLE `solicitudes_viaticos` (
  `id_viatico` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `departamento` enum('contabilidad','facturacion','cobranza','vinculacion','administracion','ti','automatizaciones','comercial','atencion a clientes','tesoreria','nomina') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `cuenta_destino` varchar(100) NOT NULL,
  `viatico_url` varchar(255) DEFAULT NULL,
  `concepto` text NOT NULL,
  `tipo_pago` enum('viaticos') NOT NULL DEFAULT 'viaticos',
  `tipo_pago_descripcion` varchar(100) DEFAULT NULL,
  `empresa_a_pagar` varchar(100) DEFAULT NULL,
  `nombre_persona` varchar(100) DEFAULT NULL,
  `fecha_limite_pago` date NOT NULL,
  `estado` enum('pendiente','autorizada','rechazada','pagada') DEFAULT 'pendiente',
  `comentario_aprobador` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `id_aprobador` int(11) DEFAULT NULL,
  `id_pagador` int(11) DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `folio` varchar(20) DEFAULT NULL,
  `tipo_cuenta_destino` varchar(20) NOT NULL DEFAULT 'CLABE',
  `tipo_tarjeta` varchar(20) DEFAULT NULL,
  `banco_destino` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_viaticos`
--

INSERT INTO `solicitudes_viaticos` (`id_viatico`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `viatico_url`, `concepto`, `tipo_pago`, `tipo_pago_descripcion`, `empresa_a_pagar`, `nombre_persona`, `fecha_limite_pago`, `estado`, `comentario_aprobador`, `fecha_creacion`, `id_aprobador`, `id_pagador`, `fecha_revision`, `fecha_pago`, `folio`, `tipo_cuenta_destino`, `tipo_tarjeta`, `banco_destino`) VALUES
(1, 2, 'automatizaciones', 5562.00, '1234567899458374', '/uploads/viaticos/1754458865862-224941284.pdf', 'TEST DOS ', 'viaticos', 'TEST DOS ', '', 'TEST DOS ', '2025-08-27', 'autorizada', 'Solicitudes aprobadas en lote', '2025-08-05 23:41:05', 3, NULL, '2025-08-05 23:48:44', NULL, 'AT-0001', 'tarjeta', 'credito', 'BANCOPPEL'),
(2, 2, 'tesoreria', 500.00, '676532176364876387', '/uploads/viaticos/1754458865856-295035188.pdf', 'TES DE DOS TEST DE ', 'viaticos', 'TEST DE PAGO ', 'TEST DE PAGO ', 'JUAN A', '2025-08-19', 'pagada', 'Solicitudes aprobadas en lote', '2025-08-05 23:41:05', 3, 4, '2025-08-05 23:48:44', '2025-08-05 23:49:24', 'TS-0001', 'clabe', '', 'AZTECA');

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
  `bloqueo_temporal_activado` tinyint(1) NOT NULL DEFAULT 0,
  `verificado` tinyint(1) DEFAULT 0,
  `email_token` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password`, `rol`, `creado_en`, `intentos_fallidos`, `bloqueado`, `bloqueo_temporal_fin`, `bloqueo_temporal_activado`, `verificado`, `email_token`, `activo`) VALUES
(1, 'Administrador Bechapra', 'enrique.bechapra@gmail.com', '$2b$10$5lPDFcd/ye7y.HkSREGR3ug7K4JSzmuqI1BH4HSZm7JRJnVO8/ZdS', 'admin_general', '2025-08-06 05:22:33', 0, 0, NULL, 0, 1, NULL, 1),
(2, 'Test de Solicitante', 'test@bechapra.com', '$2b$10$G7If0MbuyPpB.KGtC8mGb.j59U/CJfPmmCiiolzsWbRlH.YAyGNUe', 'solicitante', '2025-08-06 05:25:22', 0, 0, NULL, 0, 1, NULL, 1),
(3, 'Test de Aprobador', 'test2@bechapra.com', '$2b$10$2UOanXrObdtoY5nX9Md0lO3QKdIhhGf7wG4fBuJFk9RpALQih9WRO', 'aprobador', '2025-08-06 05:26:03', 0, 0, NULL, 0, 1, NULL, 0),
(4, 'Test de Pagador', 'test3@bechapra.com', '$2b$10$aH0jOkanU8K0WoPspntBmec9YIvdtvTfa7J2umGjeJ/162su/qG2O', 'pagador_banca', '2025-08-06 05:27:18', 0, 0, NULL, 0, 1, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viaticos`
--

CREATE TABLE `viaticos` (
  `id` int(11) NOT NULL,
  `id_solicitante` int(11) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `destino` varchar(255) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'pendiente',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `viatico_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viaticos_detalle`
--

CREATE TABLE `viaticos_detalle` (
  `id_viatico` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `destino` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `monto` decimal(15,2) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `viatico_url` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viatico_conceptos`
--

CREATE TABLE `viatico_conceptos` (
  `id` int(11) NOT NULL,
  `id_viatico` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fecha_gasto` date DEFAULT NULL,
  `tipo_gasto` varchar(100) DEFAULT NULL,
  `comprobante_url` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'pendiente',
  `fecha_aprobacion` datetime DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `fecha_comprobante` datetime DEFAULT NULL,
  `id_aprobador` int(11) DEFAULT NULL,
  `id_pagador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indices de la tabla `comprobantes_viaticos`
--
ALTER TABLE `comprobantes_viaticos`
  ADD PRIMARY KEY (`id_comprobante`),
  ADD KEY `id_viatico` (`id_viatico`),
  ADD KEY `id_usuario_subio` (`id_usuario_subio`);

--
-- Indices de la tabla `ejecuciones_recurrentes`
--
ALTER TABLE `ejecuciones_recurrentes`
  ADD PRIMARY KEY (`id_ejecucion`),
  ADD KEY `id_recurrente` (`id_recurrente`),
  ADD KEY `id_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `login_audit`
--
ALTER TABLE `login_audit`
  ADD PRIMARY KEY (`id`);

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
  ADD UNIQUE KEY `folio` (`folio`),
  ADD KEY `pagos_recurrentes_ibfk_1` (`id_usuario`),
  ADD KEY `id_aprobador` (`id_aprobador`),
  ADD KEY `id_pagador` (`id_pagador`);

--
-- Indices de la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD UNIQUE KEY `folio` (`folio`),
  ADD KEY `id_aprobador` (`id_aprobador`),
  ADD KEY `id_pagador` (`id_pagador`),
  ADD KEY `solicitudes_pago_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `solicitudes_viaticos`
--
ALTER TABLE `solicitudes_viaticos`
  ADD PRIMARY KEY (`id_viatico`),
  ADD UNIQUE KEY `folio` (`folio`),
  ADD KEY `id_aprobador` (`id_aprobador`),
  ADD KEY `id_pagador` (`id_pagador`),
  ADD KEY `solicitudes_viaticos_ibfk_1` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `viaticos`
--
ALTER TABLE `viaticos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `viaticos_detalle`
--
ALTER TABLE `viaticos_detalle`
  ADD PRIMARY KEY (`id_viatico`),
  ADD KEY `id_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `viatico_conceptos`
--
ALTER TABLE `viatico_conceptos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_viatico` (`id_viatico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comprobantes_pago`
--
ALTER TABLE `comprobantes_pago`
  MODIFY `id_comprobante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `comprobantes_viaticos`
--
ALTER TABLE `comprobantes_viaticos`
  MODIFY `id_comprobante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ejecuciones_recurrentes`
--
ALTER TABLE `ejecuciones_recurrentes`
  MODIFY `id_ejecucion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `login_audit`
--
ALTER TABLE `login_audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `pagos_recurrentes`
--
ALTER TABLE `pagos_recurrentes`
  MODIFY `id_recurrente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `solicitudes_viaticos`
--
ALTER TABLE `solicitudes_viaticos`
  MODIFY `id_viatico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `viaticos`
--
ALTER TABLE `viaticos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `viaticos_detalle`
--
ALTER TABLE `viaticos_detalle`
  MODIFY `id_viatico` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `viatico_conceptos`
--
ALTER TABLE `viatico_conceptos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- Filtros para la tabla `comprobantes_viaticos`
--
ALTER TABLE `comprobantes_viaticos`
  ADD CONSTRAINT `fk_comprobantes_viaticos_usuario` FOREIGN KEY (`id_usuario_subio`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `fk_comprobantes_viaticos_viatico` FOREIGN KEY (`id_viatico`) REFERENCES `solicitudes_viaticos` (`id_viatico`);

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
  ADD CONSTRAINT `pagos_recurrentes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_recurrentes_ibfk_2` FOREIGN KEY (`id_aprobador`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `pagos_recurrentes_ibfk_3` FOREIGN KEY (`id_pagador`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  ADD CONSTRAINT `solicitudes_pago_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitudes_pago_ibfk_2` FOREIGN KEY (`id_aprobador`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_pago_ibfk_3` FOREIGN KEY (`id_pagador`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `solicitudes_viaticos`
--
ALTER TABLE `solicitudes_viaticos`
  ADD CONSTRAINT `solicitudes_viaticos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_viaticos_ibfk_2` FOREIGN KEY (`id_aprobador`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_viaticos_ibfk_3` FOREIGN KEY (`id_pagador`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `viatico_conceptos`
--
ALTER TABLE `viatico_conceptos`
  ADD CONSTRAINT `viatico_conceptos_ibfk_1` FOREIGN KEY (`id_viatico`) REFERENCES `viaticos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
