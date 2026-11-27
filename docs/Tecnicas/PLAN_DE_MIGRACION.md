# Plan de Migración de Datos — Buitron Coffee

*De Supabase Cloud a Supabase autohospedado con Docker (SENA CEET — Análisis y Desarrollo de Software)*

Elaborado por: \[nombre\]

## 1. Introducción y Competencias a Desarrollar

Una migración de datos solo es exitosa si cada registro llega completo, se puede comprobar y se puede revertir. Esta guía muestra cómo planificar y ejecutar una migración usando un caso real: el aplicativo de inventario de Buitron Coffee, una cafetería (microempresa) de Pitalito, Huila, cuyo propietario es Juan Carlos.


## 2. Caso de Aplicación: Buitron Coffee

Buitron Coffee tiene un aplicativo web y móvil de inventario. Su base de datos está en Supabase Cloud y se migrará a una instancia de Supabase autohospedada con Docker.

| **Componente** | **Origen**                   | **Destino**                                            |
|----------------|------------------------------|--------------------------------------------------------|
| Base de datos  | PostgreSQL en Supabase Cloud | PostgreSQL de Supabase en Docker                       |
| Autenticación  | Supabase Auth (nube)         | Supabase Auth (Docker)                                 |
| Archivos       | Storage de Supabase (nube)   | Storage de Supabase (Docker)                           |
| Backend        | Node.js con Express          | Sin cambio de código; cambia la conexión               |
| Frontend web   | React con Vite               | Sin cambio de código; cambian las variables de entorno |
| App móvil      | Flutter                      | Sin cambio de código; cambia la URL y la clave         |

**Módulos que dependen de los datos:** panel de administrador (inventario, productos, usuarios, reseñas y PQRs) y portal del usuario (catálogo, reseñas, carrito, perfil, pedidos y PQRs).

**Supuestos de esta guía:** el Docker corre en un servidor propio o VPS; no se usan servicios de nube adicionales; Storage guarda al menos las imágenes de los productos. Ajustar si no es así.

## 3. Alcance, Inventario y Orden de Migración

Lo que no está listado en el inventario, no se migra. Esta es la lista de lo que se mueve y en qué orden. No todo viaja dentro del volcado (dump) de la base de datos: algunos elementos se migran por separado.

| **Orden** | **Elemento**                                         | **Cómo se migra**                                     | **¿Va en el dump?**                        |
|-----------|------------------------------------------------------|-------------------------------------------------------|--------------------------------------------|
| 1         | Roles de base de datos                               | Exportación de roles (--role-only)                    | Sí, en archivo aparte                      |
| 2         | Esquema: tablas, políticas RLS, funciones, triggers  | Exportación del esquema                               | Sí                                         |
| 3         | Datos: productos, inventario, pedidos, reseñas, PQRs | Exportación solo de datos (--data-only)               | Sí                                         |
| 4         | Usuarios (auth.users)                                | Incluidos en los datos                                | Sí, pero sus sesiones dejan de ser válidas |
| 5         | Extensiones de PostgreSQL                            | Habilitarlas en el destino antes de restaurar         | No                                         |
| 6         | Contraseñas de roles propios con LOGIN               | Asignarlas a mano en el destino                       | No                                         |
| 7         | Archivos de Storage (imágenes)                       | Descargar de la nube y subir al destino con un script | No                                         |
| 8         | Edge Functions (si existen)                          | Copiar al servicio de funciones del Docker            | No                                         |
| 9         | Claves, secretos y URLs                              | Actualizar en backend, web y móvil                    | No                                         |

## 4. Estrategia de Migración y Entornos

Para una base de datos pequeña, como la de una microempresa, se recomienda una estrategia Big Bang controlada: ensayo completo en una instancia de pruebas y corte a producción en una ventana corta, fuera del horario de atención de la cafetería.

**Regla de oro 1:** el primer restore siempre se hace en una instancia de Docker de pruebas, nunca en la definitiva.

**Regla de oro 2:** el proyecto de Supabase Cloud no se modifica ni se borra hasta terminar la estabilización. Es el respaldo y el plan de reversión.

**Regla de oro 3:** las claves y el archivo .env del Docker nunca se suben a un repositorio.

## 5. Procedimiento Técnico

### 5.1 Preparar el destino

- Levantar Supabase con Docker Compose siguiendo la guía oficial de autohospedaje.
- Definir en el .env las claves propias (JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY) y contraseñas seguras.
- Consultar las extensiones activas en el origen y habilitar las mismas en el destino:

```sql
select * from pg_extension;
```

- Comparar la versión de PostgreSQL del origen y del destino, porque pueden ser distintas.

### 5.2 Exportar desde Supabase Cloud

Se usa la CLI de Supabase (no un pg_dump directo, que incluye elementos internos de la plataforma y puede fallar al restaurar). La cadena de conexión se copia del botón Connect del panel de Supabase.

```bash
supabase db dump --db-url "$DB_ORIGEN" -f roles.sql --role-only
supabase db dump --db-url "$DB_ORIGEN" -f schema.sql
supabase db dump --db-url "$DB_ORIGEN" -f data.sql --use-copy --data-only
```

### 5.3 Restaurar en Docker

```bash
psql --single-transaction --variable ON_ERROR_STOP=1 \
--file roles.sql --file schema.sql \
--command 'SET session_replication_role = replica' \
--file data.sql --dbname "$DB_DESTINO"
```

La opción --single-transaction hace que, si algo falla, no quede nada a medias. Verificar siempre estos comandos contra la documentación oficial vigente de Supabase ("Restore a Platform Project to Self-Hosted").

### 5.4 Pasos posteriores al restore

- Asignar contraseña a los roles propios con LOGIN.
- Subir los archivos de Storage (fotos de productos) y comprobar que las URLs funcionan.
- Copiar las Edge Functions, si hay.
- Si hay inicio de sesión con Google u otro proveedor, actualizar las URLs de redirección en la consola del proveedor.

## 6. Reconfiguración de las Aplicaciones

El código casi no cambia, pero los valores de conexión sí. Como el JWT_SECRET del destino es distinto, las sesiones abiertas dejan de funcionar y los usuarios deben iniciar sesión de nuevo.

| **Elemento**         | **Origen (nube)**                    | **Destino (Docker)**                           |
|----------------------|--------------------------------------|------------------------------------------------|
| URL de la API        | https://\[proyecto\].supabase.co     | URL o dominio del servidor Docker              |
| Clave pública (anon) | Clave del proyecto en la nube        | ANON_KEY definida en el .env del Docker        |
| Clave de servicio    | Clave service_role de la nube        | SERVICE_ROLE_KEY del .env (solo en el backend) |
| Cadena de conexión   | Pooler o conexión directa de la nube | Conexión al Postgres del Docker                |
| URLs de imágenes     | Dominio de Storage en la nube        | Dominio de Storage del Docker                  |

Estos valores se actualizan en tres lugares: variables de entorno del backend (Node/Express), archivo .env del frontend (React/Vite) y configuración de la app Flutter.

## 7. Plan de Ejecución por Fases

Cada fase termina con una puerta de calidad (Go/No-Go) obligatoria.

| **Fase** | **Nombre**       | **Actividades**                                                                                         |
|----------|------------------|---------------------------------------------------------------------------------------------------------|
| 0        | Preparación      | Inventario, versiones, extensiones, respaldo de la nube y Docker de pruebas listo.                      |
| 1        | Ensayo           | Exportar, restaurar en pruebas y medir cuánto tarda.                                                    |
| 2        | Validación (UAT) | Valeria prueba como usuaria y Juan Carlos como administrador, en web y móvil.                           |
| 3        | Corte            | Congelar operaciones, exportar de nuevo, restaurar en el Docker definitivo y cambiar las claves y URLs. |
| 4        | Estabilización   | Monitoreo, soporte y respaldos automáticos del nuevo servidor.                                          |

## 8. Validación, Pruebas y Seguimiento (UAT)

La migración se da por buena cuando supera métricas medibles. Se valida en tres niveles.

### Nivel 1. Conciliación de totales

```sql
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) AS pedidos, SUM(total) AS valor_total FROM pedidos;
SELECT COUNT(*) FROM auth.users;
-- Ejecutar en origen y destino; los resultados deben ser iguales.
```

### Nivel 2. Integridad y seguridad

```sql
SELECT d.id FROM detalle_pedido d
LEFT JOIN pedidos p ON p.id = d.pedido_id
WHERE p.id IS NULL; -- debe devolver 0 filas

SELECT COUNT(*) FROM pg_policies; -- mismas políticas RLS en ambos
```

### Nivel 3. Calidad de datos y pruebas funcionales

```sql
SELECT id FROM productos WHERE precio IS NULL OR precio <= 0;
SELECT producto_id FROM inventario WHERE stock < 0;
```

- Valeria inicia sesión de nuevo, ve el catálogo con imágenes, agrega al carrito y revisa sus pedidos.
- Juan Carlos entra al panel y verifica inventario, productos, reseñas y PQRs.

**Tip:** registra los errores del UAT en un tablero Kanban (Google Tasks, Trello) para priorizarlos antes de autorizar el corte.

## 9. Matriz de Riesgos

| **Riesgo**                            | **Probab.** | **Impacto** | **Mitigación**                                                 |
|---------------------------------------|-------------|-------------|----------------------------------------------------------------|
| Extensión no disponible en el destino | Media       | Alto        | Revisar pg_extension en el origen y probar en el ensayo.       |
| Versiones de PostgreSQL distintas     | Media       | Medio       | Usar la CLI de Supabase y ensayar antes del corte.             |
| Sesiones inválidas por cambio de JWT  | Alta        | Bajo        | Avisar a los usuarios; iniciar sesión de nuevo.                |
| Imágenes de productos sin migrar      | Media       | Medio       | Script de copia de Storage y verificación de URLs.             |
| Pérdida de datos en el corte          | Baja        | Alto        | Respaldo previo, ventana de congelamiento y rollback aprobado. |
| Servidor Docker sin respaldos         | Media       | Alto        | Programar respaldos y probar una restauración.                 |

## 10. Plan de Reversión (Rollback)

El Plan B se aprueba antes del día del corte. Como el proyecto en Supabase Cloud no se toca, volver atrás es rápido. Si hay pérdida de datos inaceptable o fallos que bloquean los flujos principales:

1. Detener el acceso al nuevo servidor Docker.
2. Volver a poner en el backend, el frontend y la app Flutter las URLs y claves de Supabase Cloud.
3. Informar a Juan Carlos y retomar la operación con la nube mientras se diagnostica el problema.
4. Registrar los datos creados durante la ventana para reconciliarlos antes de un nuevo intento.

