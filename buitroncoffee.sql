-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-04-2026 a las 15:40:48
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
  `ID_Carrito` int(11) NOT NULL COMMENT 'Identificador único del item en el carrito',
  `ID_Usuario` int(11) NOT NULL COMMENT 'Identificador del usuario propietario del carrito',
  `ID_Producto` int(11) NOT NULL COMMENT 'Identificador del producto agregado',
  `Cantidad` int(11) NOT NULL DEFAULT 1 COMMENT 'Cantidad del producto seleccionado',
  `Fecha_Agregado` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha y hora en que se agregó el producto'
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `ID_Detalle` int(11) NOT NULL COMMENT 'Identificador único del detalle del pedido',
  `ID_Pedido` int(11) NOT NULL COMMENT 'Identificador del pedido al que pertenece este detalle',
  `ID_Producto` int(11) NOT NULL COMMENT 'Identificador del producto comprado',
  `Cantidad` int(11) NOT NULL COMMENT 'Cantidad de unidades del producto',
  `PrecioUnitario` decimal(10,2) NOT NULL COMMENT 'Precio unitario del producto al momento de la compra'
) ;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`ID_Detalle`, `ID_Pedido`, `ID_Producto`, `Cantidad`, `PrecioUnitario`) VALUES
(1, 1, 4, 1, 19000.00),
(2, 1, 2, 2, 18000.00),
(3, 2, 2, 1, 18000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrada`
--

CREATE TABLE `entrada` (
  `ID_Entrada` int(11) NOT NULL COMMENT 'Identificador único de la entrada de inventario',
  `ID_Proveedor` int(11) NOT NULL COMMENT 'Proveedor que realiza la entrada',
  `Fecha_entrada` date NOT NULL COMMENT 'Fecha en la que se hizo la entrada de productos'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Registro de entradas de inventario';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `ID_Pedido` int(11) NOT NULL COMMENT 'Identificador único del pedido',
  `ID_Usuario` int(11) NOT NULL COMMENT 'Identificador del usuario que realiza el pedido',
  `Fecha` datetime NOT NULL COMMENT 'Fecha y hora en que se realizó el pedido',
  `Subtotal` decimal(10,2) NOT NULL COMMENT 'Suma total de los productos sin incluir envío',
  `Total` decimal(10,2) NOT NULL COMMENT 'Total a pagar (Subtotal + Envío)',
  `Estado` varchar(50) DEFAULT 'Pendiente' COMMENT 'Estado actual del pedido: Pendiente, Enviado, Entregado, Cancelado',
  `Fecha_Limite` datetime DEFAULT NULL,
  `Pagado` tinyint(1) DEFAULT 0 COMMENT '0=No pagado, 1=Pagado'
) ;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`ID_Pedido`, `ID_Usuario`, `Fecha`, `Subtotal`, `Total`, `Estado`, `Fecha_Limite`, `Pagado`) VALUES
(1, 13, '2026-04-30 06:38:16', 55000.00, 55000.00, 'Pendiente', '2026-05-02 06:38:16', 0),
(2, 13, '2026-04-30 07:08:47', 18000.00, 18000.00, 'Cancelado', '2026-05-02 07:08:47', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pqrs`
--

CREATE TABLE `pqrs` (
  `ID_PQRS` int(11) NOT NULL COMMENT 'Identificador único de la PQRS',
  `Codigo_Referencia` varchar(50) NOT NULL COMMENT 'Código único de referencia para consulta',
  `ID_Usuario` int(11) DEFAULT NULL COMMENT 'Identificador del usuario que crea la PQRS (opcional)',
  `Nombre` varchar(100) NOT NULL COMMENT 'Nombre del solicitante',
  `Email` varchar(100) NOT NULL COMMENT 'Correo electrónico del solicitante',
  `Telefono` varchar(20) DEFAULT NULL COMMENT 'Número de teléfono de contacto',
  `Tipo` enum('pregunta','queja','reclamo','sugerencia','felicitacion') NOT NULL COMMENT 'Tipo de PQRS',
  `Descripcion` text NOT NULL COMMENT 'Descripción detallada de la PQRS',
  `Estado` enum('pendiente','en proceso','resuelta','cerrada') DEFAULT 'pendiente' COMMENT 'Estado actual de la PQRS',
  `Fecha_Creacion` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha de creación de la PQRS',
  `Fecha_Actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Fecha de la última actualización',
  `Respuesta` text DEFAULT NULL COMMENT 'Respuesta del administrador a la PQRS'
) ;

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
  `imagen` varchar(255) DEFAULT NULL COMMENT 'Nombre del archivo de imagen del producto',
  `Estado` tinyint(1) DEFAULT 1 COMMENT 'Estado del producto: 1=Activo, 0=Inhabilitado',
  `ID_Proveedor` int(11) DEFAULT NULL COMMENT 'Identificador del proveedor que suministra el producto',
  `calificacion_promedio` decimal(3,2) DEFAULT 0.00 COMMENT 'Promedio de calificaciones de reseñas',
  `total_resenas` int(11) DEFAULT 0 COMMENT 'Cantidad total de reseñas aprobadas'
) ;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`ID_Producto`, `Nombre_producto`, `Descripcion`, `Categoria`, `Precio`, `Stock`, `imagen`, `Estado`, `ID_Proveedor`, `calificacion_promedio`, `total_resenas`) VALUES
(1, 'Café Tostado', 'Café con tostón medio', 'Tostado', 12000.00, 50, 'cafe1.jpeg', 1, NULL, 0.00, 0),
(2, 'Café Fino', 'Café fino en máquina', 'Fino', 18000.00, 47, 'cafe1.jpeg', 1, NULL, 0.00, 0),
(3, 'Café Molido', 'Molido por una máquina', 'Molido', 25000.00, 50, 'cafe1.jpeg', 1, NULL, 0.00, 0),
(4, 'Café Bourbón', 'Café muy suave con un sabor picante', 'Molido', 19000.00, 49, 'cafe1.jpeg', 1, NULL, 0.00, 0);

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
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id` int(11) NOT NULL COMMENT 'Identificador único de la reseña',
  `producto_id` int(11) NOT NULL COMMENT 'Identificador del producto calificado',
  `usuario_id` int(11) NOT NULL COMMENT 'Identificador del usuario que realiza la reseña',
  `nombre_usuario` varchar(100) NOT NULL COMMENT 'Nombre del usuario que escribe la reseña',
  `calificacion` int(11) NOT NULL COMMENT 'Calificación otorgada al producto (1 a 5 estrellas)',
  `comentario` text NOT NULL COMMENT 'Comentario o experiencia del usuario',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha en que se realizó la reseña',
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente' COMMENT 'Estado de aprobación de la reseña'
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `ID_Rol` int(11) NOT NULL COMMENT 'Identificador único del rol',
  `Descripcion` varchar(100) NOT NULL COMMENT 'Descripción del rol y sus funciones',
  `Tipo_rol` varchar(50) NOT NULL COMMENT 'Tipo o categoría del rol (Admin, Usuario, Proveedor)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Almacena los roles de usuario del sistema';

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
  `Clave` varchar(255) NOT NULL COMMENT 'Contraseña de acceso del usuario (encriptada con bcrypt)',
  `ID_Rol` int(11) NOT NULL COMMENT 'Llave foránea que indica el rol o tipo de usuario dentro del sistema',
  `Estado` tinyint(1) DEFAULT 1 COMMENT 'Estado del usuario: 1=Activo, 0=Inhabilitado'
) ;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre_usuario`, `Apellido`, `Correo`, `Documento`, `Telefono`, `Clave`, `ID_Rol`, `Estado`) VALUES
(12, 'Laura', 'Marroquin', 'lauramarro2018@gmail.com', '1028863203', '3267854910', '$2b$10$Y9t/s6iaB9hNWHPjzKnFGeZMjLFJG6oUdI75sL3hJdNseQH749arq', 1, 1),
(13, 'Santiago', 'Rodriguez', 'santidavila233@gmail.com', '1047859632', '3698547852', '$2b$10$0LhcHrUUv4FoWOiYwuQyCeyDb7pvdBF/.7eDzNgpIBlxlUou20WPq', 2, 1);

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
  MODIFY `ID_Carrito` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del item en el carrito';

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `ID_Detalle` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del detalle del pedido';

--
-- AUTO_INCREMENT de la tabla `entrada`
--
ALTER TABLE `entrada`
  MODIFY `ID_Entrada` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la entrada de inventario';

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ID_Pedido` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del pedido';

--
-- AUTO_INCREMENT de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  MODIFY `ID_PQRS` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la PQRS';

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del producto';

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `ID_Proveedor` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del proveedor';

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la reseña';

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_Rol` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del rol', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario dentro del sistema';

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `fk_carrito_producto` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_carrito_usuario` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `entrada`
--
ALTER TABLE `entrada`
  ADD CONSTRAINT `fk_entrada_proveedor` FOREIGN KEY (`ID_Proveedor`) REFERENCES `proveedor` (`ID_Proveedor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `pqrs`
--
ALTER TABLE `pqrs`
  ADD CONSTRAINT `fk_pqrs_usuario` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`ID_Proveedor`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `fk_resenas_producto` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`ID_Producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_resenas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`ID_Rol`) REFERENCES `rol` (`ID_Rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
