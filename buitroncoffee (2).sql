-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-03-2026 a las 13:03:42
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
-- Estructura de tabla para la tabla `detalle_devolucion`
--

CREATE TABLE `detalle_devolucion` (
  `ID_Detalle_Devolucion` int(11) NOT NULL COMMENT 'Identificador único del detalle de la devolución',
  `ID_Devolucion` int(11) NOT NULL COMMENT 'Identificador único de la devolución',
  `ID_Detalle_Pedido` int(11) NOT NULL COMMENT 'Detalle del pedido que fue devuelto',
  `Reembolso` decimal(10,2) NOT NULL COMMENT 'Monto a reembolsar al usuario',
  `Estado` varchar(50) NOT NULL COMMENT 'Describe cómo se encuentra la devolución (Activo o Pendiente)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_devolucion`
--

INSERT INTO `detalle_devolucion` (`ID_Detalle_Devolucion`, `ID_Devolucion`, `ID_Detalle_Pedido`, `Reembolso`, `Estado`) VALUES
(7, 4, 4, 24000.00, 'Pendiente'),
(8, 5, 5, 36000.00, 'Pendiente'),
(9, 6, 6, 50000.00, 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_entrada`
--

CREATE TABLE `detalle_entrada` (
  `ID_Detalle_Entrada` int(11) NOT NULL COMMENT 'Identificador único del detalle de la entrada',
  `ID_Entrada` int(11) NOT NULL COMMENT 'Identificador único de la entrada de inventario',
  `ID_Producto` int(11) NOT NULL COMMENT 'Identificador único del producto',
  `Cantidad` int(11) NOT NULL COMMENT 'Cantidad de productos a ingresar',
  `Estado` varchar(50) NOT NULL COMMENT 'Describe cómo se encuentra la entrada (Activo o Pendiente)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_entrada`
--

INSERT INTO `detalle_entrada` (`ID_Detalle_Entrada`, `ID_Entrada`, `ID_Producto`, `Cantidad`, `Estado`) VALUES
(1, 1, 3, 100, 'Pendiente'),
(2, 2, 2, 50, 'Pendiente'),
(3, 3, 3, 15, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `ID_Detalle_Pedido` int(11) NOT NULL COMMENT 'Describe los productos incluidos en la compra',
  `ID_Pedido` int(11) NOT NULL COMMENT 'Identificador único del pedido realizado por el usuario',
  `ID_Producto` int(11) NOT NULL COMMENT 'Identificador único del producto',
  `Cantidad` int(11) NOT NULL COMMENT 'Cantidad de productos que se llevó en el pedido',
  `Resena` varchar(255) DEFAULT NULL COMMENT 'Comentario y calificación del producto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`ID_Detalle_Pedido`, `ID_Pedido`, `ID_Producto`, `Cantidad`, `Resena`) VALUES
(4, 1, 1, 20, 'Este cafe es excelente por su calidad'),
(5, 2, 2, 2, 'Voy a probar este cafe a ver a que sabe'),
(6, 3, 3, 2, 'Espero que sepa muy rico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devolucion`
--

CREATE TABLE `devolucion` (
  `ID_Devolucion` int(11) NOT NULL COMMENT 'Identificador único para la devolución de un pedido',
  `ID_Pedido` int(11) NOT NULL COMMENT 'Identificador único del pedido realizado por el usuario',
  `Fecha_devolucion` date NOT NULL COMMENT 'Fecha en la que se realizo la devolucion'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `devolucion`
--

INSERT INTO `devolucion` (`ID_Devolucion`, `ID_Pedido`, `Fecha_devolucion`) VALUES
(4, 1, '2026-08-10'),
(5, 2, '2026-08-11'),
(6, 3, '2026-08-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrada`
--

CREATE TABLE `entrada` (
  `ID_Entrada` int(11) NOT NULL COMMENT 'Identificador único de la entrada de inventario',
  `ID_Proveedor` int(11) NOT NULL COMMENT 'Proveedor que realiza la entrada',
  `Fecha_entrada` date NOT NULL COMMENT 'Fecha en la que se hizo la entrada de productos'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entrada`
--

INSERT INTO `entrada` (`ID_Entrada`, `ID_Proveedor`, `Fecha_entrada`) VALUES
(1, 1, '2026-02-06'),
(2, 2, '2026-02-07'),
(3, 3, '2026-02-08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `ID_Pedido` int(11) NOT NULL COMMENT 'Identificador único del pedido realizado por el usuario',
  `ID_Usuario` int(11) NOT NULL COMMENT 'Identificador único del usuario dentro del sistema',
  `Fecha_pedido` date NOT NULL COMMENT 'Fecha en la que se realizo el pedido'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`ID_Pedido`, `ID_Usuario`, `Fecha_pedido`) VALUES
(1, 5, '2026-08-10'),
(2, 5, '2026-08-11'),
(3, 4, '2026-08-10');

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
(1, 'Cafe tostado', 'Cafe con toston medio', 'Tostado', 12000.00, 30, 'cafe1.jpg'),
(2, 'Cafe fino', 'Cafe fino en maquina', 'Fino', 18000.00, 10, 'cafe2.jpg'),
(3, 'Cafe molido', 'molido por una maquina', 'Molido', 25000.00, 10, 'cafe3.jpg');

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
(1, 'Laura', 'Marroquin', 'Correo', '	Documento', 'Telefono', 'Clave', 1),
(2, 'Fabian', 'Parra', 'foparra@gmail.com', '12234567', '3233726512', 'foparrita', 2),
(3, 'Juan', 'Buitron', 'Juan1970@gmail.com', '4587698514', '314789524', 'micuentaesJuan', 3),
(4, 'Jorge', 'Gonzales', 'jagojites1082@gmail.com', '103766205', '1786947855', 'gorgiño', 3),
(5, 'Michael', 'Merlano', 'maicolgeovany@gmail.com', '125478965', '314782475', 'ayjesucrito', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  ADD PRIMARY KEY (`ID_Detalle_Devolucion`),
  ADD KEY `fk_detalle_devolucion` (`ID_Devolucion`),
  ADD KEY `fk_detalle_pedido_devolucion` (`ID_Detalle_Pedido`);

--
-- Indices de la tabla `detalle_entrada`
--
ALTER TABLE `detalle_entrada`
  ADD PRIMARY KEY (`ID_Detalle_Entrada`),
  ADD KEY `fk_detalle_entrada` (`ID_Entrada`),
  ADD KEY `fk_detalle_entrada_producto` (`ID_Producto`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`ID_Detalle_Pedido`),
  ADD KEY `fk_detalle_pedido` (`ID_Pedido`),
  ADD KEY `fk_detalle_producto` (`ID_Producto`);

--
-- Indices de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`ID_Devolucion`),
  ADD KEY `fk_devolucion_pedido` (`ID_Pedido`);

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
  ADD KEY `fk_pedido_usuario` (`ID_Usuario`);

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
-- AUTO_INCREMENT de la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  MODIFY `ID_Detalle_Devolucion` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del detalle de la devolución', AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `detalle_entrada`
--
ALTER TABLE `detalle_entrada`
  MODIFY `ID_Detalle_Entrada` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del detalle de la entrada', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `ID_Detalle_Pedido` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Describe los productos incluidos en la compra', AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `ID_Devolucion` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único para la devolución de un pedido', AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `entrada`
--
ALTER TABLE `entrada`
  MODIFY `ID_Entrada` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la entrada de inventario', AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ID_Pedido` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del pedido realizado por el usuario', AUTO_INCREMENT=4;

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
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario dentro del sistema', AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  ADD CONSTRAINT `fk_detalle_devolucion` FOREIGN KEY (`ID_Devolucion`) REFERENCES `devolucion` (`ID_Devolucion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_pedido_devolucion` FOREIGN KEY (`ID_Detalle_Pedido`) REFERENCES `detalle_pedido` (`ID_Detalle_Pedido`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_entrada`
--
ALTER TABLE `detalle_entrada`
  ADD CONSTRAINT `fk_detalle_entrada` FOREIGN KEY (`ID_Entrada`) REFERENCES `entrada` (`ID_Entrada`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_entrada_producto` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD CONSTRAINT `fk_devolucion_pedido` FOREIGN KEY (`ID_Pedido`) REFERENCES `pedido` (`ID_Pedido`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `entrada`
--
ALTER TABLE `entrada`
  ADD CONSTRAINT `fk_entrada_proveedor` FOREIGN KEY (`ID_Proveedor`) REFERENCES `proveedor` (`ID_Proveedor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`ID_Rol`) REFERENCES `rol` (`ID_Rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
