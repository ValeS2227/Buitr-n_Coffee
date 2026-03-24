-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-03-2026 a las 01:40:54
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
(8, 8, 1, 12, '2026-03-23 01:08:46');

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
(3, 3, 2, 6, 18000.00);

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
(3, 8, '2026-03-22 20:08:13', 108000.00, 0.00, 108000.00, 'Pendiente', 'asdasd', 'Efectivo');

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
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ID_Producto`, `Nombre_producto`, `Descripcion`, `Categoria`, `Precio`, `Stock`, `imagen`) VALUES
(1, 'Cafe tostado', 'Cafe con toston medio', 'Tostado', 12000.00, 30, 'cafe1.jpeg'),
(2, 'Cafe fino', 'Cafe fino en maquina', 'Fino', 18000.00, 10, 'cafe2.jpeg'),
(3, 'Cafe molido', 'molido por una maquina', 'Molido', 25000.00, 10, 'cafe3.jpeg');

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
  `producto_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `ID_Rol` int(11) NOT NULL COMMENT 'Llave foránea que indica el rol o tipo de usuario dentro del sistema'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre_usuario`, `Apellido`, `Correo`, `Documento`, `Telefono`, `Clave`, `ID_Rol`) VALUES
(4, 'Jorge', 'Gonzales', 'jagojites1082@gmail.com', '103766205', '1786947855', 'gorgiño', 3),
(5, 'Michael', 'Merlano', 'maicolgeovany@gmail.com', '125478965', '314782475', 'ayjesucrito', 3),
(8, 'Elkin', 'Camargo', 'elkinl1023@msn.com', '1023864852', '3147854962', '$2b$10$QYyWAjtPcMcJvgbqe3qViuF9wRpoBZaluAvYXE.ZAL7zuD9rDB.Zy', 2),
(9, 'Laura', 'Marroquin', 'lauris07@gmail.com', '1028863203', '3256748903', '$2b$10$0b/IuGOtLHper3ebaB0EoeT7pG1cSYOJidk8M3BK833gKEAUhufr6', 2);

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
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_Producto`);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `ID_Carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `ID_Detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `entrada`
--
ALTER TABLE `entrada`
  MODIFY `ID_Entrada` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la entrada de inventario', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ID_Pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del producto', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `ID_Proveedor` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del proveedor', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_Rol` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del rol asignado', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario dentro del sistema', AUTO_INCREMENT=10;

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
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`ID_Rol`) REFERENCES `rol` (`ID_Rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
