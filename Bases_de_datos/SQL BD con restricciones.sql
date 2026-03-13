CREATE DATABASE BuitronCoffee;
USE BuitronCoffee;

CREATE TABLE Rol (
    ID_Rol INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del rol asignado',
    Descripcion VARCHAR(100) NOT NULL COMMENT 'Descripción del rol y sus funciones',
    Tipo_rol VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tipo o categoría del rol'
);

CREATE TABLE Usuario (
    ID_Usuario INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario dentro del sistema',
    Nombre_usuario VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre del usuario registrado',
    Apellido VARCHAR(50) NOT NULL COMMENT 'Apellido del usuario registrado',
    Correo VARCHAR(100) NOT NULL UNIQUE COMMENT 'Dirección de correo usada para autenticación y notificaciones',
    Documento VARCHAR(10) NOT NULL UNIQUE COMMENT 'Número de documento de identidad del usuario',
    Telefono VARCHAR(20) NOT NULL UNIQUE COMMENT 'Número de teléfono de contacto',
    Clave VARCHAR(255) NOT NULL COMMENT 'Contraseña de acceso del usuario (encriptada)',
    ID_Rol INT NOT NULL COMMENT 'Llave foránea que indica el rol o tipo de usuario dentro del sistema',
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (ID_Rol)
        REFERENCES Rol(ID_Rol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Producto (
    ID_Producto INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del producto',
    Nombre_producto VARCHAR(100) NOT NULL COMMENT 'Nombre comercial del producto',
    Descripcion VARCHAR(255) COMMENT 'Detalle o información general del producto',
    Categoria VARCHAR(100) NOT NULL COMMENT 'Nivel de tostado o clasificación técnica del producto',
    Precio DECIMAL(10,2) NOT NULL COMMENT 'Precio unitario del producto'
);

CREATE TABLE Pedido (
    ID_Pedido INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del pedido realizado por el usuario',
    ID_Usuario INT NOT NULL COMMENT 'Identificador único del usuario dentro del sistema',
    Fecha DATE NOT NULL COMMENT 'Fecha en la que se realizó el pedido',
    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (ID_Usuario)
        REFERENCES Usuario(ID_Usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Detalle_Pedido (
    ID_Detalle_Pedido INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Describe los productos incluidos en la compra',
    ID_Pedido INT NOT NULL COMMENT 'Identificador único del pedido realizado por el usuario',
    ID_Producto INT NOT NULL COMMENT 'Identificador único del producto',
    Cantidad INT NOT NULL COMMENT 'Cantidad de productos que se llevó en el pedido',
    Resena VARCHAR(255) COMMENT 'Comentario y calificación del producto',
    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (ID_Pedido)
        REFERENCES Pedido(ID_Pedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (ID_Producto)
        REFERENCES Producto(ID_Producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Proveedor (
    ID_Proveedor INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del proveedor',
    Nombre_proveedor VARCHAR(100) NOT NULL COMMENT 'Nombre del proveedor',
    Apellido VARCHAR(100) NOT NULL COMMENT 'Apellido del proveedor',
    Telefono VARCHAR(20) NOT NULL COMMENT 'Número telefónico del proveedor',
    Correo VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico del proveedor',
    Direccion VARCHAR(255) NOT NULL COMMENT 'Dirección física del proveedor'
);

CREATE TABLE Entrada (
    ID_Entrada INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la entrada de inventario',
    ID_Proveedor INT NOT NULL COMMENT 'Proveedor que realiza la entrada',
    Fecha DATE NOT NULL COMMENT 'Fecha en la que se hizo la entrada de productos',
    CONSTRAINT fk_entrada_proveedor
        FOREIGN KEY (ID_Proveedor)
        REFERENCES Proveedor(ID_Proveedor)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Detalle_Entrada (
    ID_Detalle_Entrada INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del detalle de la entrada',
    ID_Entrada INT NOT NULL COMMENT 'Identificador único de la entrada de inventario',
    ID_Producto INT NOT NULL COMMENT 'Identificador único del producto',
    Cantidad INT NOT NULL COMMENT 'Cantidad de productos a ingresar',
    Estado VARCHAR(50) NOT NULL COMMENT 'Describe cómo se encuentra la entrada (Activo o Pendiente)',
    CONSTRAINT fk_detalle_entrada
        FOREIGN KEY (ID_Entrada)
        REFERENCES Entrada(ID_Entrada)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_entrada_producto
        FOREIGN KEY (ID_Producto)
        REFERENCES Producto(ID_Producto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Devolucion (
    ID_Devolucion INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único para la devolución de un pedido',
    ID_Pedido INT NOT NULL COMMENT 'Identificador único del pedido realizado por el usuario',
    Fecha DATE NOT NULL COMMENT 'Fecha en la que se realizó la devolución',
    CONSTRAINT fk_devolucion_pedido
        FOREIGN KEY (ID_Pedido)
        REFERENCES Pedido(ID_Pedido)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Detalle_Devolucion (
    ID_Detalle_Devolucion INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del detalle de la devolución',
    ID_Devolucion INT NOT NULL COMMENT 'Identificador único de la devolución',
    ID_Detalle_Pedido INT NOT NULL COMMENT 'Detalle del pedido que fue devuelto',
    Reembolso DECIMAL(10,2) NOT NULL COMMENT 'Monto a reembolsar al usuario',
    Estado VARCHAR(50) NOT NULL COMMENT 'Describe cómo se encuentra la devolución (Activo o Pendiente)',
    CONSTRAINT fk_detalle_devolucion
        FOREIGN KEY (ID_Devolucion)
        REFERENCES Devolucion(ID_Devolucion)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_pedido_devolucion
        FOREIGN KEY (ID_Detalle_Pedido)
        REFERENCES Detalle_Pedido(ID_Detalle_Pedido)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
