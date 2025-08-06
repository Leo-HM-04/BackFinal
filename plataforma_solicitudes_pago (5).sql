-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-08-2025 a las 00:50:04
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
-- Estructura de tabla para la tabla `comprobantes_viaticos`
--

CREATE TABLE `comprobantes_viaticos` (
  `id_comprobante` int(11) NOT NULL,
  `id_viatico` int(11) NOT NULL,
  `id_usuario_subio` int(11) NOT NULL,
  `archivo_url` varchar(255) NOT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(40, 'enrique.bechapra@gmail.com', '::1', '2025-07-21 23:19:19', 1),
(41, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 10:53:49', 1),
(42, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 10:55:00', 1),
(43, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 11:16:22', 1),
(44, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 11:16:37', 1),
(45, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 11:17:26', 1),
(46, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 11:26:33', 1),
(47, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 12:32:01', 1),
(48, 'test@bechapra.com', '::1', '2025-07-22 12:32:47', 1),
(49, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 12:36:32', 1),
(50, 'test2@bechapra.com', '::1', '2025-07-22 12:37:21', 1),
(51, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 13:37:47', 1),
(52, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 13:38:20', 1),
(53, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 13:42:32', 1),
(54, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 13:49:29', 1),
(55, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 13:49:57', 1),
(56, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 15:37:08', 1),
(57, 'test2@bechapra.com', '::1', '2025-07-22 15:38:57', 1),
(58, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 15:40:00', 1),
(59, 'test3@bechapra.com', '::1', '2025-07-22 15:40:32', 1),
(60, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 15:42:27', 1),
(61, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 15:59:35', 1),
(62, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 15:59:54', 1),
(63, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 16:00:28', 1),
(64, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 16:06:03', 1),
(65, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 16:08:53', 1),
(66, 'test@bechapra.com', '::1', '2025-07-22 16:13:38', 1),
(67, 'test2@bechapra.com', '::1', '2025-07-22 16:14:18', 1),
(68, 'test3@bechapra.com', '::1', '2025-07-22 16:14:44', 1),
(69, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 16:15:44', 1),
(70, 'enrique.bechapra@gmail.com', '::1', '2025-07-22 16:17:45', 1),
(71, 'test3@bechapra.com', '::1', '2025-07-22 16:18:08', 1),
(72, 'test@bechapra.com', '::1', '2025-07-22 16:23:16', 1),
(73, 'enrique.bechapra@gmail.com', '::1', '2025-07-23 09:33:03', 1),
(74, 'test@bechapra.com', '::1', '2025-07-23 09:33:55', 0),
(75, 'test@bechapra.com', '::1', '2025-07-23 09:34:10', 0),
(76, 'test@bechapra.com', '::1', '2025-07-23 09:34:16', 0),
(77, 'enrique.bechapra@gmail.com', '::1', '2025-07-23 09:35:05', 1),
(78, 'test@bechapra.com', '::1', '2025-07-23 09:40:33', 1),
(79, 'test2@bechapra.com', '::1', '2025-07-23 09:54:21', 0),
(80, 'test2@bechapra.com', '::1', '2025-07-23 09:55:03', 1),
(81, 'test@bechapra.com', '::1', '2025-07-23 09:55:52', 1),
(82, 'enrique.bechapra@gmail.com', '::1', '2025-07-23 10:04:02', 1),
(83, 'test2@bechapra.com', '::1', '2025-07-23 10:04:22', 1),
(84, 'test3@bechapra.com', '::1', '2025-07-23 12:53:57', 1),
(85, 'test@bechapra.com', '::1', '2025-07-23 14:37:48', 0),
(86, 'test@bechapra.com', '::1', '2025-07-23 14:37:57', 1),
(87, 'enrique.bechapra@gmail.com', '::1', '2025-07-23 15:01:08', 1),
(88, 'test@bechapra.com', '::1', '2025-07-23 15:02:34', 1),
(89, 'enrique.bechapra@gmail.com', '::1', '2025-07-23 15:07:06', 1),
(90, 'test@bechapra.com', '::1', '2025-07-23 15:07:19', 1),
(91, 'test@bechapra.com', '::1', '2025-07-23 15:11:53', 1),
(92, 'test2@bechapra.com', '::1', '2025-07-23 15:14:38', 1),
(93, 'test@bechapra.com', '::1', '2025-07-23 17:18:09', 1),
(94, 'test2@bechapra.com', '::1', '2025-07-24 09:51:19', 1),
(95, 'enrique.bechapra@gmail.com', '::1', '2025-07-24 09:51:31', 1),
(96, 'test@bechapra.com', '::1', '2025-07-24 09:52:28', 1),
(97, 'test3@bechapra.com', '::1', '2025-07-24 09:53:08', 1),
(98, 'enrique.bechapra@gmail.com', '::1', '2025-07-24 10:05:04', 1),
(99, 'test@bechapra.com', '::1', '2025-07-24 10:31:15', 1),
(100, 'test2@bechapra.com', '::1', '2025-07-24 15:42:52', 1),
(101, 'test3@bechapra.com', '::1', '2025-07-24 16:20:57', 1),
(102, 'enrique.bechapra@gmail.com', '::1', '2025-07-25 09:48:31', 1),
(103, 'test2@bechapra.com', '::1', '2025-07-25 09:50:22', 1),
(104, 'test@bechapra.com', '::1', '2025-07-25 09:51:18', 1),
(105, 'test@bechapra.com', '::1', '2025-07-25 09:51:25', 1),
(106, 'test3@bechapra.com', '::1', '2025-07-25 09:51:54', 1),
(107, 'test3@bechapra.com', '::1', '2025-07-25 09:52:11', 1),
(108, 'enrique.bechapra@gmail.com', '::1', '2025-07-25 09:53:04', 1),
(109, 'test@bechapra.com', '::1', '2025-07-25 10:25:40', 1),
(110, 'test3@bechapra.com', '::1', '2025-07-25 11:28:56', 1),
(111, 'enrique.bechapra@gmail.com', '::1', '2025-07-25 15:44:10', 1),
(112, 'test3@bechapra.com', '::1', '2025-07-25 15:44:33', 1),
(113, 'test3@bechapra.com', '::1', '2025-07-25 15:55:08', 1),
(114, 'test3@bechapra.com', '::1', '2025-07-25 16:29:06', 1),
(115, 'enrique.bechapra@gmail.com', '::1', '2025-07-25 16:31:28', 1),
(116, 'test2@bechapra.com', '::1', '2025-07-25 16:32:55', 1),
(117, 'test2@bechapra.com', '::1', '2025-07-29 09:15:24', 1),
(118, 'enrique.bechapra@gmail.com', '::1', '2025-07-29 11:09:58', 1),
(119, 'j.pedroza@bechapra.com', '::1', '2025-07-29 11:12:05', 1),
(120, 'test@bechapra.com', '::1', '2025-07-29 11:12:39', 1),
(121, 'test2@bechapra.com', '::1', '2025-07-29 11:14:09', 1),
(122, 'j.pedroza@bechapra.com', '::1', '2025-07-29 11:14:44', 1),
(123, 'j.pedroza@bechapra.com', '::1', '2025-07-29 11:18:49', 1),
(124, 'enrique.bechapra@gmail.com', '::1', '2025-07-29 11:19:10', 1),
(125, 'j.pedroza@bechapra.com', '::1', '2025-07-29 11:20:41', 1),
(126, 'test3@bechapra.com', '::1', '2025-07-29 11:35:51', 1),
(127, 'test@bechapra.com', '::1', '2025-07-29 11:54:03', 1),
(128, 'test2@bechapra.com', '::1', '2025-07-29 11:55:15', 1),
(129, 'enrique.bechapra@gmail.com', '::1', '2025-07-29 16:08:40', 1),
(130, 'test@bechapra.com', '::1', '2025-07-29 16:09:56', 1),
(131, 'test@bechapra.com', '::1', '2025-07-30 10:00:41', 1),
(132, 'test@bechapra.com', '::1', '2025-07-30 15:37:14', 1),
(133, 'test@bechapra.com', '::1', '2025-07-30 15:38:19', 1),
(134, 'enrique.bechapra@gmail.com', '::1', '2025-07-31 10:10:01', 1),
(135, 'test@bechapra.com', '::1', '2025-07-31 10:10:23', 1),
(136, 'test2@bechapra.com', '::1', '2025-07-31 10:11:23', 1),
(137, 'test3@bechapra.com', '::1', '2025-07-31 10:23:00', 1),
(138, 'pspspsps@bechapra.com', '::1', '2025-07-31 11:42:45', 1),
(139, 'enrique.bechapra@gmail.com', '::1', '2025-07-31 13:16:29', 1),
(140, 'test@bechapra.com', '::1', '2025-07-31 13:19:00', 1),
(141, 'test2@bechapra.com', '::1', '2025-07-31 13:30:13', 1),
(142, 'test3@bechapra.com', '::1', '2025-07-31 15:09:52', 1),
(143, 'test3@bechapra.com', '::1', '2025-08-04 09:21:55', 1),
(144, 'test@bechapra.com', '::1', '2025-08-04 11:10:16', 1),
(145, 'test3@bechapra.com', '::1', '2025-08-04 13:27:01', 1),
(146, 'test@bechapra.com', '::1', '2025-08-04 13:28:34', 1);

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
(3, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4)', 0, '2025-07-20 03:02:23'),
(4, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: Pagador Bechapra TEST, Email: pagador@bechapra.com, Rol: solicitante, Bloqueado: Sí', 1, '2025-07-20 03:04:18'),
(5, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: Pagador Bechapra TEST, Email: pagador@bechapra.com, Rol: pagador_banca, Bloqueado: No', 1, '2025-07-20 03:04:50'),
(6, 1, 'El usuario 1 (admin_general) creó usuario (ID: 8). Nombre: KIKE , Email: kikeramirez160418@gmail.com, Rol: solicitante', 1, '2025-07-20 03:27:11'),
(7, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: Pagador Bechapra, Email: pagador@bechapra.com, Rol: pagador_banca, Bloqueado: No', 1, '2025-07-20 03:35:52'),
(8, 1, 'El usuario \"Desconocido\" realizó la acción: actualizó sobre usuario (ID: 4).\nNombre: Pagador Bechapra, Email: pagador@bechapra.com, Rol: pagador_banca, Bloqueado: Sí', 1, '2025-07-20 03:40:48'),
(9, 1, 'El usuario 1 (admin_general) creó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante', 1, '2025-07-20 18:00:15'),
(10, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: Sí', 1, '2025-07-20 18:05:41'),
(11, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: No', 1, '2025-07-20 18:11:41'),
(12, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: aprobador, Bloqueado: No', 1, '2025-07-20 18:29:32'),
(13, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: pagador_banca, Bloqueado: No', 1, '2025-07-20 18:30:48'),
(14, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: No', 1, '2025-07-20 19:06:54'),
(15, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-20 19:16:18'),
(16, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-20 19:16:18'),
(17, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-20 22:36:48'),
(18, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-20 22:36:48'),
(19, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-20 22:36:48'),
(20, 9, 'Has eliminado una solicitud correctamente.', 0, '2025-07-20 22:39:50'),
(21, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-20 22:43:38'),
(22, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-20 23:52:21'),
(23, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: aprobador, Bloqueado: No', 1, '2025-07-21 00:01:59'),
(24, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Bloqueado: No', 1, '2025-07-21 00:21:27'),
(25, 1, 'El usuario 1 (admin_general) creó usuario (ID: 10). Nombre: TEST DOS, Email: test2@bechapra.com, Rol: aprobador', 1, '2025-07-21 00:22:12'),
(26, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-21 00:23:52'),
(28, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 1). Nuevo estado: autorizada', 1, '2025-07-21 00:23:52'),
(29, 9, '❌ Tu solicitud fue rechazada.', 0, '2025-07-21 00:32:37'),
(30, 10, '❌ Rechazaste la solicitud (ID: 1).', 1, '2025-07-21 00:32:37'),
(31, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 1). Nuevo estado: rechazada', 1, '2025-07-21 00:32:37'),
(32, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-21 00:34:07'),
(34, 10, '✅ Autorizaste la solicitud (ID: 1) correctamente.', 1, '2025-07-21 00:34:07'),
(35, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 1). Nuevo estado: autorizada', 1, '2025-07-21 00:34:07'),
(36, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 4). Nombre: TEST 3, Email: test3@bechapra.com, Rol: pagador_banca, Contraseña: (actualizada), Bloqueado: No', 1, '2025-07-21 00:52:14'),
(37, 1, 'El usuario 1 (admin_general) eliminó usuario (ID: 4). Nombre: TEST 3, Email: test3@bechapra.com, Rol: pagador_banca', 1, '2025-07-21 00:53:31'),
(38, 1, 'El usuario 1 (admin_general) creó usuario (ID: 11). Nombre: TEST 3, Email: test3@bechapra.com, Rol: pagador_banca', 1, '2025-07-21 00:54:00'),
(39, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:17:15'),
(40, 10, '💸 Se pagó la solicitud que aprobaste.', 1, '2025-07-21 01:17:15'),
(41, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:26:15'),
(42, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-21 01:26:15'),
(43, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:35:34'),
(44, 10, '💸 Se pagó la solicitud que aprobaste.', 1, '2025-07-21 01:35:34'),
(45, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:42:59'),
(46, 10, '💸 Se pagó la solicitud que aprobaste.', 1, '2025-07-21 01:42:59'),
(47, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:46:42'),
(48, 10, '💸 Se pagó la solicitud que aprobaste.', 1, '2025-07-21 01:46:42'),
(49, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:50:48'),
(50, 10, '💸 Se pagó la solicitud que aprobaste.', 1, '2025-07-21 01:50:48'),
(51, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:53:15'),
(52, 10, '💸 Se pagó la solicitud que aprobaste.', 1, '2025-07-21 01:53:15'),
(53, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-21 01:59:51'),
(54, 10, '💸 Se pagó la solicitud que aprobaste.', 1, '2025-07-21 01:59:51'),
(55, 11, '✅ Marcaste como pagada la solicitud (ID: 1).', 0, '2025-07-21 01:59:51'),
(56, 1, 'El usuario 11 (pagador_banca) subió comprobante (ID: 1). para la solicitud #1', 1, '2025-07-21 02:01:53'),
(57, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-21 22:15:16'),
(58, 10, '📥 Nueva solicitud pendiente de aprobación.', 1, '2025-07-21 22:15:16'),
(59, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-21 22:15:17'),
(60, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-21 22:15:17'),
(61, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-21 22:17:04'),
(62, 7, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-21 22:18:42'),
(63, 10, '📋 Nueva plantilla recurrente pendiente de aprobación.', 1, '2025-07-21 22:18:42'),
(64, 9, '¡Tu plantilla recurrente fue registrada exitosamente!', 0, '2025-07-21 22:18:44'),
(65, 7, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-21 22:21:29'),
(66, 10, '📋 Nueva plantilla recurrente pendiente de aprobación.', 1, '2025-07-21 22:21:29'),
(67, 9, '¡Tu plantilla recurrente fue registrada exitosamente!', 0, '2025-07-21 22:21:31'),
(68, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 10). Nombre: TEST DOS, Email: test2@bechapra.com, Rol: aprobador, Bloqueado: Sí', 1, '2025-07-22 00:51:17'),
(69, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 9). Nombre: TEST BECHAPRA, Email: test@bechapra.com, Rol: solicitante, Contraseña: (actualizada), Bloqueado: No', 1, '2025-07-22 12:32:26'),
(70, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-22 12:33:38'),
(71, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 10). Nombre: TEST DOS, Email: test2@bechapra.com, Rol: aprobador, Contraseña: (actualizada), Bloqueado: No', 1, '2025-07-22 12:36:46'),
(72, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 11). Nombre: TEST 3, Email: test3@bechapra.com, Rol: pagador_banca, Contraseña: (actualizada), Bloqueado: No', 1, '2025-07-22 12:37:09'),
(73, 12, '🎉 ¡Bienvenido/a PEPE! Tu cuenta ha sido creada exitosamente.', 0, '2025-07-22 16:22:02'),
(74, 1, '👤 Se ha creado un nuevo usuario:<br><b>Nombre:</b> PEPE<br><b>Email:</b> pspspsps@bechapra.com<br><b>Rol:</b> aprobador', 1, '2025-07-22 16:22:02'),
(75, 1, 'El usuario 1 (admin_general) creó usuario (ID: 12). Nombre: PEPE, Email: pspspsps@bechapra.com, Rol: aprobador', 1, '2025-07-22 16:22:06'),
(76, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-22 16:59:04'),
(77, 10, '📥 Nueva solicitud pendiente de aprobación.', 1, '2025-07-22 16:59:04'),
(78, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-22 16:59:04'),
(79, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-22 16:59:05'),
(80, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-22 16:59:05'),
(81, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 12:37:32'),
(82, 10, '📥 Nueva solicitud pendiente de aprobación.', 1, '2025-07-23 12:37:32'),
(83, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 12:37:32'),
(84, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-23 12:37:34'),
(85, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-23 12:37:34'),
(86, 7, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-23 12:51:17'),
(87, 10, '📋 Nueva plantilla recurrente pendiente de aprobación.', 1, '2025-07-23 12:51:17'),
(88, 12, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-23 12:51:17'),
(89, 9, '¡Tu plantilla recurrente fue registrada exitosamente!', 0, '2025-07-23 12:51:18'),
(90, 9, '✅ Tu plantilla recurrente fue aprobada.', 0, '2025-07-23 12:52:10'),
(91, 11, '📝 Nueva plantilla recurrente aprobada: solicitudes futuras listas para pago.', 0, '2025-07-23 12:52:10'),
(92, 9, '❌ Tu plantilla recurrente fue rechazada.', 0, '2025-07-23 12:52:52'),
(93, 7, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-23 12:58:58'),
(94, 10, '📋 Nueva plantilla recurrente pendiente de aprobación.', 1, '2025-07-23 12:58:58'),
(95, 12, '📋 Nueva plantilla recurrente pendiente de aprobación.', 0, '2025-07-23 12:58:58'),
(96, 9, '¡Tu plantilla recurrente fue registrada exitosamente!', 0, '2025-07-23 12:58:59'),
(97, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:01:05'),
(98, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:01:42'),
(99, 9, 'Has eliminado una solicitud correctamente.', 0, '2025-07-23 13:01:58'),
(100, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:06:10'),
(101, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:09:21'),
(102, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:14:02'),
(103, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:15:10'),
(104, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:17:16'),
(105, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:19:05'),
(106, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:23:21'),
(107, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:26:24'),
(108, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:28:03'),
(109, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:30:41'),
(110, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:34:47'),
(111, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 13:36:10'),
(112, 10, '📥 Nueva solicitud pendiente de aprobación.', 1, '2025-07-23 13:36:10'),
(113, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 13:36:10'),
(114, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-23 13:36:11'),
(115, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-23 13:36:11'),
(116, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:37:43'),
(117, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 13:40:24'),
(118, 10, '📥 Nueva solicitud pendiente de aprobación.', 1, '2025-07-23 13:40:24'),
(119, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 13:40:24'),
(120, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-23 13:40:26'),
(121, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-23 13:40:26'),
(122, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 13:46:14'),
(123, 10, '📥 Nueva solicitud pendiente de aprobación.', 1, '2025-07-23 13:46:14'),
(124, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-23 13:46:14'),
(125, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-23 13:46:16'),
(126, 1, 'El usuario 9 (solicitante) creó solicitud', 1, '2025-07-23 13:46:16'),
(127, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:49:46'),
(128, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-23 13:57:01'),
(129, 9, '✏️ Has editado tu solicitud correctamente.', 1, '2025-07-23 13:57:29'),
(130, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-24 13:10:52'),
(131, 11, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-24 13:10:52'),
(132, 10, '✅ Autorizaste la solicitud (ID: 7) correctamente.', 0, '2025-07-24 13:10:52'),
(133, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 7). Nuevo estado: autorizada', 0, '2025-07-24 13:10:52'),
(134, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-24 13:10:52'),
(135, 11, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-24 13:10:52'),
(136, 10, '✅ Autorizaste la solicitud (ID: 7) correctamente.', 0, '2025-07-24 13:10:52'),
(137, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 7). Nuevo estado: autorizada', 0, '2025-07-24 13:10:52'),
(138, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-24 13:10:53'),
(139, 11, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-24 13:10:53'),
(140, 10, '✅ Autorizaste la solicitud (ID: 7) correctamente.', 0, '2025-07-24 13:10:53'),
(141, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 7). Nuevo estado: autorizada', 0, '2025-07-24 13:10:53'),
(142, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-24 13:10:54'),
(143, 11, '📝 Nueva solicitud autorizada para pago.', 1, '2025-07-24 13:10:54'),
(144, 10, '✅ Autorizaste la solicitud (ID: 7) correctamente.', 0, '2025-07-24 13:10:54'),
(145, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 7). Nuevo estado: autorizada', 0, '2025-07-24 13:10:54'),
(146, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 12). Nombre: PEPE JUAN, Email: pspspsps@bechapra.com, Rol: aprobador, Bloqueado: No', 0, '2025-07-25 10:01:31'),
(147, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 12). Nombre: PEPE JUAN, Email: pspspsps@bechapra.com, Rol: aprobador, Bloqueado: Sí', 0, '2025-07-25 10:20:13'),
(148, 9, '💸 Tu pago recurrente ha sido marcado como pagado.', 0, '2025-07-25 12:46:01'),
(149, 10, '💸 Se pagó la plantilla recurrente que aprobaste.', 0, '2025-07-25 12:46:01'),
(150, 11, '✅ Marcaste como pagada la plantilla recurrente (ID: 2).', 0, '2025-07-25 12:46:01'),
(151, 9, '💸 Tu pago recurrente ha sido marcado como pagado.', 0, '2025-07-25 12:56:55'),
(152, 10, '💸 Se pagó la plantilla recurrente que aprobaste.', 0, '2025-07-25 12:56:55'),
(153, 11, '✅ Marcaste como pagada la plantilla recurrente (ID: 2).', 0, '2025-07-25 12:56:55'),
(154, 11, '💾 Se subió un comprobante a la plantilla recurrente.', 0, '2025-07-25 13:48:07'),
(155, 11, '💾 Se subió un comprobante a la plantilla recurrente.', 0, '2025-07-25 13:53:41'),
(156, 9, '💸 Tu pago recurrente ha sido marcado como pagado.', 0, '2025-07-25 15:09:05'),
(157, 10, '💸 Se pagó la plantilla recurrente que aprobaste.', 0, '2025-07-25 15:09:05'),
(158, 11, '✅ Marcaste como pagada la plantilla recurrente (ID: 3).', 0, '2025-07-25 15:09:05'),
(159, 11, '💾 Se subió un comprobante a la plantilla recurrente.', 0, '2025-07-25 15:10:20'),
(160, 9, '❌ Tu solicitud fue rechazada.', 0, '2025-07-25 16:52:40'),
(161, 10, '❌ Rechazaste la solicitud (ID: 6).', 0, '2025-07-25 16:52:40'),
(162, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 6). Nuevo estado: rechazada', 0, '2025-07-25 16:52:40'),
(163, 13, '🎉 ¡Bienvenido/a Jesus ! Tu cuenta ha sido creada exitosamente.', 1, '2025-07-29 11:11:45'),
(164, 1, '👤 Se ha creado un nuevo usuario:<br><b>Nombre:</b> Jesus <br><b>Email:</b> j.pedroza@bechapra.com<br><b>Rol:</b> pagador_banca', 0, '2025-07-29 11:11:45'),
(165, 1, 'El usuario 1 (admin_general) creó usuario (ID: 13). Nombre: Jesus , Email: j.pedroza@bechapra.com, Rol: pagador_banca', 0, '2025-07-29 11:11:48'),
(166, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:13:43'),
(167, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:13:43'),
(168, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:13:43'),
(169, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-29 11:13:45'),
(170, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-29 11:13:45'),
(171, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-29 11:14:30'),
(172, 11, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-29 11:14:30'),
(173, 13, '📝 Nueva solicitud autorizada para pago.', 1, '2025-07-29 11:14:30'),
(174, 10, '✅ Autorizaste la solicitud (ID: 9) correctamente.', 0, '2025-07-29 11:14:30'),
(175, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 9). Nuevo estado: autorizada', 0, '2025-07-29 11:14:30'),
(176, 9, '💸 Tu solicitud ha sido pagada.', 0, '2025-07-29 11:15:31'),
(177, 10, '💸 Se pagó la solicitud que aprobaste.', 0, '2025-07-29 11:15:31'),
(178, 13, '✅ Marcaste como pagada la solicitud (ID: 9).', 1, '2025-07-29 11:15:31'),
(179, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 13). Nombre: Jesus, Email: j.pedroza@bechapra.com, Rol: solicitante, Bloqueado: No', 0, '2025-07-29 11:20:14'),
(180, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:22:42'),
(181, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:22:42'),
(182, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:22:42'),
(183, 13, '¡Tu solicitud fue registrada exitosamente!', 1, '2025-07-29 11:22:44'),
(184, 1, 'El usuario 13 (solicitante) creó solicitud', 0, '2025-07-29 11:22:44'),
(185, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:54:50'),
(186, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:54:50'),
(187, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 11:54:50'),
(188, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-29 11:54:52'),
(189, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-29 11:54:52'),
(190, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:15:03'),
(191, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:15:03'),
(192, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:15:03'),
(193, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-29 12:15:05'),
(194, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-29 12:15:05'),
(195, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:16:49'),
(196, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:16:49'),
(197, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:16:49'),
(198, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-29 12:16:50'),
(199, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-29 12:16:50'),
(200, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-29 12:27:53'),
(201, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-29 12:29:52'),
(202, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:31:03'),
(203, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:31:03'),
(204, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 12:31:03'),
(205, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-29 12:31:05'),
(206, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-29 12:31:05'),
(207, 9, '❌ Tu solicitud fue rechazada.', 0, '2025-07-29 12:44:38'),
(208, 10, '❌ Rechazaste la solicitud (ID: 4).', 0, '2025-07-29 12:44:38'),
(209, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 4). Nuevo estado: rechazada', 0, '2025-07-29 12:44:38'),
(210, 9, '❌ Tu solicitud fue rechazada.', 0, '2025-07-29 12:44:39'),
(211, 10, '❌ Rechazaste la solicitud (ID: 4).', 0, '2025-07-29 12:44:39'),
(212, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 4). Nuevo estado: rechazada', 0, '2025-07-29 12:44:39'),
(213, 9, '❌ Tu solicitud fue rechazada.', 0, '2025-07-29 13:07:40'),
(214, 10, '❌ Rechazaste la solicitud (ID: 12).', 0, '2025-07-29 13:07:40'),
(215, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 12). Nuevo estado: rechazada', 0, '2025-07-29 13:07:40'),
(216, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-29 13:20:11'),
(217, 11, '📝 Nueva solicitud autorizada para pago.', 0, '2025-07-29 13:20:11'),
(218, 10, '✅ Autorizaste la solicitud (ID: 11) correctamente.', 0, '2025-07-29 13:20:11'),
(219, 1, 'El usuario 10 (aprobador) actualizó solicitud (ID: 11). Nuevo estado: autorizada', 0, '2025-07-29 13:20:11'),
(220, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-29 13:45:46'),
(221, 10, '✅ Autorizaste la solicitud (ID: 14) correctamente (lote).', 0, '2025-07-29 13:45:47'),
(222, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-29 13:55:05'),
(223, 10, '✅ Autorizaste la solicitud (ID: 4) correctamente (lote).', 0, '2025-07-29 13:55:05'),
(224, 9, '✅ Tu solicitud fue autorizada.', 0, '2025-07-29 13:55:08'),
(225, 10, '✅ Autorizaste la solicitud (ID: 14) correctamente (lote).', 0, '2025-07-29 13:55:08'),
(226, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 15:56:20'),
(227, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 15:56:20'),
(228, 12, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-07-29 15:56:20'),
(229, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-07-29 15:56:21'),
(230, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-07-29 15:56:21'),
(231, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-29 15:58:11'),
(232, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-29 15:58:40'),
(233, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-07-29 15:58:58'),
(234, 1, 'El usuario 9 (solicitante) crear viatico (ID: 8)', 0, '2025-07-30 11:20:39'),
(235, 1, 'El usuario 9 (solicitante) crear viatico (ID: 7)', 0, '2025-07-30 11:20:39'),
(236, 1, 'El usuario 9 (solicitante) subir viatico (ID: 8)', 0, '2025-07-30 11:20:41'),
(237, 1, 'El usuario 9 (solicitante) subir viatico (ID: 7)', 0, '2025-07-30 11:20:41'),
(238, 1, 'El usuario 9 (solicitante) crear viatico (ID: 9)', 0, '2025-07-30 11:20:43'),
(239, 1, 'El usuario 9 (solicitante) crear viatico (ID: 10)', 0, '2025-07-30 11:20:43'),
(240, 1, 'El usuario 9 (solicitante) subir viatico (ID: 9)', 0, '2025-07-30 11:20:45'),
(241, 1, 'El usuario 9 (solicitante) subir viatico (ID: 10)', 0, '2025-07-30 11:20:45'),
(242, 1, 'El usuario 9 (solicitante) crear viatico (ID: 11)', 0, '2025-07-30 11:20:47'),
(243, 1, 'El usuario 9 (solicitante) crear viatico (ID: 12)', 0, '2025-07-30 11:20:47'),
(244, 1, 'El usuario 9 (solicitante) subir viatico (ID: 12)', 0, '2025-07-30 11:20:48'),
(245, 1, 'El usuario 9 (solicitante) subir viatico (ID: 11)', 0, '2025-07-30 11:20:49'),
(246, 1, 'El usuario 9 (solicitante) crear viatico (ID: 13)', 0, '2025-07-30 12:17:26'),
(247, 1, 'El usuario 9 (solicitante) subir viatico (ID: 13)', 0, '2025-07-30 12:17:28'),
(248, 1, 'El usuario 9 (solicitante) crear viatico (ID: 14)', 0, '2025-07-30 12:17:36'),
(249, 1, 'El usuario 9 (solicitante) subir viatico (ID: 14)', 0, '2025-07-30 12:17:37'),
(250, 1, 'El usuario 9 (solicitante) crear viatico (ID: 15)', 0, '2025-07-30 12:17:39'),
(251, 1, 'El usuario 9 (solicitante) subir viatico (ID: 15)', 0, '2025-07-30 12:17:40'),
(252, 1, 'El usuario 9 (solicitante) crear viatico (ID: 16)', 0, '2025-07-30 12:20:51'),
(253, 1, 'El usuario 9 (solicitante) subir viatico (ID: 16)', 0, '2025-07-30 12:20:54'),
(254, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 15)', 0, '2025-07-30 12:44:17'),
(255, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 14)', 0, '2025-07-30 12:54:27'),
(256, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 16)', 0, '2025-07-30 12:54:33'),
(257, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 13:26:10'),
(258, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 13:26:12'),
(259, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 11)', 0, '2025-07-30 13:31:29'),
(260, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 12)', 0, '2025-07-30 13:41:37'),
(261, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 14:57:57'),
(262, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 15:05:22'),
(263, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 15:06:53'),
(264, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 15:12:22'),
(265, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 15:44:17'),
(266, 1, 'El usuario 9 (solicitante) actualizar viatico (ID: 13)', 0, '2025-07-30 15:49:00'),
(267, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:00:31'),
(268, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:00:37'),
(269, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:01:46'),
(270, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:01:47'),
(271, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:11:09'),
(272, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:11:11'),
(273, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:11:35'),
(274, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:11:38'),
(275, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:20:22'),
(276, 1, 'El usuario 9 (solicitante) crear viatico (ID: 17)', 0, '2025-07-30 16:21:28'),
(277, 1, 'El usuario 9 (solicitante) crear viatico (ID: 18)', 0, '2025-07-30 16:21:29'),
(278, 1, 'El usuario 9 (solicitante) crear viatico (ID: 19)', 0, '2025-07-30 16:21:47'),
(279, 1, 'El usuario 9 (solicitante) crear viatico (ID: 20)', 0, '2025-07-30 16:24:29'),
(280, 1, 'El usuario 9 (solicitante) crear viatico (ID: 21)', 0, '2025-07-30 16:24:55'),
(281, 1, 'El usuario 9 (solicitante) crear viatico (ID: 22)', 0, '2025-07-30 16:44:14'),
(282, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 8)', 0, '2025-07-30 16:45:40'),
(283, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 18)', 0, '2025-07-30 16:45:52'),
(284, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 17)', 0, '2025-07-30 16:46:00'),
(285, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 19)', 0, '2025-07-30 16:46:06'),
(286, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 20)', 0, '2025-07-30 16:48:53'),
(287, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 21)', 0, '2025-07-30 16:48:57'),
(288, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 2)', 0, '2025-07-30 16:49:03'),
(289, 1, 'El usuario 9 (solicitante) editar viatico (ID: 22)', 0, '2025-07-30 16:49:39'),
(290, 1, 'El usuario 9 (solicitante) editar viatico (ID: 22)', 0, '2025-07-30 16:51:46'),
(291, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:55:36'),
(292, 1, 'El usuario 9 (solicitante) editar viatico (ID: 13)', 0, '2025-07-30 16:55:50'),
(293, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 5)', 0, '2025-07-30 16:56:49'),
(294, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 3)', 0, '2025-07-30 16:56:55'),
(295, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 1)', 0, '2025-07-30 16:57:01'),
(296, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 4)', 0, '2025-07-30 16:57:07'),
(297, 1, 'El usuario 9 (solicitante) eliminar viatico (ID: 6)', 0, '2025-07-30 16:57:13'),
(298, 1, 'El usuario 9 (solicitante) editar viatico (ID: 11)', 0, '2025-07-31 10:11:00'),
(299, 1, 'El usuario 9 (solicitante) crear viatico (ID: 23)', 0, '2025-07-31 10:14:25'),
(300, 1, 'El usuario 9 (solicitante) crear viatico (ID: 24)', 0, '2025-07-31 10:14:25'),
(301, 1, 'El usuario 9 (solicitante) editar viatico (ID: 23)', 0, '2025-07-31 10:14:52'),
(302, 1, 'El usuario 1 (admin_general) actualizó usuario (ID: 12). Nombre: PEPE JUAN, Email: pspspsps@bechapra.com, Rol: solicitante, Contraseña: (actualizada), Bloqueado: No', 0, '2025-07-31 11:42:33'),
(303, 1, 'El usuario 12 (solicitante) crear viatico (ID: 25)', 0, '2025-07-31 11:43:46'),
(304, 1, 'El usuario 12 (solicitante) crear viatico (ID: 26)', 0, '2025-07-31 11:43:46'),
(305, 9, 'Tu viático folio null fue <b>aprobado</b>.', 0, '2025-07-31 12:50:41'),
(306, 9, 'Tu viático folio null fue <b>aprobado</b>.', 0, '2025-07-31 12:50:41'),
(307, 1, 'El usuario 10 (aprobador) aprobar-lote viatico (ID: 12,7)', 0, '2025-07-31 12:50:41'),
(308, 9, 'Tu viático folio null fue <b>rechazado</b>.', 0, '2025-07-31 12:51:49'),
(309, 1, 'El usuario 10 (aprobador) rechazar-lote viatico (ID: 10)', 0, '2025-07-31 12:51:49'),
(310, 9, 'Tu viático folio null fue <b>aprobado</b>.', 0, '2025-07-31 12:55:55'),
(311, 9, 'Tu viático folio null fue <b>aprobado</b>.', 0, '2025-07-31 12:55:55'),
(312, 9, 'Tu viático folio null fue <b>aprobado</b>.', 0, '2025-07-31 12:55:56'),
(313, 1, 'El usuario 10 (aprobador) aprobar-lote viatico (ID: 7,10,12)', 0, '2025-07-31 12:55:56'),
(314, 9, 'Tu viático folio null fue <b>rechazado</b>.', 0, '2025-07-31 12:57:18'),
(315, 9, 'Tu viático folio null fue <b>rechazado</b>.', 0, '2025-07-31 12:57:18'),
(316, 9, 'Tu viático folio null fue <b>rechazado</b>.', 0, '2025-07-31 12:57:18'),
(317, 9, 'Tu viático folio TI-0002 fue <b>rechazado</b>.', 0, '2025-07-31 12:57:18'),
(318, 1, 'El usuario 10 (aprobador) rechazar-lote viatico (ID: 10,12,7,24)', 0, '2025-07-31 12:57:18'),
(319, 9, 'Tu viático folio AT-0001 fue <b>aprobado</b>.', 0, '2025-07-31 12:57:42'),
(320, 9, 'Tu viático folio null fue <b>aprobado</b>.', 0, '2025-07-31 12:57:42'),
(321, 1, 'El usuario 10 (aprobador) aprobar-lote viatico (ID: 13,9)', 0, '2025-07-31 12:57:42'),
(322, 12, 'Tu viático folio TS-0001 fue <b>aprobado</b>.', 0, '2025-07-31 15:37:46'),
(323, 1, 'El usuario 10 (aprobador) aprobar-lote viatico (ID: 25)', 0, '2025-07-31 15:37:46'),
(324, 1, 'El usuario 11 (pagador_banca) pagar viatico (ID: 9)', 0, '2025-07-31 15:40:09'),
(325, 1, 'El usuario 11 (pagador_banca) pagar viatico (ID: 12)', 0, '2025-07-31 15:40:09'),
(326, 1, 'El usuario 11 (pagador_banca) pagar viatico (ID: 7)', 0, '2025-07-31 15:51:01'),
(327, 1, 'El usuario 11 (pagador_banca) pagar viatico (ID: 13)', 0, '2025-07-31 15:51:01'),
(328, 1, 'El usuario 11 (pagador_banca) pagar viatico (ID: 25)', 0, '2025-07-31 15:51:23'),
(329, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-08-04 11:21:20'),
(330, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-08-04 11:21:20'),
(331, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-08-04 11:21:21'),
(332, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-08-04 11:21:21'),
(333, 7, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-08-04 11:39:06'),
(334, 10, '📥 Nueva solicitud pendiente de aprobación.', 0, '2025-08-04 11:39:06'),
(335, 9, '¡Tu solicitud fue registrada exitosamente!', 0, '2025-08-04 11:39:08'),
(336, 1, 'El usuario 9 (solicitante) creó solicitud', 0, '2025-08-04 11:39:08'),
(337, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 11:52:33'),
(338, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 11:53:36'),
(339, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:01:34'),
(340, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:02:32'),
(341, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:05:57'),
(342, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:13:18'),
(343, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:17:00'),
(344, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:19:45'),
(345, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:22:49'),
(346, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:37:05'),
(347, 9, '✏️ Has editado tu solicitud correctamente.', 0, '2025-08-04 12:48:14');

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
  `estado` enum('pendiente','aprobada','rechazada','pagada') NOT NULL,
  `fact_recurrente` varchar(255) DEFAULT NULL,
  `com_recurrente` varchar(255) DEFAULT NULL,
  `id_aprobador` int(11) DEFAULT NULL,
  `id_pagador` int(11) DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `comentario_aprobador` text DEFAULT NULL,
  `folio` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `fecha_pago` datetime DEFAULT NULL,
  `com_recurrentes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos_recurrentes`
--

INSERT INTO `pagos_recurrentes` (`id_recurrente`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `concepto`, `tipo_pago`, `frecuencia`, `siguiente_fecha`, `activo`, `estado`, `fact_recurrente`, `com_recurrente`, `id_aprobador`, `id_pagador`, `fecha_revision`, `comentario_aprobador`, `folio`, `created_at`, `fecha_pago`, `com_recurrentes`) VALUES
(1, 9, 'automatizaciones', 234567.00, '234567867890', 'sxedcrftvygbuhnijm', 'efectivo', 'quincenal', '2025-07-31', 1, 'pendiente', '/uploads/recurrente/1753157919949-482000485.png', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-21 22:47:52', NULL, NULL),
(2, 9, 'automatizaciones', 12345678.00, '098765434567', 'XSDCRFVGBYHUN', 'administrativos', 'mensual', '2025-07-22', 1, 'pagada', '/uploads/recurrente/1753158087670-475483814.png', '/uploads/comprobante-recurrentes/1753473217131-447815208.pdf', 10, 11, '2025-07-23 12:52:05', 'Solicitud aprobada', 'AT-0001', '2025-07-21 22:47:52', '2025-07-25 12:56:51', NULL),
(3, 9, 'automatizaciones', 1234.00, '123456789098765544', 'FGBHNJ', 'nominas', 'quincenal', '2025-08-02', 1, 'pagada', '/uploads/recurrente/1753296675938-608315132.png', '/uploads/comprobante-recurrentes/1753477816615-105904686.pdf', 10, 11, '2025-07-23 12:52:48', 'Solicitud rechazada', 'AT-0002', '2025-07-23 12:51:15', '2025-07-25 15:08:54', NULL),
(4, 9, 'vinculacion', 1234.00, '123456789098765544', 'NYBTVRCE', 'tarjeta', 'diario', '2025-08-02', 1, 'pendiente', '/uploads/recurrente/1753297137130-757843797.png', NULL, NULL, NULL, NULL, NULL, 'VN-0001', '2025-07-23 12:58:57', NULL, NULL);

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
  `tipo_pago_descripcion` text DEFAULT NULL,
  `empresa_a_pagar` varchar(255) DEFAULT NULL,
  `nombre_persona` varchar(255) NOT NULL,
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
(1, 9, 'vinculacion', 99999.00, '1234567890', '/uploads/facturas/1753077141913-572432086.png', 'TEST PARA LA NOTIFICACION. DOS PARA REGISTRAR LA NOTIFICACION DD', 'administrativos', NULL, NULL, '', '2025-08-02', 'pagada', 'Solicitud aprobada', '2025-07-20 19:16:18', 10, 11, '2025-07-21 00:34:07', '2025-07-21 01:59:51', NULL, NULL, 'CLABE', NULL, NULL),
(3, 9, 'cobranza', 12345678.00, '123456789009876543', '/uploads/facturas/1753157714363-699632719.png', 'sxdcfvgb', 'efectivo', NULL, NULL, '', '2025-07-26', 'pendiente', NULL, '2025-07-21 22:15:14', NULL, NULL, NULL, NULL, NULL, 'CT-0001', 'CLABE', NULL, 'Bancoppel'),
(4, 9, 'administracion', 90888.00, '123456789012345633', '/uploads/facturas/1753298598051-887539122.png', 'EWRE', 'viaticos', NULL, NULL, '', '2025-07-22', 'autorizada', 'Aprobación de viáticos en lote', '2025-07-22 16:59:02', 10, NULL, '2025-07-29 13:55:02', NULL, NULL, 'AD-0001', 'CLABE', NULL, 'Bancoppel'),
(6, 9, 'administracion', 12345.00, '1234567890987654', '/uploads/facturas/1753299369209-863204555.png', 'YBTV', 'viaticos', NULL, NULL, '', '2025-07-24', 'pendiente', 'Solicitud rechazada', '2025-07-23 13:36:09', 10, NULL, '2025-07-25 16:52:37', NULL, NULL, 'AD-0002', 'CLABE', '', 'Banco del Bajío'),
(7, 9, 'facturacion', 9876543.00, '1234567890987654', '/uploads/facturas/1753299623053-901948162.png', 'DDD', 'viaticos', NULL, NULL, '', '2025-07-24', 'pendiente', 'Solicitud aprobada', '2025-07-23 13:40:23', 10, NULL, '2025-07-24 13:10:49', NULL, NULL, 'FC-0001', 'Tarjeta', 'Débito', 'Otros'),
(8, 9, 'facturacion', 11233.00, '123456789098765432', '/uploads/facturas/1753299971594-284825651.png', 'KKJJJJ', 'factura', NULL, NULL, '', '2025-08-01', 'pendiente', NULL, '2025-07-23 13:46:11', NULL, NULL, NULL, NULL, NULL, 'FC-0002', 'CLABE', '', 'Banco del Bajío'),
(9, 9, 'facturacion', 123456.00, '2468097643212344', '/uploads/facturas/1753809221500-250159177.pdf', 'TEST ', 'factura', NULL, NULL, '', '2025-08-01', 'pagada', 'Solicitud aprobada', '2025-07-29 11:13:41', 10, 13, '2025-07-29 11:14:26', '2025-07-29 11:15:27', NULL, 'FC-0003', 'Tarjeta', 'Crédito', 'Banco Famsa'),
(10, 13, 'cobranza', 10000.00, '1234567890987654', '/uploads/facturas/1753809760595-121319852.pdf', 'TEST 80', 'proveedores', NULL, NULL, '', '2025-08-02', 'pendiente', NULL, '2025-07-29 11:22:40', NULL, NULL, NULL, NULL, NULL, 'CB-0001', 'Tarjeta', 'Débito', 'Santander'),
(11, 9, 'cobranza', 34568.00, '2456799008765432', '/uploads/facturas/1753811689216-20802943.pdf', 'test de viatico ', 'factura', NULL, NULL, '', '2025-08-02', 'autorizada', 'Solicitud aprobada', '2025-07-29 11:54:49', 10, NULL, '2025-07-29 13:20:07', NULL, NULL, 'CB-0002', 'Tarjeta', 'Débito', 'Banco Multiva'),
(12, 9, 'contabilidad', 123456.00, '1234567890987654', '/uploads/facturas/1753813789872-980803240.pdf', 'TEST ', '', NULL, NULL, '', '2025-07-28', 'rechazada', 'Solicitud rechazada', '2025-07-29 12:15:01', 10, NULL, '2025-07-29 13:07:36', NULL, NULL, 'CT-0002', 'Tarjeta', 'Débito', 'BBVA'),
(13, 9, 'vinculacion', 34568.00, '1234567890987654', '/uploads/facturas/1753813007065-877384733.pdf', 'SDCFV', '', NULL, NULL, '', '2025-08-02', 'pendiente', NULL, '2025-07-29 12:16:47', NULL, NULL, NULL, NULL, NULL, 'VN-0001', 'Tarjeta', 'Crédito', 'Inbursa'),
(14, 9, 'vinculacion', 22222.00, '1234567890987654', '/uploads/facturas/1753813861885-908887499.pdf', 'GERGER', 'viaticos', NULL, NULL, '', '2025-09-19', 'autorizada', 'Aprobación de viáticos en lote', '2025-07-29 12:31:01', 10, NULL, '2025-07-29 13:55:02', NULL, NULL, 'VN-0002', 'Tarjeta', 'Débito', 'Citibanamex'),
(15, 9, 'vinculacion', 987654.00, '123456789098765432', '/uploads/facturas/1753826178579-606991193.pdf', 'YJHTHRTGRTHY', 'viaticos', NULL, NULL, '', '2025-08-01', 'pendiente', NULL, '2025-07-29 15:56:18', NULL, NULL, NULL, NULL, NULL, 'VN-0003', 'CLABE', 'Débito', 'Bancoppel'),
(16, 9, 'facturacion', 900000.00, '123456789098754323', '/uploads/facturas/1754333291168-742801529.xlsx', 'TEST ', 'factura', 'test de update 6363', NULL, 'JUAN ', '2025-08-13', 'pendiente', NULL, '2025-08-04 11:21:18', NULL, NULL, NULL, NULL, NULL, 'FC-0004', 'CLABE', '', 'ARCUS FI'),
(17, 9, 'contabilidad', 123456.00, '122345786978674564', '/uploads/facturas/1754329143345-468751570.pdf', 'TEST JAJA DOS ', 'efectivo', 'TEST UPDATE ', 'BERCEL ', 'JOSE ANTONIO LOPEZ ', '2025-08-13', 'pendiente', NULL, '2025-08-04 11:39:03', NULL, NULL, NULL, NULL, NULL, 'CT-0003', 'CLABE', '', 'Santander');

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

INSERT INTO `solicitudes_viaticos` (`id_viatico`, `id_usuario`, `departamento`, `monto`, `cuenta_destino`, `viatico_url`, `concepto`, `tipo_pago`, `fecha_limite_pago`, `estado`, `comentario_aprobador`, `fecha_creacion`, `id_aprobador`, `id_pagador`, `fecha_revision`, `fecha_pago`, `folio`, `tipo_cuenta_destino`, `tipo_tarjeta`, `banco_destino`) VALUES
(7, 9, 'ti', 6666.00, '323223243432', '/uploads/viaticos/1753896041620-766951371.png', 'VIAJE ', 'viaticos', '2025-08-20', 'autorizada', '', '2025-07-30 11:20:39', 10, 11, '2025-07-31 12:50:40', '2025-07-31 15:51:01', NULL, 'BANCO ', 'CREDITO ', 'Banjercito '),
(9, 9, 'ti', 6666.00, '323223243432', '/uploads/viaticos/1753896045436-134389347.png', 'VIAJE ', 'viaticos', '2025-08-20', 'pagada', 'Solicitudes aprobadas en lote', '2025-07-30 11:20:43', 10, 11, '2025-07-31 12:57:42', '2025-07-31 15:40:08', NULL, 'BANCO ', 'CREDITO ', 'Banjercito '),
(10, 9, 'ti', 900.00, '323223243432', '/uploads/viaticos/1753896045654-364575116.png', 'VIAJE ', 'viaticos', '2025-08-08', 'rechazada', '', '2025-07-30 11:20:43', 10, NULL, '2025-07-31 12:51:49', NULL, NULL, 'BANCO ', 'CREDITO ', 'Banjercito '),
(11, 9, 'atencion a clientes', 6666.00, '323223243432', '/uploads/viaticos/1753896049134-370000810.png', 'VIAJE ', 'viaticos', '2025-08-20', 'pendiente', NULL, '2025-07-30 11:20:47', NULL, NULL, NULL, NULL, 'AC-0001', 'credito', 'nomina', 'bajio'),
(12, 9, 'ti', 900.00, '323223243432', '/uploads/viaticos/1753896048984-760745375.png', 'VIAJE ', 'viaticos', '2025-08-08', 'pagada', '', '2025-07-30 11:20:47', 10, 11, '2025-07-31 12:50:40', '2025-07-31 15:40:09', NULL, 'nomina', 'CREDITO ', 'Banjercito '),
(13, 9, 'automatizaciones', 66539.93, '323223243432', '/uploads/viaticos/1753913495665-227933637.png', 'VIAJE TULUM JAJ', '', '2025-09-05', 'pagada', 'Solicitudes aprobadas en lote', '2025-07-30 12:17:26', 10, 11, '2025-07-31 12:57:42', '2025-07-31 15:51:01', 'AT-0001', 'debito', 'nomina', 'otro'),
(22, 9, 'automatizaciones', 1289.00, '323223243432', '/uploads/viaticos/1753915454717-575186846.pdf', 'VIAJE TULUM JAJ', 'viaticos', '2025-09-04', 'pendiente', NULL, '2025-07-30 16:44:14', NULL, NULL, NULL, NULL, 'FC-0001', 'nomina', 'credito', 'ci banco'),
(23, 9, 'atencion a clientes', 32311.00, '323223243432', '/uploads/viaticos/1753978465085-414675608.pdf', 'VIAJE TULUM JAJ', 'viaticos', '2025-08-01', 'pendiente', NULL, '2025-07-31 10:14:25', NULL, NULL, NULL, NULL, 'AC-0002', 'nomina', 'debito', 'banregio'),
(24, 9, 'ti', 32311.00, '323223243432', '/uploads/viaticos/1753978465824-555680461.pdf', 'VIAJE TULUM JAJ', 'viaticos', '2025-08-01', 'rechazada', 'Solicitudes rechazadas en lote', '2025-07-31 10:14:25', 10, NULL, '2025-07-31 12:57:18', NULL, 'TI-0002', 'nomina', 'debito', 'banregio'),
(25, 12, 'tesoreria', 221.00, '323223243432', '/uploads/viaticos/1753983826329-523002357.pdf', 'VIAJE ', 'viaticos', '2025-08-05', 'autorizada', 'Solicitudes aprobadas en lote', '2025-07-31 11:43:46', 10, 11, '2025-07-31 15:37:46', '2025-07-31 15:51:23', 'TS-0001', 'vale', 'vale', 'bancoppel'),
(26, 12, 'cobranza', 212212.00, '0987654321', '/uploads/viaticos/1753983826379-886413773.pdf', 'VIAJE TULUM JAJ', 'viaticos', '2025-08-07', 'autorizada', NULL, '2025-07-31 11:43:46', NULL, NULL, NULL, NULL, 'CB-0001', 'credito', 'credito', 'otro');

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
(1, 'Administrador Bechapra', 'enrique.bechapra@gmail.com', '$2b$10$xNzy0/pFv4tol00ZealTSOKLFsSUuRxs1LYb/z/9l3DxymRx8.DsW', 'admin_general', '2025-07-20 08:11:29', 0, 0, NULL, 0, 1, NULL, 1),
(7, 'TEST ', 'kikegonzalez152@gmail.com', '$2b$10$ZSTcEnUT/YAT0pSU7lFFNuTYV3hVGDiVfnDvRjJ9eDOQ0/HYTZvnW', 'aprobador', '2025-07-20 09:01:21', 0, 0, NULL, 0, 1, NULL, 0),
(8, 'KIKE ', 'kikeramirez160418@gmail.com', '$2b$10$HShmUIOTU05GESr53d7i4OOgMLIRdLFzRbWndVTxkLAJPkaUAWvnK', 'solicitante', '2025-07-20 09:27:09', 0, 0, NULL, 0, 0, NULL, 0),
(9, 'TEST BECHAPRA', 'test@bechapra.com', '$2b$10$23JzsqS2040Q5IQ/AWITN.zLhdPKMMBsabgpDWJXaNOuE0Yqb6i9W', 'solicitante', '2025-07-21 00:00:12', 0, 0, NULL, 0, 1, NULL, 1),
(10, 'TEST DOS', 'test2@bechapra.com', '$2b$10$n77gmOqwgPnAj6W6jpe3QO5IgPEsBPTt3g48AsXvwgq3Z3YXn0fru', 'aprobador', '2025-07-21 06:22:11', 0, 0, NULL, 0, 1, NULL, 1),
(11, 'TEST 3', 'test3@bechapra.com', '$2b$10$9E/mKisR2qxcsP2w94bjP.JscfJtAaVR.0SkdzYVGxcWix85DhTHe', 'pagador_banca', '2025-07-21 06:53:59', 0, 0, NULL, 0, 1, NULL, 0),
(12, 'PEPE JUAN', 'pspspsps@bechapra.com', '$2b$10$8bvtRjxotn35DK7YCoSrUuOeafiNIZfvB6OpzAvFOmGFGywvJmonC', 'solicitante', '2025-07-22 22:22:00', 0, 0, NULL, 0, 1, NULL, 0),
(13, 'Jesus', 'j.pedroza@bechapra.com', '$2b$10$9CBoBJBrKIRcW8Hf4y35GOHzzapibZeUWVU8qqmfTjEzpOoQ7gyb2', 'solicitante', '2025-07-29 17:11:43', 0, 0, NULL, 0, 1, NULL, 0);

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
-- Indices de la tabla `viaticos_detalle`
--
ALTER TABLE `viaticos_detalle`
  ADD PRIMARY KEY (`id_viatico`),
  ADD KEY `id_solicitud` (`id_solicitud`);

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
  MODIFY `id_comprobante` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ejecuciones_recurrentes`
--
ALTER TABLE `ejecuciones_recurrentes`
  MODIFY `id_ejecucion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `login_audit`
--
ALTER TABLE `login_audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=348;

--
-- AUTO_INCREMENT de la tabla `pagos_recurrentes`
--
ALTER TABLE `pagos_recurrentes`
  MODIFY `id_recurrente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `solicitudes_pago`
--
ALTER TABLE `solicitudes_pago`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `solicitudes_viaticos`
--
ALTER TABLE `solicitudes_viaticos`
  MODIFY `id_viatico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `viaticos_detalle`
--
ALTER TABLE `viaticos_detalle`
  MODIFY `id_viatico` int(11) NOT NULL AUTO_INCREMENT;

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
-- Filtros para la tabla `viaticos_detalle`
--
ALTER TABLE `viaticos_detalle`
  ADD CONSTRAINT `viaticos_detalle_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_pago` (`id_solicitud`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
