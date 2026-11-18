# 🛡️ PLAN DE RESPALDO Y RECUPERACIÓN DE DATOS

## Buitron Coffee — Aplicativo web y móvil de inventario

**Responsable técnico:** saray 
**Fecha de preparación:** 26 de octubre de 2026
**Versión:** 1.0
**Estado:** Borrador 


**El sistema en una mirada**

| Componente | Tecnología |
|---|---|
| Base de datos | PostgreSQL en Supabase (en proceso de migración a Supabase autohospedado con Docker) |
| Backend | Node.js con Express |
| Frontend web | React con Vite |
| App móvil | Flutter |
| Negocio | Empresa de café (microempresa) en Pitalito, Huila. Propietario: Juan Carlos |

**Tablas del sistema** (nombres de ejemplo; ajusta a tu esquema real):

| Tabla | Contenido |
|---|---|
| `usuarios` | Perfil de clientes y administradores |
| `productos` | Catálogo de café y productos |
| `inventario` | Existencias y movimientos de inventario |
| `pedidos` | Cabecera de pedidos |
| `detalle_pedido` | Productos y cantidades de cada pedido |
| `resenas` | Reseñas de productos |
| `pqrs` | Peticiones, quejas, reclamos y sugerencias |

---

## 1. Objetivo y Alcance

### Objetivo

Proteger la información de Buitron Coffee (productos, inventario, pedidos, usuarios, reseñas y PQRs) mediante copias de seguridad verificables, y definir los pasos exactos para recuperarla cuando se pierda o se dañe, de modo que el negocio pueda seguir vendiendo en pocas horas y sin perder más de un día de datos.

### RPO y RTO

| Indicador | Valor | Justificación |
|---|---|---|
| **RPO** (datos que puedo perder) | **24 horas** | Hay un backup propio cada noche. Para un negocio pequeño, perder los pedidos de un día es molesto pero se puede reconstruir con los registros de WhatsApp, los recibos y el conteo físico. **[confirmar con Juan Carlos]** |
| **RTO** (tiempo máximo caído) | **4 horas** | Es el tiempo que Juan Carlos puede estar sin recibir pedidos por la app sin un daño serio, y es alcanzable con una base de datos pequeña. Se comprobará con el laboratorio 2 (**[completar: RTO real medido]**). |

**¿Qué pasa si se pierde un día de datos? ¿Y una hora?** Un día: se pierden pedidos, cambios de inventario y PQRs de la jornada, y hay que reconstruirlos a mano. Una hora: casi siempre es recuperable sin impacto. Por eso el RPO de 24 horas es aceptable, pero si Juan Carlos decide que no lo es, la mejora es un segundo backup al día (ver Sección 5).

**¿Se podría cumplir un RPO de 1 hora?** Solo con recuperación a un punto en el tiempo (PITR) o con backups cada hora. Los planes de Supabase hacen una copia diaria como máximo, y PITR es un complemento de pago. Para una microempresa no se justifica, así que no se promete.

### Alcance

| Incluye | No incluye |
|---|---|
| Base de datos PostgreSQL (esquema `public`: tablas, índices, funciones, políticas RLS) | Computadores y celulares de los usuarios |
| Cuentas de usuario (autenticación) mediante backup con la CLI de Supabase | Datos de terceros (pasarelas de pago, correo) |
| Archivos de Storage (fotos de productos) **(Futuro)** | Contenido de otras apps de Juan Carlos |
| Código (repositorio en GitHub) | |
| Configuración (variables de entorno, guardadas cifradas, nunca en Git) | |

 **Lista de chequeo**
- [x] El RPO y el RTO son alcanzables con las herramientas que de verdad uso (pg_dump + cron).
- [x] El alcance dice qué queda por fuera.

---

## 2. Política de Respaldos

### Principios

1. **Regla 3-2-1:** tres copias, en dos tipos de almacenamiento, una fuera del sitio.
2. Los backups se **prueban**: un backup sin restaurar no cuenta.
3. Los backups contienen datos personales de los usuarios (nombre, correo, teléfono), así que se tratan como información sensible: se protegen y no se suben a repositorios. En Colombia aplica la Ley 1581 de 2012 de protección de datos personales **(verificar con el docente o un asesor legal)**.
4. Nunca se practican restauraciones sobre la base de producción.

### Regla 3-2-1 en Buitron Coffee

| Copia | Dónde | Tipo de almacenamiento |
|---|---|---|
| 1. Producción | Supabase | Nube del proveedor |
| 2. Backup propio diario | Disco del computador o servidor del responsable | Disco local |
| 3. Copia off-site semanal (cifrada) | Google Drive | Nube de otro proveedor |

Más una cuarta capa, solo si el proyecto está en plan Pro: los backups diarios que hace Supabase (no se cuentan como una de las tres copias porque son del mismo proveedor).

### Criticidad de los datos

| Nivel | Qué pasa si se pierde | Tablas | RPO | RTO | Retención |
|---|---|---|---|---|---|
|  Crítico | Pérdida de dinero, inventario falso o problema legal | `pedidos`, `detalle_pedido`, `inventario` | 24 h | 4 h | Diarios 30 días, semanales 90 días, mensuales 12 meses, cierre de año 10 años |
|  Importante | Se reconstruye con esfuerzo | `productos`, `usuarios`, `pqrs` | 24 h | 8 h | Diarios 30 días, semanales 90 días, mensuales 12 meses |
|  Normal | Molesto, pero no grave | `resenas`, configuración, logs | 7 días | 24 h | Diarios 30 días |

> Como un solo backup contiene todas las tablas, la retención más larga (la de lo crítico) manda para esos archivos. Lo que cambia entre niveles es el **orden de restauración**: primero lo crítico.

### Responsabilidad compartida

| Componente | Quién protege la infraestructura | Quién hace el backup | Verificación |
|---|---|---|---|
| Servidores de Supabase | Supabase | Supabase (solo planes de pago) | Semanal: revisar el panel de backups |
| Datos de la base | Supabase | **Nosotros** (`pg_dump`) | Diaria: log; semanal: huella e integridad |
| Archivos de Storage | Supabase | **Nosotros** (Futuro) | Mensual |
| Código | GitHub | GitHub (+ copia local) | En cada `push` |
| Credenciales y `.env` | Nosotros | Nosotros (gestor de contraseñas) | Mensual |
| Servidor Docker (tras la migración) | **Nosotros** | **Nosotros** | Diaria |

> Aunque Supabase proteja su infraestructura, los datos siguen siendo nuestra responsabilidad: si alguien borra una tabla por error, Supabase no lo deshace por nosotros.

### ¿Qué incluye realmente Supabase?

| Plan | Backups diarios | Retención | PITR |
|---|---|---|---|
| Free | No | 0 días | No |
| Pro | Sí | 7 días | Complemento de pago |

Plan actual del proyecto: **[completar: Free o Pro]**. Si es Free, **no hay ningún respaldo del proveedor**, y el backup propio es la única protección.

 **Lista de chequeo**
- [x] Cada tabla está clasificada.
- [x] Hay al menos una copia fuera de Supabase (Google Drive).

---

## 3. Estrategia de Respaldo

Se usa **defensa en profundidad**: varias capas, de modo que si una falla, otra protege.

| Nivel | Qué respalda | Frecuencia | Retención | Dónde se guarda | Tiempo de recuperación (estimado, reemplazar con lo medido) |
|---|---|---|---|---|---|
| 1. Supabase (solo plan Pro) | Base de datos completa | Diaria (automática) | 7 días | Supabase | ~1 hora |
| 2. Backup propio (`pg_dump`) | Esquema `public` | Diaria, 2:00 a. m. (automática) | 30 días | Disco local | ~30 min |
| 3. Copia off-site cifrada | Último backup semanal | Semanal (domingo) | 90 días | Google Drive | ~1 hora (incluye descarga) |
| 4. Backup manual previo a cambios | Esquema `public` | Antes de cada cambio riesgoso | Hasta confirmar el cambio y 7 días más | Disco local | ~30 min |
| 5. Versionado del código | Código fuente | En cada `push` | Indefinida | GitHub | ~15 min |

**Automático vs manual:** los niveles 1, 2 y 3 se programan para que no dependan de la memoria de nadie. El nivel 4 es manual y obligatorio antes de modificar tablas, correr migraciones o cambiar políticas.

**Backup de datos ≠ código:** GitHub guarda el código, no el contenido de la base de datos. Quien diga "no necesito backups porque mi proyecto está en GitHub" está protegiendo las recetas y no los ingredientes: si se pierden los pedidos, el código no los trae de vuelta.

 **Lista de chequeo**
- [x] Ningún nivel depende solo de que alguien se acuerde.
- [x] Se separa el respaldo del código del respaldo de los datos.

---

## 4. Tipos de Respaldo

| Tipo | Qué copia | Ventaja | Desventaja | Uso en Buitron Coffee |
|---|---|---|---|---|
| Completo | Todo | Se restaura solo | Más espacio y tiempo | **Sí**, diario (la base es pequeña) |
| Incremental | Lo cambiado desde el último backup de cualquier tipo | Rápido y liviano | Restaurar exige el completo + todos los incrementales en orden | No |
| Diferencial | Lo cambiado desde el último completo | Restaurar = completo + 1 diferencial | Crece cada día | No |
| Snapshot | Foto del disco | Restauración muy rápida | Depende del proveedor | Solo el de Supabase (plan Pro) |
| Lógico | Datos exportados como SQL (`pg_dump`) | Portátil entre servidores y versiones | Lento en bases grandes | **Sí**, es el principal |
| Físico | Archivos internos de la base | Muy rápido | Solo sirve en el mismo tipo de servidor | No (lo hace Supabase) |

**Incremental vs diferencial, con un ejemplo.** Si el lunes hay un completo y cada día cambian 5 MB: el martes el incremental pesa 5 MB y el diferencial 5 MB. El miércoles el incremental pesa 5 MB (solo lo de ese día) y el diferencial 10 MB (todo lo cambiado desde el lunes). Para restaurar el jueves: con incrementales necesito lunes + martes + miércoles + jueves; con diferenciales, lunes + jueves.

**Por qué completo diario:** la base de datos de una microempresa como esta es pequeña, un completo toma pocos segundos y es mucho más simple de restaurar. Los incrementales traen un riesgo oculto: una consulta como `WHERE created_at > [ULTIMO_BACKUP]` solo captura registros **nuevos**. No captura registros **modificados** (por ejemplo, un pedido que cambia de estado) ni **eliminados**. Para cubrirlos haría falta una columna `updated_at` mantenida por un trigger y borrado lógico (`deleted_at`) o una tabla de auditoría. Como no se usan incrementales, no hace falta.

**Qué incluye el backup completo:**
- Esquema `public`: tablas (`usuarios`, `productos`, `inventario`, `pedidos`, `detalle_pedido`, `resenas`, `pqrs`), índices, funciones, triggers y políticas RLS.
- **No incluye** el esquema `auth` (credenciales de los usuarios): el comando de la guía usa `--schema=public`. Por eso se agrega un segundo backup con la CLI de Supabase (ver Sección 6).
- **No incluye** Storage (fotos de productos): **(Futuro)**.

 **Lista de chequeo**
- [x] Sé explicar la diferencia entre incremental y diferencial con un ejemplo.
- [x] El backup incluye la estructura y no solo los datos.

---

## 5. Frecuencia y Retención

### Calendario semanal

| Día | 2:00 a. m. | Otras tareas |
|---|---|---|
| Lunes a sábado | Backup propio completo (automático) | Lunes: verificación semanal de integridad |
| Domingo | Backup completo + **copia semanal** | Copia off-site cifrada a Google Drive |
| Día 1 de cada mes | Backup completo + **copia mensual** | Prueba mensual de restauración |
| 31 de diciembre | Copia de **cierre de año** | Guardar con retención de 10 años |

**Ventana de backup:** 2:00 a. m., fuera del horario de atención del negocio. **[confirmar horario del negocio]**

### Retención

| Copia | Retención | Cuántas hay al mismo tiempo |
|---|---|---|
| Diarias | 30 días | 30 |
| Semanales | 90 días | ~13 |
| Mensuales | 12 meses | 12 |
| Cierre de año | 10 años | 1 por año |

**Retención legal:** en Colombia los libros y papeles del comerciante deben conservarse 10 años contados desde la fecha del último asiento, documento o comprobante (artículo 28 de la Ley 962 de 2005). Para este plan se conserva un backup de cierre de año por 10 años, **(verificar con el contador de Juan Carlos qué documentos del sistema cuentan y desde cuándo, porque este plan no es asesoría legal)**.

### Espacio necesario para el primer año

Se mide primero el tamaño real de la base de datos:

```sql
SELECT pg_size_pretty(pg_database_size(current_database())) AS tamano_bd;
```

Tamaño real: **[completar: ___ MB]** (el `.dump` comprimido suele pesar menos).

Fórmula:

```
Espacio ≈ T × (30 diarios + 13 semanales + 12 mensuales + 1 cierre de año)
        = T × 56
```

Ejemplo ilustrativo con T = 30 MB (**reemplazar con tu tamaño real**): 30 × 56 = 1.680 MB ≈ **1,7 GB**. Y si la base crece, por ejemplo, 5 MB al mes, el tamaño a fin de año sería ~90 MB y el espacio, ~5 GB: conviene recalcular cada trimestre.

> **Sobre el cálculo del ejemplo de la guía:** con retención de 90 días hay ~13 semanales al mismo tiempo, no 12 ni 52, y el tamaño de cada copia no se queda fijo: crece con la base.

**Mejora posible (Futuro):** un segundo backup al día (2:00 a. m. y 2:00 p. m.) bajaría el RPO a 12 horas.

 **Lista de chequeo**
- [ ] El tamaño de la base de datos es real, no inventado. **[completar]**
- [x] La retención de datos críticos contempla lo que exige la ley.

---

## 6. Procedimientos de Respaldo  Laboratorio

### 6.1 Preparación (una sola vez)

1. En Supabase, botón **Connect**, copia la cadena de conexión de PostgreSQL (usa **Session pooler** si tu red no tiene IPv6).
2. Guarda la cadena **fuera del script y fuera de Git**, en un archivo que solo tú puedes leer:

   ```bash
   echo 'export DB_URL="postgresql://postgres.[ref]:[CONTRASEÑA]@[host]:5432/postgres"' > ~/.buitron_backup.env
   chmod 600 ~/.buitron_backup.env
   ```

3. Agrega al `.gitignore` del proyecto: `*.dump`, `*.sql`, `*.sha256`, `.env`, `*.env`.
4. Comprueba que `pg_dump --version` sea igual o mayor que la versión de PostgreSQL de tu proyecto (*Project Settings → Infrastructure*).

### 6.2 Laboratorio 1: primer backup manual

```bash
source ~/.buitron_backup.env
FECHA=$(date +%Y-%m-%d_%H-%M)
pg_dump "$DB_URL" --schema=public --no-owner -Fc -f "backup_$FECHA.dump"
shasum -a 256 "backup_$FECHA.dump" > "backup_$FECHA.sha256"     # Mac
sha256sum   "backup_$FECHA.dump" > "backup_$FECHA.sha256"       # Linux
pg_restore --list "backup_$FECHA.dump" | head -40
```

Anota: tamaño **[completar]**, duración **[completar]**, número de tablas que aparecen **[completar]**.

### 6.3 Script `backup.sh` (backup diario automático)

```bash
#!/usr/bin/env bash
# backup.sh — Backup lógico diario de la base de datos de Buitron Coffee
set -euo pipefail

ENV_FILE="$HOME/.buitron_backup.env"   # contiene: export DB_URL="..."
[ -f "$ENV_FILE" ] && source "$ENV_FILE"
: "${DB_URL:?Falta la variable DB_URL}"

DIR="${BACKUP_DIR:-$HOME/backups/buitron}"
mkdir -p "$DIR/semanal" "$DIR/mensual"
cd "$DIR"

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a backup.log; }
if command -v sha256sum >/dev/null 2>&1; then HASH="sha256sum"; else HASH="shasum -a 256"; fi

FECHA=$(date +%Y-%m-%d_%H-%M)
ARCHIVO="backup_${FECHA}.dump"
INICIO=$(date +%s)
log "INICIO backup $ARCHIVO"

# 1) Exportar
if ! pg_dump "$DB_URL" --schema=public --no-owner -Fc -f "$ARCHIVO"; then
  log "ERROR: pg_dump falló"; rm -f "$ARCHIVO"; exit 1
fi

# 2) Comprobar que no está vacío ni dañado
TAMANO=$(wc -c < "$ARCHIVO" | tr -d ' ')
if [ "$TAMANO" -lt 10240 ]; then
  log "ERROR: backup sospechosamente pequeño ($TAMANO bytes)"; exit 1
fi
if ! pg_restore --list "$ARCHIVO" > /dev/null; then
  log "ERROR: pg_restore no puede leer el archivo"; exit 1
fi

# 3) Huella
$HASH "$ARCHIVO" > "${ARCHIVO}.sha256"
SHA=$(cut -d' ' -f1 "${ARCHIVO}.sha256")

# 4) Copias semanal (domingo) y mensual (día 1)
[ "$(date +%u)" = "7" ] && cp "$ARCHIVO" "${ARCHIVO}.sha256" semanal/ || true
[ "$(date +%d)" = "01" ] && cp "$ARCHIVO" "${ARCHIVO}.sha256" mensual/ || true

# 5) Retención
find . -maxdepth 1 -name 'backup_*' -mtime +30 -delete
find semanal -name 'backup_*' -mtime +90 -delete
find mensual -name 'backup_*' -mtime +365 -delete

# 6) Registro
DURACION=$(( $(date +%s) - INICIO ))
echo "${FECHA},completo,${ARCHIVO},${TAMANO},${SHA},OK,${DURACION}" >> control_backups.csv
log "OK $ARCHIVO tamaño=${TAMANO}B tiempo=${DURACION}s"
```

> El umbral de 10 KB es un ejemplo: ajústalo al tamaño real de tu backup (por ejemplo, la mitad de lo normal).

### 6.4 Programación con cron

```bash
# minuto hora día-mes mes día-semana  comando
0 2 * * * /ruta/a/backup.sh >> /ruta/a/backup.log 2>&1
```

Para editarlo: `crontab -e`. El equipo debe estar **encendido** a las 2:00 a. m. (si es un portátil que se apaga, usa un servidor o la tarea programada del sistema).

### 6.5 Backup de usuarios (`auth`)

El `--schema=public` no incluye las cuentas de usuario. Si tus tablas dependen de `auth.users`, haz también este backup con la CLI de Supabase (incluye `auth.users`):

```bash
supabase db dump --db-url "$DB_URL" -f roles.sql --role-only
supabase db dump --db-url "$DB_URL" -f schema.sql
supabase db dump --db-url "$DB_URL" -f data.sql --use-copy --data-only
```

### 6.6 Copia off-site cifrada (semanal)

```bash
gpg --symmetric --cipher-algo AES256 backup_FECHA.dump        # pide una contraseña; guárdala en el gestor de contraseñas
rclone copy backup_FECHA.dump.gpg gdrive:buitron-backups/     # requiere configurar rclone con Google Drive una vez
```

Cómo comprobar que la copia en la nube sirve: descargar el archivo desde Drive, descifrarlo y verificar que su huella coincide con la del original.

### 6.7 Backup manual antes de un cambio riesgoso

1. Ejecuta `backup.sh` (o el comando del laboratorio 1).
2. Comprueba que el `.dump` existe, que pesa lo esperado y que `pg_restore --list` lo lee.
3. Anota en `control_backups.csv` el motivo del cambio.
4. Haz el cambio. Si sale mal, usa el escenario 2 o 3 de la Sección 7.
5. Conserva este backup hasta confirmar que todo funciona, y 7 días más.

### 6.8 Backup de Storage (Futuro)

Script que liste y descargue los objetos de cada bucket (por ejemplo, con la API de Storage de Supabase) y los comprima con `tar -czf`. Hasta que exista, las fotos de productos deben tener su original en el computador del responsable.

 **Lista de chequeo**
- [ ] Tengo un archivo `.dump` real y su `.sha256`. **[completar]**
- [x] El script no tiene contraseñas escritas dentro.
- [x] Los backups no están en el repositorio de GitHub.

---

## 7. Procedimientos de Restauración  Laboratorio

> **Regla:** se restaura primero en un proyecto de prueba (vacío) y solo se toca producción después de verificar.

### 7.1 Laboratorio 2: restaurar el backup completo

1. **Antes de empezar**, cuenta los registros en el proyecto principal y guarda el resultado:

   ```sql
   SELECT 'usuarios' AS tabla, COUNT(*) FROM usuarios
   UNION ALL SELECT 'productos', COUNT(*) FROM productos
   UNION ALL SELECT 'inventario', COUNT(*) FROM inventario
   UNION ALL SELECT 'pedidos', COUNT(*) FROM pedidos
   UNION ALL SELECT 'detalle_pedido', COUNT(*) FROM detalle_pedido
   UNION ALL SELECT 'resenas', COUNT(*) FROM resenas
   UNION ALL SELECT 'pqrs', COUNT(*) FROM pqrs;
   ```

2. Verifica la huella:

   ```bash
   shasum -a 256 -c backup_FECHA.sha256   # Mac
   sha256sum -c backup_FECHA.sha256        # Linux
   ```

3. Inicia el cronómetro ⏱️ y restaura en el proyecto de prueba:

   ```bash
   export DB_PRUEBA="postgresql://postgres.[ref-prueba]:[CONTRASEÑA]@[host]:5432/postgres"
   pg_restore -d "$DB_PRUEBA" --no-owner --no-privileges backup_FECHA.dump
   ```

4. Repite el conteo en el proyecto de prueba. **Los números deben coincidir.**
5. Detén el cronómetro: ese es el **RTO real** de este escenario → **[completar: ___ minutos]**.
6. Revisa que llegaron las políticas RLS (*Authentication → Policies*) y los triggers (*Database → Triggers*).

Avisos de `pg_restore` por objetos que ya existen en Supabase: se anotan en el reporte indicando cuáles importan y cuáles no ****.

> Si tus tablas tienen llaves foráneas hacia `auth.users`, la restauración de `public` fallará por esas referencias. En ese caso restaura primero los usuarios con el backup de la Sección 6.5.

### 7.2 Escenarios de recuperación

#### Escenario 1: se borró por error un pedido

| | |
|---|---|
| **RPO / RTO** | 24 h / 1 h |
| **Complejidad** | Baja |

1. **Detener los cambios:** avisar al equipo que no se modifique el pedido afectado.
2. Ubicar el backup más reciente **anterior al borrado** y verificar su huella.
3. Restaurar **solo las tablas necesarias** en el proyecto de prueba:

   ```bash
   pg_restore -d "$DB_PRUEBA" --no-owner --table=pedidos --table=detalle_pedido backup_FECHA.dump
   ```

4. Exportar el pedido y su detalle desde la prueba:

   ```bash
   psql "$DB_PRUEBA" -c "\copy (SELECT * FROM pedidos WHERE id = 123) TO 'pedido.csv' CSV HEADER"
   psql "$DB_PRUEBA" -c "\copy (SELECT * FROM detalle_pedido WHERE pedido_id = 123) TO 'detalle.csv' CSV HEADER"
   ```

5. Importarlos a producción (primero `pedidos`, luego `detalle_pedido`):

   ```bash
   psql "$DB_URL" -c "\copy pedidos FROM 'pedido.csv' CSV HEADER"
   psql "$DB_URL" -c "\copy detalle_pedido FROM 'detalle.csv' CSV HEADER"
   ```

6. **Verificar:** que Valeria (usuaria de prueba) vea el pedido en su historial y que el inventario sea coherente.

#### Escenario 2: una tabla quedó con datos dañados (por ejemplo, precios en 0)

| | |
|---|---|
| **RPO / RTO** | 24 h / 2 h |
| **Complejidad** | Media |

1. **Hacer un backup manual ahora** (Sección 6.7) del estado dañado, por si algo sale peor.
2. Restaurar la tabla `productos` del último backup sano en el proyecto de prueba (`--table=productos`).
3. Exportar la tabla desde la prueba a `productos_ok.csv` con `\copy`.
4. En producción, **sin usar `TRUNCATE ... CASCADE`** (borraría también `detalle_pedido` e `inventario`, que dependen de `productos`), corregir con una tabla temporal:

   ```sql
   BEGIN;
   CREATE TEMP TABLE productos_ok (LIKE productos);
   \copy productos_ok FROM 'productos_ok.csv' CSV HEADER
   UPDATE productos p
   SET precio = o.precio
   FROM productos_ok o
   WHERE p.id = o.id AND p.precio IS DISTINCT FROM o.precio;
   -- revisar el resultado antes de confirmar
   COMMIT;
   ```

5. **Verificar** con las consultas de validación de la Sección 8.

#### Escenario 3: se perdió toda la base de datos

| | |
|---|---|
| **RPO / RTO** | 24 h / 4 h |
| **Complejidad** | Alta |

1. Declarar el desastre (Sección 8) y avisar a Juan Carlos.
2. Crear un **proyecto nuevo** de Supabase (o levantar el Docker de destino).
3. Verificar la huella del último backup bueno (o el semanal de Drive, descargándolo y descifrándolo).
4. Restaurar usuarios (Sección 6.5, si aplica) y luego el backup completo:

   ```bash
   pg_restore -d "$DB_NUEVA" --no-owner --no-privileges backup_FECHA.dump
   ```

5. Actualizar la **URL y las claves** (anon y service role) en el backend (Node), el frontend (React/Vite) y la app Flutter, porque el proyecto nuevo tiene valores distintos.
6. Ejecutar las consultas de validación (Sección 8).
7. Probar de punta a punta: Valeria inicia sesión, ve el catálogo y hace un pedido; Juan Carlos entra al panel.
8. Reabrir el servicio y comunicar.

> Tras la migración a Docker, este mismo escenario aplica con el servidor propio: se restaura en un contenedor nuevo de Supabase.

#### Escenario 4: una actualización de la aplicación salió mal

| | |
|---|---|
| **RPO / RTO** | 0 (no se pierden datos si hay backup previo) / 1 h |
| **Complejidad** | Media |

1. Confirmar que antes de la actualización se hizo el backup manual (Sección 6.7).
2. **Frontend y backend:** volver al despliegue o al commit anterior (por ejemplo, `git revert` o redesplegar la etiqueta anterior). En Vercel se puede promover el despliegue anterior desde el panel. **[completar: dónde está publicado el sistema]**
3. **Base de datos:** si la actualización incluyó una migración que modificó tablas, revertirla con el script inverso; si no existe, restaurar la tabla afectada como en el escenario 2.
4. **App móvil:** una versión ya publicada no se revierte al instante, así que se mantiene compatible con la API anterior y se publica una versión corregida.
5. Verificar los flujos principales (login, catálogo, carrito, pedidos).

✅ **Lista de chequeo**
- [ ] Restauré mi backup y los conteos coinciden. ****
- [ ] Medí mi RTO real con cronómetro. **
- [x] Cada escenario termina con un paso de verificación.

---

## 8. Plan de Recuperación ante Desastres (DRP)

### ¿Qué es un desastre para Buitron Coffee?

Cualquier evento que deje la base de datos o la aplicación **fuera de servicio por más de 4 horas** (el RTO), o que cause una pérdida de datos mayor a la permitida (más de 24 horas, el RPO).

### Causas posibles

| # | Causa | Probabilidad | Impacto |
|---|---|---|---|
| 1 | Borrado o modificación por error (script, usuario administrador) | Alta | Medio |
| 2 | Error durante la migración de Supabase a Docker | Media | Alto |
| 3 | Caída, pausa o eliminación del proyecto de Supabase, o falla del servidor Docker | Baja | Alto |
| 4 | Credenciales filtradas, acceso malicioso o ransomware | Baja | Alto |
| 5 | Pérdida del computador donde están los backups locales | Media | Medio |

Para el ransomware y la pérdida del equipo, la copia cifrada en Google Drive debe estar **fuera del alcance** de quien tiene acceso a producción y del computador.

### Las 5 fases

| Fase | Acciones | Responsable | Tiempo objetivo |
|---|---|---|---|
| 1. Detección | Una alerta del sistema, o un reporte de Juan Carlos o de un usuario. Confirmar el problema. | Responsable técnico | 0 a 30 min |
| 2. Activación y comunicación | Declarar el desastre, detener cambios, enviar el primer mensaje a Juan Carlos y a los usuarios. | Responsable técnico + Juan Carlos | 30 a 60 min |
| 3. Recuperación | Elegir el escenario de la Sección 7 y ejecutarlo. | Responsable técnico (o quien lo reemplace) | 1 a 3 h |
| 4. Validación | Consultas SQL, pruebas funcionales y aprobación de Juan Carlos antes de reabrir. | Responsable técnico + Juan Carlos | 3 a 4 h |
| 5. Post-mortem | Reunión sin buscar culpables: qué pasó, qué falló, qué se cambia en el plan. | Todos | En los 3 días siguientes |

### Mensaje al cliente durante un desastre

> **Asunto:** Aviso de interrupción del servicio de Buitron Coffee
>
> Hola, estamos presentando un problema técnico en nuestra aplicación. **Situación:** [qué pasó, en pocas palabras]. **Tiempo estimado de solución:** [X horas]. **Último respaldo disponible:** [fecha y hora]; los cambios hechos después podrían tener que registrarse de nuevo. Mientras tanto, los pedidos se pueden hacer por [WhatsApp/teléfono]. Te escribiremos de nuevo a las [hora]. Gracias por tu paciencia.

### Consultas de validación (con llaves foráneas, no con nombres)

```sql
-- 1) Conteos: comparar con los del backup
SELECT 'pedidos' AS tabla, COUNT(*) FROM pedidos
UNION ALL SELECT 'detalle_pedido', COUNT(*) FROM detalle_pedido;

-- 2) Registros huérfanos (deben devolver 0 filas)
SELECT d.id FROM detalle_pedido d
LEFT JOIN pedidos p ON p.id = d.pedido_id
WHERE p.id IS NULL;

SELECT p.id FROM pedidos p
LEFT JOIN usuarios u ON u.id = p.usuario_id
WHERE u.id IS NULL;

-- 3) Valores imposibles (deben devolver 0 filas)
SELECT id FROM inventario WHERE stock < 0;
SELECT id FROM productos WHERE precio IS NULL OR precio <= 0;

-- 4) Totales que no cuadran (deben devolver 0 filas)
SELECT p.id
FROM pedidos p
JOIN (SELECT pedido_id, SUM(cantidad * precio_unitario) AS suma
      FROM detalle_pedido GROUP BY pedido_id) d ON d.pedido_id = p.id
WHERE p.total <> d.suma;
```

> Se une por `usuario_id` y `pedido_id` (llaves foráneas) y no por nombre: dos clientes pueden llamarse igual y un cliente puede cambiar de nombre.

✅ **Lista de chequeo**
- [x] Hay un responsable con nombre para cada fase.
- [x] Las consultas de validación usan llaves foráneas, no nombres.

---

## Fuentes consultadas (26 de octubre de 2026)

- Supabase, backups: https://supabase.com/docs/guides/platform/backups y https://supabase.com/features/database-backups
- PostgreSQL, `pg_dump` y `pg_restore`: https://www.postgresql.org/docs/current/app-pgdump.html y https://www.postgresql.org/docs/current/app-pgrestore.html
- Ley 962 de 2005, artículo 28 (conservación de libros y papeles de comercio, 10 años)