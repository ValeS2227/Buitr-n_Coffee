

## 1. Resumen ejecutivo

Buitrón Coffee es un negocio de café ubicado en Pitalito, Huila. El
sistema de información está compuesto por una aplicación web y una
aplicación móvil. Su propósito es apoyar la administración de productos
e inventario y ofrecer canales digitales para que los clientes consulten
el catálogo, gestionen sus compras y se comuniquen con el negocio.

La solución contempla catálogo de productos, registro e inicio de
sesión, verificación de correo electrónico, carrito, pedidos e
historial, reseñas, PQRS, promociones y herramientas administrativas.
También incluye funciones de consulta de inventario y alertas de stock
bajo.

**Arquitectura declarada:** aplicaciones cliente → API REST en
Node.js/Express → Supabase/PostgreSQL.\
**Aplicación web:** React con Vite.\
**Aplicación móvil:** Flutter.\
**Backend:** Node.js y Express.\
**Datos y autenticación:** Supabase/PostgreSQL y Supabase Auth, además
de tokens JWT propios en los módulos revisados.\
**Despliegue:** el documento de proyecto menciona Vercel para el
frontend y Render para el backend; debe confirmarse con los despliegues
activos.

La documentación se basa en los archivos de rutas compartidos. No
sustituye una auditoría completa del repositorio, del esquema de base de
datos ni de la configuración de producción.

## 2. Stack tecnológico

  -----------------------------------------------------------------------
  Capa                    Tecnología identificada Uso
  ----------------------- ----------------------- -----------------------
  Frontend web            React + Vite            Interfaz web y panel
                                                  administrativo.

  Aplicación móvil        Flutter                 Aplicación móvil del
                                                  proyecto.

  Backend                 Node.js + Express       API REST, reglas de
                                                  negocio e
                                                  integraciones.

  Base de datos           Supabase / PostgreSQL   Persistencia de
                                                  usuarios, productos,
                                                  carrito, pedidos y
                                                  demás módulos.

  Autenticación           Supabase Auth y JWT     Registro/inicio de
                          propio                  sesión y autorización
                                                  de solicitudes, según
                                                  el módulo.

  Correo electrónico      Servicio auxiliar       Códigos de verificación
                          `emailService`          y alertas de stock.

  WhatsApp                Servicio auxiliar       Envío de
                          `whatsappService`       factura/resumen de
                                                  pedido.

  Control de versiones    Git y GitHub            Historial y
                                                  colaboración sobre el
                                                  código.

  Hosting web             Vercel,         Publicación del
                                          frontend; confirmar URL
                                          y configuración
                                                  vigentes.

  Hosting backend         Render,        Ejecución de la API;
                                    confirmar servicio y
                                    variables configuradas.
  -----------------------------------------------------------------------

### 2.1. ¿Por qué Supabase?

Supabase proporciona una base de datos PostgreSQL administrada y
herramientas para consultar y administrar datos. En el código compartido
se utiliza el cliente de Supabase para acceder a tablas, consultar
relaciones y ejecutar funciones RPC.

### 2.2. ¿Por qué un backend propio?

El backend centraliza las reglas de negocio, valida tokens, aplica
permisos en determinadas rutas y permite que los clientes web y móvil
consuman servicios comunes. Las claves privadas y credenciales de
servicios externos deben permanecer en el servidor y nunca incluirse en
el frontend.

### 2.3. Vercel y Render

 Vercel se destina al
frontend y Render al backend. Los costos, límites, suspensión por
inactividad y tiempos de respuesta dependen del plan vigente y de la
configuración real. No se deben documentar valores de costo ni
disponibilidad sin verificarlos en las cuentas del proyecto.

## 3. Arquitectura de la aplicación

### 3.1. Capas

1.  **Presentación:** React/Vite para la web y Flutter para la
    aplicación móvil.
2.  **Servicios de aplicación:** API REST en Node.js/Express. Las rutas
    gestionan solicitudes, validaciones, autenticación, autorización y
    reglas de negocio.
3.  **Persistencia:** Supabase/PostgreSQL para los módulos que utilizan
    `supabaseClient`.
4.  **Integraciones externas:** servicio de correo electrónico y
    servicio de WhatsApp.
5.  **Acceso SQL adicional:** 

### 3.2. Flujo general de una compra

1.  El usuario consulta el catálogo y agrega productos al carrito.
2.  El frontend envía las solicitudes a la API con el token de
    autenticación cuando la ruta lo requiere.
3.  El backend identifica al usuario mediante el token y consulta su
    carrito.
4.  El backend calcula subtotal, envío y total, y crea el pedido junto
    con sus detalles.
5.  El carrito se vacía después del registro del pedido.
6.  El usuario puede consultar el historial y el detalle del pedido.
7.  Si utiliza el módulo de pago simulado, el backend valida los datos
    de prueba y actualiza el pedido como pagado cuando la simulación es
    aprobada.



### 3.3. Estructura de carpetas

La estructura observada en el material del proyecto es, de forma
resumida:

``` text
ProyectoREACT/
├── Backend_duplicado/
│   ├── api/
│   ├── config/
│   ├── docs/
│   ├── imagenes/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── package-lock.json
└── FrontEnd/
    ├── public/
    └── src/
        ├── Admin-paginas/
        ├── components/
        ├── context/
        └── estilos/
```

### 3.4. Rutas funcionales de la aplicación

  -----------------------------------------------------------------------
  Área                    Funcionalidad           Acceso esperado
  ----------------------- ----------------------- -----------------------
  Inicio e información    Presentación del        Público
                          negocio                 

  Catálogo                Consulta de productos   Público
                          activos                 

  Registro y verificación Alta y verificación de  Público, con
                          correo                  validaciones de
                                                  servidor

  Inicio de sesión        Autenticación           Público

  Carrito                 Consultar y modificar   Usuario autenticado
                          los productos propios   

  Pedidos e historial     Crear pedidos y         Usuario autenticado
                          consultar los propios   

  Reseñas                 Consultar reseñas       Consulta pública;
                          aprobadas y registrar   creación autenticada
                          una reseña              

  PQRS                    Crear solicitudes y     Algunas consultas
                          consultar su estado     públicas; gestión de
                                                  usuario/admin 
                                                  

  Promociones             Consultar y aplicar     Consulta pública;
                          códigos                 aplicación autenticada

  Administración          Gestión de productos,   Administrador, una vez
                          reseñas, PQRS, pedidos  verificados los
                          e inventario            permisos en backend

            
  -----------------------------------------------------------------------


## 4. Base de datos

### 4.1. Tablas identificadas en los códigos

  -----------------------------------------------------------------------
  Tabla                               Propósito observado
  ----------------------------------- -----------------------------------
  `usuario`                           Datos de cuenta, correo, nombre,
                                      rol y estado; algunas rutas
                                      consultan también `auth_user_id`.

  `producto`                          Catálogo, descripción, categoría,
                                      precio, stock, imagen, estado,
                                      proveedor y métricas de reseñas.

  `carrito`                           Productos seleccionados por
                                      usuario, cantidad y relaciones con
                                      producto/usuario.

  `pedido`                            Encabezado de compra: usuario,
                                      fecha, subtotal, envío, total,
                                      estado, dirección, método de pago y
                                      datos de pago.

  `detalle_pedido`                    Productos incluidos en cada pedido,
                                      cantidades y precio unitario al
                                      comprar.

  `reseñas`                           Reseñas de usuarios, calificación,
                                      comentario, fecha y estado de
                                      moderación.

  `pqrs`                              Solicitudes de peticiones, quejas,
                                      reclamos y sugerencias, referencia,
                                      estado y respuesta.

  `promociones`                       Promociones, tipo, valor, código,
                                      fechas, producto asociado y
                                      límite/usos.

  `verificaciones_email`              Código de verificación, correo,
                                      expiración, estado e intentos.
  -----------------------------------------------------------------------

También aparecen funciones RPC llamadas `top_productos_vendidos`,
`incrementar_stock` e `incrementar_uso_promocion`.

**Limitación:** esta tabla es un inventario derivado de las consultas
compartidas, no un diccionario de datos completo. 

### 4.2. Relaciones observadas

-   `carrito` se relaciona con `usuario` y `producto`.
-   `pedido` se relaciona con `usuario`.
-   `detalle_pedido` se relaciona con `pedido` y `producto`.
-   `reseñas` se relaciona con `usuario` y `producto`.
-   `promociones` puede relacionarse con `producto`.
-   `pqrs` puede asociarse a un usuario, aunque el endpoint público
    permite enviar `id_usuario` desde el cuerpo de la solicitud.
-   `verificaciones_email` se identifica por el correo en las
    operaciones de envío y verificación.



### 4.3. Recomendaciones de integridad

-   Definir claves foráneas y reglas de eliminación coherentes con el
    historial de pedidos.
-   Validar cantidades y precios, y conservar el precio unitario
    aplicado en cada detalle de pedido.
-   Aplicar restricciones para los estados permitidos y los valores
    numéricos.
-   Comprobar unicidad de códigos promocionales y referencias de PQRS
    cuando corresponda.
-   Usar transacciones o funciones de base de datos para operaciones de
    varios pasos que deban completarse juntas.
-   Revisar las políticas RLS y los permisos de las claves usadas por
    cada conexión.

## 5. APIs y endpoints



  ----------------------------------------------------------------------------------------------------
  Módulo          Método         Ruta relativa                      Función            Acceso indicado
                                                                                       por el código
                                                                                       compartido
  --------------- -------------- ---------------------------------- ------------------ ---------------
  Autenticación   `POST`         `/register`                        Registrar usuario  Público; valida
                                                                                       campos y crea
                                                                                       cuenta/perfil

  Autenticación   `POST`         `/login`                           Iniciar sesión     Público

  Carrito         `GET`          `/`                                Consultar carrito  JWT
                                                                    propio y total     

  Carrito         `POST`         `/agregar`                         Agregar producto o JWT
                                                                    aumentar cantidad  

  Carrito         `PUT`          `/actualizar/:itemId`              Cambiar cantidad   JWT

  Carrito         `DELETE`       `/eliminar/:itemId`                Quitar artículo    JWT

  Carrito         `DELETE`       `/vaciar`                          Vaciar carrito     JWT
                                                                    propio             

  Productos       `GET`          `/`                                Consultar todos    Sin middleware
                                                                    los productos,     en el archivo
                                                                    incluidos          compartido
                                                                    inhabilitados      

  Productos       `GET`          `/activos`                         Consultar          Público
                                                                    productos activos  

  Productos       `GET`          `/:id`                             Consultar producto Público
                                                                    por ID             

  Productos       `POST`         `/`                                Crear producto     **Sin
                                                                                       middleware en
                                                                                       el archivo
                                                                                       compartido**

  Productos       `PUT`          `/:id`                             Actualizar         **Sin
                                                                    producto           middleware en
                                                                                       el archivo
                                                                                       compartido**

  Productos       `PATCH`        `/:id/inhabilitar`                 Inhabilitar        **Sin
                                                                    producto           middleware en
                                                                                       el archivo
                                                                                       compartido**

  Productos       `PATCH`        `/:id/habilitar`                   Habilitar producto **Sin
                                                                                       middleware en
                                                                                       el archivo
                                                                                       compartido**

  Productos       `DELETE`       `/:id`                             Eliminar producto  **Sin
                                                                                       middleware en
                                                                                       el archivo
                                                                                       compartido**

  Productos       `GET`          `/buscar/:texto`                   Buscar por nombre  Público

  Pedidos         `GET`          `/historial`                       Historial del      JWT
                                                                    usuario            

  Pedidos         `GET`          `/detalle/:pedidoId`               Detalle de pedido  JWT
                                                                    propio             

  Pedidos         `POST`         `/` y `/registrar`                 Crear pedido desde JWT
                                                                    el carrito         

  Pedidos         `GET`          `/admin/todos`                     Consultar todos    Administrador
                                                                    los pedidos        

  Pedidos         `GET`          `/admin/detalle/:pedidoId`         Consultar detalle  Administrador
                                                                    administrativo     

  Pedidos         `PATCH`        `/admin/estado/:pedidoId`          Cambiar estado del Administrador
                                                                    pedido             

  Pagos           `POST`         `/simular`                         Simular pago con   JWT
                                                                    tarjeta            

  Estadísticas    `GET`          `/resumen-productos`               Más vendidos y     JWT y rol `2`
                                                                    stock bajo;        
                                                                    dispara correo de  
                                                                    alerta si          
                                                                    corresponde        

  Estadísticas    `GET`          `/top-productos`                   Consultar          JWT; el código
                                                                    productos más      compartido no
                                                                    vendidos           comprueba rol
                                                                                       admin

  Estadísticas    `POST`         `/alerta-stock`                    Generar lista de   JWT y rol `2`
                                                                    alertas de stock   
                                                                    bajo               

  Promociones     `GET`          `/activas`                         Consultar          Público
                                                                    promociones        
                                                                    vigentes con cupo  

  Promociones     `GET`          `/admin/todas`                     Consultar todas    JWT y rol `2`
                                                                    las promociones    

  Promociones     `GET`          `/codigo/:codigo`                  Consultar código   Público
                                                                    vigente            

  Promociones     `POST`         `/admin/crear`                     Crear promoción    JWT y rol `2`

  Promociones     `PUT`          `/admin/actualizar/:id`            Actualizar         JWT y rol `2`
                                                                    promoción          

  Promociones     `DELETE`       `/admin/eliminar/:id`              Eliminar promoción JWT y rol `2`

  Promociones     `POST`         `/aplicar`                         Calcular descuento JWT
                                                                    de una compra      

  Reseñas         `GET`          `/producto/:productoId`            Reseñas aprobadas  Público

  Reseñas         `GET`          `/producto/:productoId/promedio`   Promedio y         Público
                                                                    cantidad de        
                                                                    reseñas            

  Reseñas         `POST`         `/`                                Crear reseña       JWT
                                                                    pendiente          

  Reseñas         `GET`          `/admin`                           Consultar todas    JWT y
                                                                    las reseñas        comprobación de
                                                                                       rol `2`

  Reseñas         `PATCH`        `/admin/:id`                       Cambiar estado y   JWT y
                                                                    recalcular         comprobación de
                                                                    promedio           rol `2`

  PQRS            `POST`         `/`                                Crear solicitud    Público en el
                                                                                       código
                                                                                       compartido

  PQRS            `GET`          `/consultar/:codigo`               Consultar PQRS por Público
                                                                    código             

  PQRS            `GET`          `/mis-pqrs`                        Consultar          JWT
                                                                    solicitudes        
                                                                    propias            

  PQRS            `GET`          `/admin`                           Consultar todas    JWT y rol `2`
                                                                    las PQRS           

  PQRS            `PATCH`        `/admin/:id`                       Actualizar         JWT y rol `2`
                                                                    estado/respuesta   

  Verificación    `POST`         `/enviar-codigo`                   Generar y enviar   Público
                                                                    código             

  Verificación    `POST`         `/verificar-codigo`                Validar código y   Público
                                                                    marcar             
                                                                    verificación       

  Verificación    `POST`         `/reenviar-codigo`                 Generar y enviar   Público
                                                                    otro código        

  WhatsApp        `POST`         `/enviar-factura/:pedidoId`        Enviar             JWT y rol `1`
                                                                    resumen/factura de en el código
                                                                    pedido             compartido
  ----------------------------------------------------------------------------------------------------

### 5.1. Pagos

La ruta `/simular` **no es una pasarela bancaria real**. Simula una
respuesta, rechaza los números cuyo valor limpio termina en `0000` y,
cuando la simulación se aprueba, actualiza el pedido con `pagado: true`,
el método de pago enmascarado y una referencia de simulación. No se debe
presentar como integración de pagos en producción.

### 5.2. Cancelación de pedidos vencidos

Se compartió una función que busca pedidos `Pendiente`, no pagados y con
`fecha_limite` vencida. Los cambia a `Cancelado` y después intenta
devolver el stock mediante la RPC `incrementar_stock`.

En el código mostrado, la función se ejecuta al cargar el módulo. No se
observa un planificador periódico. Para garantizar ejecución automática,
se debe confirmar dónde se importa este módulo y si existe un scheduler
externo o un proceso programado.

### 5.3. Respuestas y códigos HTTP

Los endpoints usan habitualmente: - `200`: consulta o actualización
exitosa. - `201`: creación exitosa, cuando el endpoint lo implementa. -
`400`: datos requeridos ausentes o validación fallida. - `401`: token
ausente o inválido. - `403`: permisos insuficientes. - `404`: recurso no
encontrado o código no disponible. - `500`: error de base de datos o
integración.

Las respuestas no son totalmente uniformes entre módulos; conviene
establecer un formato común de error y éxito.

## 6. Seguridad

### 6.1. Roles y permisos previstos

  -----------------------------------------------------------------------
  Recurso                 Usuario                 Administrador
  ----------------------- ----------------------- -----------------------
  Catálogo                Consultar productos     Consultar y gestionar
                          activos                 productos

  Usuarios                Gestionar su propia     Consultar y administrar
                          cuenta,                    usuarios
                                     

  Carrito                 Gestionar su propio     Sin función
                          carrito                 administrativa
                                                  identificada en estos
                                                  endpoints

  Pedidos                 Crear y consultar los   Consultar pedidos y
                          propios                 actualizar su estado

  Reseñas                 Consultar aprobadas y   Consultar y moderar
                          crear reseñas           reseñas

  PQRS                    Crear y consultar las   Consultar y responder
                          propias                 todas

  Inventario              Sin acceso              Consultar estadísticas
                          administrativo          y alertas

  Promociones             Consultar y aplicar     Crear, actualizar y
                          promociones             eliminar promociones

  
  -----------------------------------------------------------------------



### 6.2. Hallazgos de seguridad en los archivos revisados

1.  **Secreto JWT predeterminado:** varios módulos usan
    `process.env.JWT_SECRET || "secreto123"` y el módulo de WhatsApp
    fija `SECRET = "secreto123"`. En producción debe usarse un secreto
    fuerte en variables de entorno y el mismo mecanismo de configuración
    en todos los módulos.
2.  **Gestión de productos sin protección:** el archivo de productos
    compartido no aplica `verificarToken` ni valida rol en creación,
    actualización, habilitación, inhabilitación o eliminación. Estas
    rutas deben protegerse en el backend antes de publicar.
3.  **Roles inconsistentes:** varios módulos usan `id_rol === 2` para
    administrador, mientras que el módulo de WhatsApp comprueba
    `ID_Rol === 1`. Se debe confirmar el catálogo real de roles y
    unificarlo.
4.  **Consulta de productos inactivos:** `GET /productos/` y
    `GET /productos/buscar/:texto` no filtran por estado. Si se usan en
    la interfaz pública, podrían revelar productos inhabilitados.
5.  **Creación pública de PQRS:** el endpoint permite enviar
    `id_usuario` en el cuerpo sin autenticar. Una persona podría asociar
    una solicitud a un usuario distinto. El backend debería derivar el
    identificador desde el token cuando haya autenticación.
6.  **Promociones calculadas con datos del cliente:**
    `/promociones/aplicar` recibe `subtotal` e `items` desde la
    solicitud. Los precios y cantidades deben recalcularse o comprobarse
    en el servidor para impedir manipulación.
7.  **Datos de tarjeta en logs:** el endpoint de pago simulado imprime
    el cuerpo completo de la solicitud. Debe eliminarse el registro de
    datos sensibles y no se deben almacenar números completos de tarjeta
    ni CVV.
8.  **Errores de depuración:** algunas respuestas incluyen objetos
    `debug` de la base de datos. En producción se deben devolver
    mensajes generales y conservar el detalle solo en logs protegidos.
9.  **Límite de intentos de correo:** existe un límite de cinco intentos
    fallidos por código, pero conviene sumar limitación de solicitudes
    por IP/correo.
10. **RLS:** no se ha comprobado en este material qué políticas RLS
    están activas ni qué clave utiliza cada módulo. Debe verificarse en
    Supabase. Una clave `service_role` omite las políticas RLS y debe
    mantenerse exclusivamente en el servidor.
11. **Soft delete:** los códigos de productos incluyen inhabilitación,
    pero también eliminación física. No se puede afirmar que todos los
    productos se deshabilitan en lugar de borrarse.
12. **Permisos del módulo de estadísticas:** `/top-productos` solo
    verifica token en el código compartido; si es información exclusiva
    del panel, debe comprobar también el rol administrativo.

### 6.3. Variables de entorno


**Backend**

``` env
SUPABASE_URL=https://<proyecto>.supabase.co
SUPABASE_SERVICE_KEY=<secreto-solo-servidor>
JWT_SECRET=<secreto-robusto>
ADMIN_EMAIL=<correo-administrativo>
EMAIL_USER=<cuenta-de-correo>
EMAIL_PASS=<secreto-de-correo>
```

**Frontend**

``` env
VITE_API_URL=https://<dominio-api>
```



## 7. Rendimiento y optimización

### 7.1. Situación observada

-   Las consultas de catálogo y administración ordenan los resultados
    por identificador o fecha.
-   El resumen de inventario consulta productos con stock igual o
    inferior a diez unidades.
-   El promedio de reseñas se calcula en JavaScript consultando las
    calificaciones aprobadas.
-   La consulta de estadísticas usa la función RPC
    `top_productos_vendidos`.
-   El pago simulado incorpora una espera de 1,2 segundos para
    representar el procesamiento.

### 7.2. Mejoras recomendadas

1.  Crear y revisar índices para columnas utilizadas frecuentemente en
    filtros, relaciones y ordenamientos, después de analizar el plan de
    consultas.
2.  Implementar paginación en listados administrativos que puedan
    crecer, como productos, pedidos, reseñas y PQRS.
3.  Calcular agregados en PostgreSQL cuando el volumen de reseñas sea
    alto.
4.  Evitar consultas repetidas y limitar los campos seleccionados a los
    necesarios.
5.  Medir tiempo de respuesta de API, consultas y servicios externos
    antes de decidir cambios.
6.  Si el backend está en un plan que entra en reposo, medir el tiempo
    de arranque en frío y documentar el resultado real.
7.  Asegurar que el proceso de cancelación de pedidos vencidos tenga una
    frecuencia definida y que no se ejecute duplicadamente.
8.  Evitar enviar correos repetidos en cada consulta del panel si el
    mismo stock bajo permanece sin cambios; considerar alertas con
    control de frecuencia.



## 8. Integraciones externas

  ---------------------------------------------------------------------------------------------
  Servicio              Uso identificado         Estado según el código       Pendiente de
                                                 compartido                   comprobar
  --------------------- ------------------------ ---------------------------- -----------------
  Supabase/PostgreSQL   Consultas y persistencia Implementado en múltiples    Proyecto, RLS,
                        de datos                 módulos                      esquema, backups
                                                                              y permisos

  Supabase Auth         Registro/autenticación y Utilizado por el módulo de   Flujo completo y
                        confirmación de correo   autenticación/verificación   configuración de
                                                                              correo

  Servicio de correo    Código de verificación y Referenciado por rutas       Proveedor,
  (`emailService`)      alerta de stock                                       variables y
                                                                              entrega real

  WhatsApp Cloud API    Envío de factura/resumen Servicio llamado desde la    Credenciales,
  (`whatsappService`)                            ruta                         número, plantilla
                                                                              y respuesta de
                                                                              Meta

  Almacenamiento de     Imágenes de productos    La API devuelve el campo     Confirmar si usa
  imágenes                                       `imagen`                     Supabase Storage,
                                                                              carpeta estática
                                                                              u otro servicio
  ---------------------------------------------------------------------------------------------

### 8.1. Roadmap (funcionalidades futuras, no implementadas o no verificadas)

Estas son propuestas, no funcionalidades que deban darse por terminadas:

1.  **Pasarela de pagos real:** integrar un proveedor de pagos, validar
    webhooks y gestionar estados de transacción. El endpoint actual es
    una simulación.
2.  **Notificaciones push para la aplicación móvil:** avisar sobre
    cambios de estado de pedidos, respuestas a PQRS y promociones.
3.  **Panel de auditoría y alertas:** registrar acciones administrativas
    relevantes y consolidar alertas de stock con control de duplicados.

Antes de presentar estas propuestas, revisar si alguna ya se implementó
en otra rama o módulo.

## 9. Configuración y despliegue

### 9.1. Preparación del backend

1.  Instalar una versión de Node.js compatible con `package.json`.
2.  Instalar dependencias con el gestor correspondiente (`npm install` o
    el comando definido por el proyecto).
3.  Configurar las variables de entorno requeridas para Supabase, JWT,
    correo y servicios externos.
4.  Confirmar el archivo de inicio del servidor y el comando `start` en
    `package.json`.
5.  Verificar que `server.js` monte todos los routers y que los prefijos
    coincidan con la tabla de endpoints.
6.  Ejecutar pruebas de salud, autenticación, permisos y acceso a base
    de datos antes de desplegar.

### 9.2. Preparación del frontend

1.  Configurar la URL de la API mediante la variable de entorno que lea
    la aplicación.
2.  Instalar dependencias y ejecutar el build de producción definido por
    Vite.
3.  Confirmar las rutas del frontend y la configuración para
    aplicaciones SPA.
4.  Verificar que el frontend no incluya secretos de servidor.
5.  Probar login, catálogo, carrito y operaciones administrativas contra
    el backend desplegado.

### 9.3. Lista de verificación de despliegue

-   [ ] La rama y el commit publicados son los correctos.
-   [ ] Las variables de entorno están configuradas en el proveedor y no
    en el repositorio.
-   [ ] El backend inicia sin errores y expone las rutas esperadas.
-   [ ] `VITE_API_URL` apunta al dominio correcto.
-   [ ] CORS permite únicamente los orígenes necesarios.
-   [ ] El login y la verificación de correo funcionan en producción.
-   [ ] Los endpoints administrativos rechazan usuarios sin permisos.
-   [ ] Las imágenes cargan desde el almacenamiento configurado.
-   [ ] Los servicios de correo y WhatsApp se prueban con destinatarios
    autorizados.
-   [ ] Se ha probado la restauración de una copia de seguridad.
-   [ ] Se revisaron logs sin exponer tokens, contraseñas, claves o
    datos de tarjeta.

**Pendiente:** no se incluyeron archivos actuales de configuración de
Vercel, Render ni `server.js`; por eso esta sección describe el
procedimiento y no certifica que el despliegue actual esté correctamente
configurado.

## 10. Monitoreo y logs

### 10.1. Eventos que deben registrarse

-   Inicio y fallos de arranque del backend.
-   Errores de consulta o actualización en la base de datos.
-   Errores de envío de correo y WhatsApp.
-   Fallos de autenticación y denegaciones de permisos.
-   Errores de registro de pedidos, pagos simulados y devolución de
    stock.
-   Estado de las tareas programadas y cantidad de pedidos vencidos
    procesados.
-   Tiempo de respuesta de los endpoints principales y disponibilidad de
    los servicios externos.

### 10.2. Buenas prácticas

-   No registrar contraseñas, tokens JWT, claves API, CVV ni números
    completos de tarjeta.
-   Evitar devolver detalles internos de SQL o Supabase al cliente en
    producción.
-   Añadir identificadores de solicitud y marcas de tiempo para
    facilitar el diagnóstico.
-   Establecer alertas para fallos repetidos y errores 5xx.
-   Revisar periódicamente los logs y definir un periodo de retención
    acorde con las necesidades del negocio.
-   Mantener separadas las credenciales de desarrollo y producción.

## 11. Anexos

### Anexo A. Lista de comprobación técnica

-   [ ] Confirmar todos los prefijos de rutas en `server.js`.
-   [ ] Unificar el secreto JWT y eliminar valores predeterminados
    inseguros.
-   [ ] Unificar el identificador del rol administrador.
-   [ ] Proteger las rutas de gestión de productos.
-   [ ] Validar los datos del carrito, pedidos y promociones en el
    servidor.
-   [ ] Eliminar logs con información de pago y respuestas `debug` en
    producción.
-   [ ] Revisar RLS, permisos de Supabase y claves de servicio.
-   [ ] Confirmar si Supabase y la conexión `db` de WhatsApp usan la
    misma base de datos.
-   [ ] Confirmar el almacenamiento de imágenes.
-   [ ] Probar envío real de correo y WhatsApp.
-   [ ] Definir y verificar la programación de cancelación de pedidos
    vencidos.
-   [ ] Confirmar que el registro exige una verificación de correo
    válida.
-   [ ] Probar backups y restauración.

### Anexo B. Documentación de versiones

  -----------------------------------------------------------------------
  Versión           Fecha             Descripción       Responsable
  ----------------- ----------------- ----------------- -----------------
  0.1               26/10/2026        Consolidación     Equipo del
                                      inicial a partir  proyecto
                                      de los códigos    
                                      compartidos;      
                                      pendiente de      
                                      validar contra el 
                                      repositorio y la  
                                      configuración     
                                      real.             

  -----------------------------------------------------------------------

### Anexo C. Aprobación

  --------------------------------------------------------------------------------------------------------------------------------
  Rol               Nombre                                 Firma                                  Fecha
  
  Responsable      
  técnico                                                                                         

  Responsable del  
  proyecto                                                                                        

  Docente/revisor   

