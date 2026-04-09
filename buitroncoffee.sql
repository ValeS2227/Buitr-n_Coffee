-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2026 a las 05:08:59
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
-- Base de datos: `buitroncoffee`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `ID_Carrito` int(11) NOT NULL,
  `ID_Usuario` int(11) NOT NULL,
  `ID_Producto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL DEFAULT 1,
  `Fecha_Agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`ID_Carrito`, `ID_Usuario`, `ID_Producto`, `Cantidad`, `Fecha_Agregado`) VALUES
(21, 10, 2, 1, '2026-04-09 03:06:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `ID_Detalle` int(11) NOT NULL,
  `ID_Pedido` int(11) NOT NULL,
  `ID_Producto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `PrecioUnitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`ID_Detalle`, `ID_Pedido`, `ID_Producto`, `Cantidad`, `PrecioUnitario`) VALUES
(1, 1, 3, 5, 25000.00),
(2, 2, 2, 1, 18000.00),
(3, 3, 2, 6, 18000.00),
(4, 4, 3, 2, 25000.00),
(5, 5, 3, 2, 25000.00),
(6, 6, 1, 2, 12000.00),
(7, 7, 2, 1, 18000.00),
(8, 8, 2, 2, 18000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrada`
--

CREATE TABLE `entrada` (
  `ID_Entrada` int(11) NOT NULL COMMENT 'Identificador único de la entrada de inventario',
  `ID_Proveedor` int(11) NOT NULL COMMENT 'Proveedor que realiza la entrada',
  `Fecha_entrada` date NOT NULL COMMENT 'Fecha en la que se hizo la entrada de productos'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `ID_Pedido` int(11) NOT NULL,
  `ID_Usuario` int(11) NOT NULL,
  `Fecha` datetime NOT NULL,
  `Subtotal` decimal(10,2) NOT NULL,
  `Envio` decimal(10,2) NOT NULL,
  `Total` decimal(10,2) NOT NULL,
  `Estado` varchar(50) DEFAULT 'Pendiente',
  `Direccion` text DEFAULT NULL,
  `MetodoPago` varchar(50) DEFAULT 'Efectivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`ID_Pedido`, `ID_Usuario`, `Fecha`, `Subtotal`, `Envio`, `Total`, `Estado`, `Direccion`, `MetodoPago`) VALUES
(1, 8, '2026-03-22 17:59:51', 125000.00, 0.00, 125000.00, 'Pendiente', 'kokokoko', 'Efectivo'),
(2, 8, '2026-03-22 18:03:59', 18000.00, 5000.00, 23000.00, 'Pendiente', 'eSDASDQAE ADA', 'Efectivo'),
(3, 8, '2026-03-22 20:08:13', 108000.00, 0.00, 108000.00, 'Pendiente', 'asdasd', 'Efectivo'),
(4, 8, '2026-03-25 18:31:53', 50000.00, 0.00, 50000.00, 'Pendiente', 'DG 24 cra 05 sur', 'Tarjeta'),
(5, 8, '2026-03-25 18:37:48', 50000.00, 0.00, 50000.00, 'Pendiente', 'No especificada', 'Transferencia'),
(6, 10, '2026-04-08 21:43:02', 24000.00, 5000.00, 29000.00, 'Pendiente', 'No especificada', 'Transferencia'),
(7, 10, '2026-04-08 21:44:17', 18000.00, 5000.00, 23000.00, 'Pendiente', 'No especificada', 'Tarjeta'),
(8, 10, '2026-04-08 21:56:13', 36000.00, 5000.00, 41000.00, 'Pendiente', 'No especificada', 'Efectivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pqrs`
--

CREATE TABLE `pqrs` (
  `ID_PQRS` int(11) NOT NULL,
  `Codigo_Referencia` varchar(50) NOT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Tipo` enum('pregunta','queja','reclamo','sugerencia','felicitacion') NOT NULL,
  `Descripcion` text NOT NULL,
  `Estado` enum('pendiente','en proceso','resuelta','cerrada') DEFAULT 'pendiente',
  `Fecha_Creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `Fecha_Actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Respuesta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pqrs`
--

INSERT INTO `pqrs` (`ID_PQRS`, `Codigo_Referencia`, `ID_Usuario`, `Nombre`, `Email`, `Telefono`, `Tipo`, `Descripcion`, `Estado`, `Fecha_Creacion`, `Fecha_Actualizacion`, `Respuesta`) VALUES
(1, 'PQRS-20260402-095021', 10, 'Santiago Rodriguez', 'santidavila233@gmail.com', '3214569874', 'reclamo', 'No me gusto el café, estuvo en mal estado y sabia feo', 'resuelta', '2026-04-02 21:47:16', '2026-04-06 00:52:07', 'disculpe las molestias, estamos trabajando para verificar nuestros productos estén en excelente estado por favor discúlpenos! vuelva para proporcionarle un descuesto del 50%');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_Producto` int(11) NOT NULL COMMENT 'Identificador único del producto',
  `Nombre_producto` varchar(100) NOT NULL COMMENT 'Nombre comercial del producto',
  `Descripcion` varchar(255) DEFAULT NULL COMMENT 'Detalle o información general del producto',
  `Categoria` varchar(100) NOT NULL COMMENT 'Nivel de tostado o clasificación técnica del producto',
  `Precio` decimal(10,2) NOT NULL COMMENT 'Precio unitario del producto',
  `Stock` int(100) NOT NULL COMMENT 'Cantidad de productos disponibles',
  `imagen` varchar(255) DEFAULT NULL,
  `Estado` tinyint(1) DEFAULT 1,
  `ID_Proveedor` int(11) DEFAULT NULL,
  `calificacion_promedio` decimal(3,2) DEFAULT 0.00,
  `total_resenas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ID_Producto`, `Nombre_producto`, `Descripcion`, `Categoria`, `Precio`, `Stock`, `imagen`, `Estado`, `ID_Proveedor`, `calificacion_promedio`, `total_resenas`) VALUES
(1, 'Cafe tostado', 'Cafe con toston medio', 'Tostado', 12000.00, 30, 'cafe1.jpeg', 1, 5, 0.00, 0),
(2, 'Cafe fino', 'Cafe fino en maquina', 'Fino', 18000.00, 10, 'cafe2.jpeg', 1, 5, 0.00, 0),
(3, 'Cafe molido', 'molido por una maquina', 'Molido', 25000.00, 7, 'cafe3.jpeg', 1, 5, 0.00, 0),
(4, 'Café Geisha', 'Un Café muy suave y con un toque de sabor picante', 'Molido', 19000.00, 18, 'cafe3.jpeg', 1, 4, 5.00, 1),
(6, 'prueba', 'añañañañañañaña', 'Molido', 1000.00, 100, 'cafe1.jpeg', 0, 4, 0.00, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `ID_Proveedor` int(11) NOT NULL COMMENT 'Identificador único del proveedor',
  `Nombre_proveedor` varchar(100) NOT NULL COMMENT 'Nombre del proveedor',
  `Apellido` varchar(100) NOT NULL COMMENT 'Apellido del proveedor',
  `Telefono` varchar(20) NOT NULL COMMENT 'Número telefónico del proveedor',
  `Correo` varchar(100) NOT NULL COMMENT 'Correo electrónico del proveedor',
  `Direccion` varchar(255) NOT NULL COMMENT 'Dirección física del proveedor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`ID_Proveedor`, `Nombre_proveedor`, `Apellido`, `Telefono`, `Correo`, `Direccion`) VALUES
(1, 'Juan', 'Buitron', '31478952', 'Juan1970@gmail.com', 'Cra 67a 22-66 sur'),
(2, 'Jorge', 'Gonzales', '178694785', 'jagojites1082@gmail.com', 'Calle 45b #43-12'),
(3, 'Michael', 'Merlano', '314782475', 'maicolgeovany@gmail.com', 'Diagonal 49b #55-33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `calificacion` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reseñas`
--

INSERT INTO `reseñas` (`id`, `producto_id`, `usuario_id`, `nombre_usuario`, `calificacion`, `comentario`, `fecha`, `estado`) VALUES
(1, 4, 9, 'Laura', 5, 'Estaba muy rico, Muchas gracias! ', '2026-04-03 00:23:13', 'aprobada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `ID_Rol` int(11) NOT NULL COMMENT 'Identificador único del rol asignado',
  `Descripcion` varchar(100) NOT NULL COMMENT 'Descripción del rol y sus funciones',
  `Tipo_rol` varchar(50) NOT NULL COMMENT 'Tipo o categoría del rol'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`ID_Rol`, `Descripcion`, `Tipo_rol`) VALUES
(1, 'Administrador del sistema', 'Admin'),
(2, 'Usuario del sistema', 'Usuario'),
(3, 'Proveedor de los productos', 'Proveedor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL COMMENT 'Identificador único del usuario dentro del sistema',
  `Nombre_usuario` varchar(50) NOT NULL COMMENT 'Nombre del usuario registrado',
  `Apellido` varchar(50) NOT NULL COMMENT 'Apellido del usuario registrado',
  `Correo` varchar(100) NOT NULL COMMENT 'Dirección de correo usada para autenticación y notificaciones',
  `Documento` varchar(10) NOT NULL COMMENT 'Número de documento de identidad del usuario',
  `Telefono` varchar(20) NOT NULL COMMENT 'Número de teléfono de contacto',
  `Clave` varchar(255) NOT NULL COMMENT 'Contraseña de acceso del usuario (encriptada)',
  `ID_Rol` int(11) NOT NULL COMMENT 'Llave foránea que indica el rol o tipo de usuario dentro del sistema',
  `Estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre_usuario`, `Apellido`, `Correo`, `Documento`, `Telefono`, `Clave`, `ID_Rol`, `Estado`) VALUES
(4, 'Jorge', 'Gonzales', 'jagojites1082@gmail.com', '103766205', '1786947855', 'gorgiño', 3, 1),
(5, 'Michael', 'Merlano', 'maicolgeovany@gmail.com', '125478965', '314782475', 'ayjesucrito', 3, 1),
(8, 'Elkin', 'Camargo', 'elkinl1023@msn.com', '1023864852', '3147854962', '$2b$10$QYyWAjtPcMcJvgbqe3qViuF9wRpoBZaluAvYXE.ZAL7zuD9rDB.Zy', 1, 1),
(9, 'Laura', 'Marroquin', 'lauris07@gmail.com', '1028863203', '3256748903', '$2b$10$0b/IuGOtLHper3ebaB0EoeT7pG1cSYOJidk8M3BK833gKEAUhufr6', 2, 1),
(10, 'Santiago', 'Rodriguez', 'santidavila233@gmail.com', '1070598502', '3214569874', '$2b$10$CYSRDre8Y2jN1ImwsaJP/eZYwQk6.FQYnI2uLvy3sU1YP/RScNcCy', 2, 1),
(11, 'Admin', 'Sistema', 'admin@buitron.com', '123456789', '3000000000', '$2b$10$QYyWAjtPcMcJvgbqe3qViuF9wRpoBZaluAvYXE.ZAL7zuD9rDB.Zy', 2, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`ID_Carrito`),
  ADD KEY `ID_Usuario` (`ID_Usuario`),
  ADD KEY `ID_Producto` (`ID_Producto`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`ID_Detalle`),
  ADD KEY `ID_Pedido` (`ID_Pedido`),
  ADD KEY `ID_Producto` (`ID_Producto`);

--
-- Indices de la tabla `entrada`
--
ALTER TABLE `entrada`
  ADD PRIMARY KEY (`ID_Entrada`),
  ADD KEY `fk_entrada_proveedor` (`ID_Proveedor`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`ID_Pedido`),
  ADD KEY `ID_Usuario` (`ID_Usuario`);

--
-- Indices de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  ADD PRIMARY KEY (`ID_PQRS`),
  ADD UNIQUE KEY `Codigo_Referencia` (`Codigo_Referencia`),
  ADD KEY `ID_Usuario` (`ID_Usuario`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_Producto`),
  ADD KEY `ID_Proveedor` (`ID_Proveedor`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`ID_Proveedor`),
  ADD UNIQUE KEY `Correo` (`Correo`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`ID_Rol`),
  ADD UNIQUE KEY `Tipo_rol` (`Tipo_rol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD UNIQUE KEY `Nombre_usuario` (`Nombre_usuario`),
  ADD UNIQUE KEY `Correo` (`Correo`),
  ADD UNIQUE KEY `Documento` (`Documento`),
  ADD UNIQUE KEY `Telefono` (`Telefono`),
  ADD KEY `fk_usuario_rol` (`ID_Rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `ID_Carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `ID_Detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `entrada`
--
ALTER TABLE `entrada`
  MODIFY `ID_Entrada` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la entrada de inventario', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ID_Pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  MODIFY `ID_PQRS` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del producto', AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `ID_Proveedor` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del proveedor', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_Rol` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del rol asignado', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario dentro del sistema', AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`),
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `entrada`
--
ALTER TABLE `entrada`
  ADD CONSTRAINT `fk_entrada_proveedor` FOREIGN KEY (`ID_Proveedor`) REFERENCES `proveedor` (`ID_Proveedor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `pqrs`
--
ALTER TABLE `pqrs`
  ADD CONSTRAINT `pqrs_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`ID_Proveedor`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `reseñas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`ID_Producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `reseñas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`ID_Rol`) REFERENCES `rol` (`ID_Rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
