-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-07-2025 a las 09:42:32
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
(1, 1, 'Captura de pantalla 2025-07-21 013740.png', 'uploads\\comprobantes\\1753084913238-678280371.png', '2025-07-21 02:01:53', 11, NULL);

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
(1, 'admin@bechapra.com', '::1', '2025-07-20 02:09:52', 0),
(2, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 02:15:21', 1),
(3, 'kikeramirez160418@gmail.com', '::1', '2025-07-20 02:52:00', 0),
(4, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 02:52:11', 1),
(5, 'admin@bechapra.com', '::1', '2025-07-20 15:31:12', 0),
(6, 'admin@bechapra.com', '::1', '2025-07-20 15:31:50', 0),
(7, 'admin@bechapra.com', '::1', '2025-07-20 17:39:26', 0),
(8, 'admin@bechapra.com', '::1', '2025-07-20 17:39:44', 0),
(9, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 17:40:51', 1),
(10, 'test@bechapra.com', '::1', '2025-07-20 18:28:53', 1),
(11, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 18:29:09', 1),
(12, 'test@bechapra.com', '::1', '2025-07-20 18:29:47', 1),
(13, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 18:30:08', 1),
(14, 'test@bechapra.com', '::1', '2025-07-20 18:31:13', 1),
(15, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 18:32:47', 1),
(16, 'test@bechapra.com', '::1', '2025-07-20 19:07:11', 1),
(17, 'test@bechapra.com', '::1', '2025-07-20 22:27:51', 1),
(18, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 22:47:53', 1),
(19, 'enrique.bechapra@gmail.com', '::1', '2025-07-20 22:48:00', 1),
(20, 'test@bechapra.com', '::1', '2025-07-20 22:49:59', 1),
(21, 'test@bechapra.com', '::1', '2025-07-20 23:45:44', 1),
(22, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 00:01:07', 1),
(23, 'test@bechapra.com', '::1', '2025-07-21 00:02:41', 1),
(24, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 00:21:03', 1),
(25, 'test2@bechapra.com', '::1', '2025-07-21 00:22:54', 1),
(26, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 00:51:02', 1),
(27, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 00:52:58', 1),
(28, 'test3@bechapra.com', '::1', '2025-07-21 00:54:34', 1),
(29, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 02:25:05', 1),
(30, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 02:32:46', 1),
(31, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 02:40:17', 1),
(32, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 02:52:00', 1),
(33, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 20:56:48', 1),
(34, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 21:14:07', 1),
(35, 'solicitante2@bechapra.com', '::1', '2025-07-21 22:14:06', 0),
(36, 'test@bechapra.com', '::1', '2025-07-21 22:14:23', 1),
(37, 'test@bechapra.com', '::1', '2025-07-21 22:43:36', 1),
(38, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 22:50:13', 1),
(39, 'test2@bechapra.com', '::1', '2025-07-21 22:56:51', 1),
(40, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 23:19:19', 1);

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
(1, 1, 'El usuario 1 (admin_general) eliminó usuario (ID: 2). Nombre: Solicitante Uno, Email: solicitante2@bechapra.com, Rol: solicitante', 1, '2025-07-20 02:36:27'),
(2, 1, 'El usuario 1 (admin_general) creó usuario (ID: 7). Nombre: TEST , Email: kikegonzalez152@gmail.com, Rol: aprobador', 1, '2025-07-20 03:01:24'),
(3, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4)', 1, '2025-07-20 03:02:23'),
(4, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: Pagador Bechapra TEST, Email: pagador@bechapra.com, Rol: solicitante, Bloqueado: Sí', 1, '2025-07-20 03:04:18'),
(5, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: Pagador Bechapra TEST, Email: pagador@bechapra.com, Rol: pagador_banca, Bloqueado: No', 1, '2025-07-20 03:04:50'),
(6, 1, 'El usuario 1 (admin_general) creó usuario (ID: 8). Nombre: KIKE , Email: kikeramirez160418@gmail.com, Rol: solicitante', 1, '2025-07-20 03:27:11'),
(7, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: Pagador Bechapra, Email: pagador@bechapra.com, Rol: pagador_banca, Bloqueado: No', 0, '2025-07-20 03:35:52'),
(8, 1, 'El usuario \"Desconocido\" realizó la acción: actualizó sobre usuario (ID: 4).\nNombre: Pagador Bechapra, Email: pagador@bechapra.com, Rol: pagador_banca, Bloqueado: Sí', 0, '2025-07-20 03:40:48'),
(9, 1, 'El usuario 1 (admin_general) creó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante', 0, '2025-07-20 18:00:15'),
(10, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: Sí', 0, '2025-07-20 18:05:41'),
(11, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: No', 0, '2025-07-20 18:11:41'),
(12, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: aprobador, Bloqueado: No', 0, '2025-07-20 18:29:32'),
(13, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: pagador_banca, Bloqueado: No', 0, '2025-07-20 18:30:48'),
(14, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: No', 0, '2025-07-20 19:06:54'),
(15, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-20 19:16:18'),
(16, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-20 19:16:18'),
(17, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-20 22:36:48'),
(18, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-20 22:36:48'),
(19, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-20 22:36:48'),
(20, 9, 'Has eliminado una solicitud correctamente.', 0, '2025-07-20 22:39:50'),
(21, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-20 22:43:38'),
(22, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-20 23:52:21'),
(23, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: aprobador, Bloqueado: No', 0, '2025-07-21 00:01:59'),
(24, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: No', 0, '2025-07-21 00:21:27'),
(25, 1, 'El usuario 1 (admin_general) creó usuario (ID: 10). Nombre: TEST DOS, Email: test2@bechapra.com, Rol: aprobador', 0, '2025-07-21 00:22:12'),
(26, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-21 00:23:52'),
(28, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 1). Nuevo estado: autorizada', 0, '2025-07-21 00:23:52'),
(29, 9, '❌ Tu solicitud fue rechazada.', 0, '2025-07-21 00:32:37'),
(30, 10, '❌ Rechazaste la solicitud (ID: 1).', 0, '2025-07-21 00:32:37'),
(31, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 1). Nuevo estado: rechazada', 0, '2025-07-21 00:32:37'),
(32, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-21 00:34:07'),
(34, 10, '✅ Autorizaste la solicitud (ID: 1) correctamente.', 0, '2025-07-21 00:34:07'),
(35, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 1). Nuevo estado: autorizada', 0, '2025-07-21 00:34:07'),
(36, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: TEST 3, Email: test3@bechapra.com, Rol: pagador_banca, Contraseña: (actualizada), Bloqueado: No', 0, '2025-07-21 00:52:14'),
(37, 1, 'El usuario 1 (admin_general) eliminó usuario (ID: 4). Nombre: TEST 3, Email: test3@bechapra.com, Rol: pagador_banca', 0, '2025-07-21 00:53:31'),
(38, 1, 'El usuario 1 (admin_general) creó usuario (ID: 11). Nombre: TEST 3, Email: test3@bechapra.com, Rol: pagador_banca', 0, '2025-07-21 00:54:00'),
(39, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:17:15'),
(40, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:17:15'),
(41, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:26:15'),
(42, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:26:15'),
(43, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:35:34'),
(44, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:35:34'),
(45, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:42:59'),
(46, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:42:59'),
(47, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:46:42'),
(48, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:46:42'),
(49, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:50:48'),
(50, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:50:48'),
(51, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:53:15'),
(52, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:53:15'),
(53, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:59:51'),
(54, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:59:51'),
(55, 11, '✅ Marcaste como pagada la solicitud (ID: 1).', 0, '2025-07-21 01:59:51'),
(56, 1, 'El usuario 11 (pagador_banca) subió comprobante (ID: 1). para la solicitud #1', 0, '2025-07-21 02:01:53'),
(57, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-21 22:15:16'),
(58, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-21 22:15:16'),
(59, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-21 22:15:17'),
(60, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-21 22:15:17'),
(61, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-21 22:17:04'),
(62, 7, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-21 22:18:42'),
(63, 10, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-21 22:18:42'),
(64, 9, '¡Tu plantilla recurrente fue registrada exitosamente!', 0, '2025-07-21 22:18:44'),
(65, 7, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-21 22:21:29'),
(66, 10, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-21 22:21:29'),
(67, 9, '¡Tu plantilla recurrente fue registrada exitosamente!', 0, '2025-07-21 22:21:31'),
(68, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 10). Nombre: TEST DOS, Email: test2@bechapra.com, Rol: aprobador, Bloqueado: Sí', 0, '2025-07-22 00:51:17');

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
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  `fact_recurrente` varchar(255) DEFAULT NULL,
  `id_aprobador` int(11) DEFAULT NULL,
  `id_pagador` int(11) DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `comentario_aprobador` text DEFAULT NULL,
  `folio` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos_recurrentes`
--

INSERT INTO `pagos_recurrentes` (`id_recurrente`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `concepto`, `tipo_pago`, `frecuencia`, `siguiente_fecha`, `activo`, `estado`, `fact_recurrente`, `id_aprobador`, `id_pagador`, `fecha_revision`, `comentario_aprobador`, `folio`, `created_at`) VALUES
(1, 9, 'automatizaciones', 234567.00, '234567867890', 'sxedcrftvygbuhnijm', 'efectivo', 'quincenal', '2025-07-31', 1, 'pendiente', '/uploads/recurrente/1753157919949-482000485.png', NULL, NULL, NULL, NULL, NULL, '2025-07-21 22:47:52'),
(2, 9, 'automatizaciones', 12345678.00, '098765434567', 'XSDCRFVGBYHUN', 'administrativos', 'mensual', '2025-07-22', 1, 'pendiente', '/uploads/recurrente/1753158087670-475483814.png', NULL, NULL, NULL, NULL, 'AT-0001', '2025-07-21 22:47:52');

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
  `id_recurrente_origen` int(11) DEFAULT NULL,
  `folio` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_pago`
--

INSERT INTO `solicitudes_pago` (`id_solicitud`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `factura_url`, `concepto`, `tipo_pago`, `fecha_limite_pago`, `estado`, `comentario_aprobador`, `fecha_creacion`, `id_aprobador`, `id_pagador`, `fecha_revision`, `fecha_pago`, `id_recurrente_origen`, `folio`) VALUES
(1, 9, 'vinculacion', 99999.00, '1234567890', '/uploads/facturas/1753077141913-572432086.png', 'TEST PARA LA NOTIFICACION. DOS PARA REGISTRAR LA NOTIFICACION DD', 'administrativos', '2025-08-02', 'pagada', 'Solicitud aprobada', '2025-07-20 19:16:18', 10, 11, '2025-07-21 00:34:07', '2025-07-21 01:59:51', NULL, NULL),
(3, 9, 'administracion', 12345678.00, '1234567890', '/uploads/facturas/1753157714363-699632719.png', 'sxdcfvgb', 'efectivo', '2025-07-26', 'pendiente', NULL, '2025-07-21 22:15:14', NULL, NULL, NULL, NULL, NULL, 'CT-0001');

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
  `email_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password`, `rol`, `creado_en`, `intentos_fallidos`, `bloqueado`, `bloqueo_temporal_fin`, `bloqueo_temporal_activado`, `verificado`, `email_token`) VALUES
(1, 'Administrador Bechapra', 'enrique.bechapra@gmail.com', '$2b$10$xNzy0/pFv4tol00ZealTSOKLFsSUuRxs1LYb/z/9l3DxymRx8.DsW', 'admin_general', '2025-07-20 08:11:29', 0, 0, NULL, 0, 1, NULL),
(7, 'TEST ', 'kikegonzalez152@gmail.com', '$2b$10$ZSTcEnUT/YAT0pSU7lFFNuTYV3hVGDiVfnDvRjJ9eDOQ0/HYTZvnW', 'aprobador', '2025-07-20 09:01:21', 0, 0, NULL, 0, 1, NULL),
(8, 'KIKE ', 'kikeramirez160418@gmail.com', '$2b$10$HShmUIOTU05GESr53d7i4OOgMLIRdLFzRbWndVTxkLAJPkaUAWvnK', 'solicitante', '2025-07-20 09:27:09', 0, 0, NULL, 0, 1, NULL),
(9, 'TEST BECHAPRA', 'test@bechapra.com', '$2b$10$b9x81t6ZXVb.MF.o9qYjvOVIRC7xURqJE/LYO9/4TyJqoYO7qD.wG', 'solicitante', '2025-07-21 00:00:12', 0, 0, NULL, 0, 1, NULL),
(10, 'TEST DOS', 'test2@bechapra.com', '$2b$10$FP/xpm6qj.O7ewB9sJD/kO1PqqiufBGP9CUy8M.742oItcMWcB8bW', 'aprobador', '2025-07-21 06:22:11', 0, 1, NULL, 0, 1, NULL),
(11, 'TEST 3', 'test3@bechapra.com', '$2b$10$EkpH8mOvYG7D0bz/lxOGg.PJPZAPz8U6yu.zIWZAc4sCCuLnYxubK', 'pagador_banca', '2025-07-21 06:53:59', 0, 0, NULL, 0, 1, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT de la tabla `pagos_recurrentes`
--
ALTER TABLE `pagos_recurrentes`
  MODIFY `id_recurrente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
