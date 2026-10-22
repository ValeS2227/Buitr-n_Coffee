# Resumen Ejecutivo
Buitron Coffee es una empresa de café ubicada en Pitalito, Huila, propiedad del señor Juan Carlos. El sistema consta de una aplicación web y una aplicación móvil que resuelven dos problemas: (1) el dueño no tenía un buen control de su inventario y (2) la marca no era muy reconocida. Para el primero, el sistema ofrece un panel de administrador con resumen de inventario; para el segundo, un catálogo público con cuentas de usuario, reseñas, carrito de compras y canal de PQRS que acercan la marca a sus clientes.


*** Paradigma:      SPA (Single Page Application) + app móvil
Arquitectura:   Cliente - API REST (Node.js) - Base de datos (Supabase/PostgreSQL)
Tipo:           Aplicación web cloud con backend propio
Escalabilidad:  Vertical según el plan de Render/Supabase [VERIFICAR]***

# Características principales
• Catálogo de productos visible para los usuarios.
• Registro de usuarios con verificación de correo electrónico.
• Carrito de compras e historial de pedidos.
• Reseñas de productos y sistema de PQRS (peticiones, quejas, reclamos y sugerencias).
• Panel de administración: gestión de usuarios y productos, moderación de reseñas, respuesta a PQRS y resumen de inventario.
• Notificaciones para el administrador.
• Promociones.

# Principios de diseño


**Separation of Concerns**
Frontend (React), lógica (API Node) y datos (Supabase) están en capas separadas y se despliegan por separado.

** Seguridad por roles**
Cada petición a la API valida el rol (usuario o administrador) antes de ejecutar la acción.
** Soft delete**
Usuarios y productos se deshabilitan, no se borran, para conservar el historial de pedidos.

# 2. Stack Tecnológico
| capa          | Tecnologia         | version              |para que se usa
Frontend web    |  React + vite | React 19.2 · Vite 7.3 |Interfaz y empaquetado   
App móvil       |     Flutter       | Versión móvil para clientes y admin 
Backend  |  Node.js + Express|      API REST, reglas de negocio, envío de correos 
Base de datos   |Supabase (PostgreSQL)| Almacenamiento de datos 
Hosting frontend|Vercel               |Publicar la web   
Hosting backend | Render              | Ejecutar la API de Node.js  
Control de versiones| Git + GitHub   |Historial del código  

**Por qué Supabase?**

1. Ofrece PostgreSQL administrado, con relaciones, índices y triggers reales.
2. Tiene panel visual y SQL Editor, útil para que el equipo revise los datos.
3. Plan gratuito suficiente para un negocio pequeño [VERIFICAR plan actual].
**¿Por qué un backend propio en Node?**
1. Permite ocultar claves secretas (service_role, correo) que nunca deben estar en el navegador.
2. Centraliza las reglas de negocio para que web y móvil las compartan.
3. Un mismo lenguaje (JavaScript) en frontend y backend facilita el mantenimiento.

# Comparación: Vercel vs Render

**Ideal para**
Vercel: Frontends estáticos / SPA
Render: Servidores Node que están siempre activos

**Uso en el proyecto**
Vercel: Web de Buitron Coffee
Render: API REST

**Costo**
Vercel: [VERIFICAR plan]
Render: [VERIFICAR plan]
 
 Si usas el plan gratuito de Render, el servicio se "duerme" tras un tiempo sin uso y la primera petición tarda. Si te pasa, documéntalo en Rendimiento.

 # 3. Arquitectura de la Aplicación
Diagrama general

 # Estructura de carpetas
 ProyectoREACT/
├── Backend_duplicado/
│   ├── api/
│   ├── config/
│   ├── docs/
│   │   └── DOCUMENTACION_CLIENTE/
│   │       ├── Documentos/
│   │       │   ├── 01.1_RESUMEN_EJECUTIVO.md
│   │       │   └── Propuesta.md
│   │       └── Tecnicas/
│   │           ├── ANALISIS_DE_PROBLEMA.md
│   │           ├── Arquitectura_General_Buitron_Coffee.md
│   │           ├── ARQUITECTURA_TECNICA.md
│   │           ├── Diagramas_sistemas.md
│   │           └── REQUERIMIENTOS_FUNCIONALES.md
│   ├── imagenes/
│   ├── node_modules/
│   ├── routes/
│   ├── utils/
│   ├── .ENV
│   ├── .env
│   ├── package-lock.json
│   └── package.json
└── FrontEnd/
    ├── node_modules/
    ├── public/
    └── src/
        └── Admin-paginas/
            ├── estilos-admin/
            │   ├── ActualizarProducto.css
            │   ├── CambiarRolUsuario.css
            │   ├── CrearProducto.css
            │   ├── GestionPedidos.css
            │   ├── GestionResenas.css
            │   ├── IndexAdmin.css
            │   ├── InhabilitarProducto.css
            │   ├── InhabilitarUsuarios.css
            │   ├── VerPqrs.css
            │   ├── VerProductos.css
            │   └── VerUsuarios.css
            ├── ActualizarProducto.jsx
            ├── CambiarRolUsuario.jsx
            ├── CrearProducto.jsx
            ├── GestionPedidos.jsx
            ├── GestionResenas.jsx
            ├── IndexAdmin.jsx
            ├── InhabilitarProducto.jsx
            ├── InhabilitarUsuarios.jsx
            ├── VerPqrs.jsx
            ├── VerProductos.jsx
            └── VerUsuarios.jsx
│
├── components/
├── context/
├── estilos/
│   ├── carrito.css
│   ├── catalogo.css
│   ├── confirmacion.css
│   ├── consulta.css
│   ├── detalle.css
│   ├── footer.css
│   ├── header.css
│   ├── historial.css
│   └── login.css




**Flujo de datos: realizar un pedido**
1. El usuario agrega productos al carrito desde el catálogo.
2. Pulsa "Confirmar pedido" en el frontend.
3. El frontend envía la petición a la API con su token de sesión.
4. El backend verifica el token y que el usuario esté activo.
5. El backend lee el carrito y crea el registro en pedidos.
6. Crea una fila en detalle_pedido por cada producto, guardando el precio de ese momento.
7. Vacía el carrito y genera una notificación para el administrador (notificaciones_admin).
8. El frontend muestra la confirmación y el pedido aparece en el historial.           

# Rutas de la aplicación
Inicio / información de la empresa
Acceso: Pública

Catálogo de productos
Acceso: publico

Registro / Inicio de sesión / Verificar correo
Acceso: Pública

Carrito, Perfil, Historial de pedidos, Reseñas, PQRS
Acceso: Protegida (usuario)

Panel admin: usuarios, productos, reseñas, PQRS, inventario
Acceso: Protegida (administrador)

# 4. Base de Datos

 # 5. APIs y Endpoints
# 6. Seguridad

**Roles y permisos**

**Catálogo de productos**
Usuario: Leer
Administrador: Leer, crear, editar, deshabilitar

**Usuarios**
Usuario: Editar sus propios datos
Administrador: Ver y deshabilitar

**Carrito**
Usuario: Leer, crear, editar, borrar (el suyo)
Administrador: —

**Pedidos**
Usuario: Crear y ver los suyos
Administrador: Ver todos 

**Reseñas**
Usuario: Crear y ver
Administrador: Ver y dar acceso

**PQRS**
Usuario: Crear y ver las suyas
Administrador: Ver todas y responder

**Inventario**
Usuario: —
Administrador: Ver resumen

**Capas de protección**
1. Autenticación: inicio de sesión con token  JWT propio o Supabase Auth y verificación de correo con código de expiración.
2. Autorización: un middleware en Node revisa el rol del token antes de cada ruta /admin/*. Ocultar un botón en React no basta: la API debe rechazar la petición.
3. Contraseñas: guardadas con hash (bcrypt u otro)  nunca en texto plano.
4. Variables de entorno: las claves viven en Render y Vercel, no en el código.
5. RLS (Row Level Security):  si está activado. Si el backend usa la service_role key, esa clave salta el RLS, así que la seguridad depende del middleware. Activar RLS igualmente protege la base si la anon key llegara a usarse directamente.

// Middleware de rol (ejemplo)
export const soloAdmin = (req, res, next) => {
  if (req.user?.rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

Variables de entorno (valores de ejemplo)
# Backend (Render)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...ejemplo   # SECRETA: solo backend
JWT_SECRET=cambia_esto
EMAIL_USER=correo@ejemplo.com
EMAIL_PASS=ejemplo

# Frontend (Vercel)
VITE_API_URL=https://tu-api.onrender.com

# 7. Rendimiento y Optimización
 # 8. Integraciones Externas
 # 9. Configuración y Despliegue
 # 10. Monitoreo y Logs
 # 11. Anexos