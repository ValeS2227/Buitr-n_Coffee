const express = require("express");
const router = express.Router();

const supabase = require("../config/supabaseClient");
const supabaseAuth = require("../config/supabaseAuthClient");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { randomInt } = require("crypto");
const { enviarCodigoVerificacion } = require("../utils/emailService");

const SECRET = process.env.JWT_SECRET || "secreto123";

const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.usuarioId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ message: "Token inválido" });
    }
};

const verificarAdmin = async (req, res, next) => {
    const { data: usuario, error } = await supabase
        .from("usuario")
        .select("id_rol")
        .eq("id", req.usuarioId)
        .maybeSingle();

    if (error) {
        console.error("Error verificando permisos de administrador:", error);
        return res.status(500).json({ message: "No se pudieron verificar los permisos" });
    }

    if (!usuario || Number(usuario.id_rol) !== 2) {
        return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }

    next();
};

/*
|--------------------------------------------------------------------------
| REGISTRO
|--------------------------------------------------------------------------
|
| Crea:
|
| 1. Usuario en Supabase Auth
| 2. Perfil en tabla usuario
|
| De esta manera Web y Flutter utilizan la misma cuenta.
|
*/

router.post("/register", async (req, res) => {
    const {
        Nombre_usuario,
        Apellido,
        Correo,
        Documento,
        Telefono,
        Clave,
    } = req.body;

    // --------------------------------------------------
    // Validación
    // --------------------------------------------------

    if (
        !Nombre_usuario ||
        !Apellido ||
        !Correo ||
        !Documento ||
        !Telefono ||
        !Clave
    ) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios",
        });
    }

    const nombre = Nombre_usuario.trim();
    const apellido = Apellido.trim();
    const correo = Correo.trim().toLowerCase();
    const documento = Documento.trim();
    const telefono = Telefono.trim();

    if (Clave.length < 6) {
        return res.status(400).json({
            message: "La contraseña debe tener mínimo 6 caracteres",
        });
    }

    try {
        // --------------------------------------------------
        // 1. Revisar si ya existe en tabla usuario
        // --------------------------------------------------

        const {
            data: usuarioExistente,
            error: errorBusqueda,
        } = await supabase
            .from("usuario")
            .select("id, auth_user_id, correo")
            .eq("correo", correo)
            .maybeSingle();

        if (errorBusqueda) {
            console.error(
                "Error buscando usuario:",
                errorBusqueda
            );

            return res.status(500).json({
                message: "Error al verificar el correo",
            });
        }

        if (usuarioExistente) {
            return res.status(400).json({
                message:
                    "Ya existe un usuario registrado con ese correo",
            });
        }

        // --------------------------------------------------
        // 2. Consumir una verificación de correo válida
        // --------------------------------------------------

        const {
            data: verificacionConsumida,
            error: errorVerificacion,
        } = await supabase
            .from("verificaciones_email")
            .update({ verificado: false, intentos: 0 })
            .eq("correo", correo)
            .eq("verificado", true)
            .gt("fecha_expiracion", new Date().toISOString())
            .select("correo")
            .maybeSingle();

        if (errorVerificacion) {
            console.error("Error validando el código de registro:", errorVerificacion);
            return res.status(500).json({
                message: "No se pudo validar la verificación del correo",
            });
        }

        if (!verificacionConsumida) {
            return res.status(403).json({
                message: "Verifica tu correo antes de crear la cuenta",
            });
        }

        // --------------------------------------------------
        // 3. Crear cuenta confirmada en SUPABASE AUTH
        // --------------------------------------------------

        const {
            data: authData,
            error: authError,
        } = await supabase.auth.admin.createUser({
            email: correo,
            password: Clave,
            email_confirm: true,
        });

        if (authError) {
            console.error(
                "Error Supabase Auth:",
                authError
            );

            return res.status(400).json({
                message: authError.message,
            });
        }

        if (!authData || !authData.user) {
            return res.status(500).json({
                message:
                    "No se pudo crear la cuenta en Supabase Auth",
            });
        }

        const authUserId = authData.user.id;

        // --------------------------------------------------
        // 4. Crear perfil en tabla usuario
        // --------------------------------------------------

        /*
         * Se mantiene un hash bcrypt en "clave" solamente
         * para evitar romper código antiguo que todavía
         * pudiera utilizar esa columna.
         *
         * La autenticación real será Supabase Auth.
         */

        const passwordHash = await bcrypt.hash(Clave, 10);

        const {
            data: nuevoUsuario,
            error: errorUsuario,
        } = await supabase
            .from("usuario")
            .insert({
                nombre_usuario: nombre,
                apellido: apellido,
                correo: correo,
                documento: documento,
                telefono: telefono,
                clave: passwordHash,
                auth_user_id: authUserId,
                id_rol: 1,
                estado: true,
            })
            .select()
            .single();

        // --------------------------------------------------
        // 5. Si falla el perfil, borrar Auth
        // --------------------------------------------------

        if (errorUsuario) {
            console.error(
                "Error creando perfil:",
                errorUsuario
            );

            await supabase.auth.admin.deleteUser(
                authUserId
            );

            return res.status(500).json({
                message:
                    "No se pudo crear el perfil del usuario",
            });
        }

        // --------------------------------------------------
        // 6. Respuesta
        // --------------------------------------------------

        return res.status(201).json({
            message: "Cuenta creada correctamente. Ya puedes iniciar sesión.",
            usuario: {
                ID_Usuario: nuevoUsuario.id,
                Nombre_usuario:
                    nuevoUsuario.nombre_usuario,
                Apellido: nuevoUsuario.apellido,
                Correo: nuevoUsuario.correo,
                Documento: nuevoUsuario.documento,
                Telefono: nuevoUsuario.telefono,
                ID_Rol: nuevoUsuario.id_rol,
                Estado: nuevoUsuario.estado,
                SupabaseUserId:
                    nuevoUsuario.auth_user_id,
            },
        });
    } catch (error) {
        console.error(
            "ERROR REGISTRO:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
});


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
|
| El correo y contraseña se validan en Supabase Auth.
|
| Después buscamos los datos adicionales en "usuario".
|
*/

router.post("/login", async (req, res) => {
    const {
        Correo,
        Clave,
    } = req.body;

    if (!Correo || !Clave) {
        return res.status(400).json({
            message:
                "Correo y contraseña requeridos",
        });
    }

    const correo = Correo.trim().toLowerCase();

    try {
        // --------------------------------------------------
        // 1. Autenticar con Supabase Auth
        // --------------------------------------------------

        const {
            data: authData,
            error: authError,
        } = await supabaseAuth.auth.signInWithPassword({
            email: correo,
            password: Clave,
        });

        if (authError) {
            console.error(
                "Error login Supabase:",
                authError.message
            );

            return res.status(401).json({
                message:
                    "Correo o contraseña incorrectos",
            });
        }

        if (!authData.user) {
            return res.status(401).json({
                message:
                    "No se pudo obtener el usuario",
            });
        }

        // --------------------------------------------------
        // 2. Buscar perfil en tabla usuario
        // --------------------------------------------------

        const {
            data: usuario,
            error: errorUsuario,
        } = await supabase
            .from("usuario")
            .select("*")
            .eq("auth_user_id", authData.user.id)
            .maybeSingle();

        // --------------------------------------------------
        // Compatibilidad con usuarios antiguos
        // --------------------------------------------------

        let user = usuario;

        if (!user) {
            const {
                data: usuarioPorCorreo,
                error: errorCorreo,
            } = await supabase
                .from("usuario")
                .select("*")
                .eq("correo", correo)
                .maybeSingle();

            if (errorCorreo) {
                console.error(
                    "Error buscando usuario por correo:",
                    errorCorreo
                );

                return res.status(500).json({
                    message:
                        "Error al obtener los datos del usuario",
                });
            }

            user = usuarioPorCorreo;

            // Si encontramos el perfil antiguo,
            // lo vinculamos con Supabase Auth.
            if (user && !user.auth_user_id) {
                const {
                    error: errorVinculacion,
                } = await supabase
                    .from("usuario")
                    .update({
                        auth_user_id:
                            authData.user.id,
                    })
                    .eq("id", user.id);

                if (errorVinculacion) {
                    console.error(
                        "Error vinculando usuario:",
                        errorVinculacion
                    );
                }
            }
        }

        if (errorUsuario && !user) {
            console.error(
                "Error obteniendo perfil:",
                errorUsuario
            );

            return res.status(500).json({
                message:
                    "Error al obtener los datos del usuario",
            });
        }

        if (!user) {
            return res.status(404).json({
                message:
                    "La cuenta existe en Supabase Auth, pero no tiene perfil en la tabla usuario",
            });
        }

        // --------------------------------------------------
        // 3. Verificar estado
        // --------------------------------------------------

        if (
            user.estado === false ||
            user.estado === 0
        ) {
            return res.status(401).json({
                message:
                    "Tu cuenta ha sido inhabilitada. Contacta al administrador.",
            });
        }

        // --------------------------------------------------
        // 4. Crear JWT propio
        // --------------------------------------------------

        const rol = Number(user.id_rol);
        const token = jwt.sign(
            {
                id: user.id,
                rol,
                auth_user_id:
                    authData.user.id,
            },
            SECRET,
            {
                expiresIn: "1d",
            }
        );

        // --------------------------------------------------
        // 5. Respuesta
        // --------------------------------------------------

        return res.json({
            message: "Login exitoso",

            token,

            usuario: {
                ID_Usuario: user.id,
                Nombre_usuario:
                    user.nombre_usuario,
                Apellido: user.apellido,
                Correo: user.correo,
                Documento: user.documento,
                Telefono: user.telefono,
                ID_Rol: rol,
                Estado: user.estado,

                SupabaseUserId:
                    authData.user.id,
            },
        });
    } catch (error) {
        console.error(
            "ERROR LOGIN:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
});

router.get("/usuarios", verificarToken, verificarAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from("usuario")
        .select("id, nombre_usuario, apellido, correo, documento, telefono, id_rol, estado")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error obteniendo usuarios:", error);
        return res.status(500).json({ message: "Error al obtener los usuarios" });
    }

    res.json(data.map((usuario) => ({
        ID_Usuario: usuario.id,
        Nombre_usuario: usuario.nombre_usuario,
        Apellido: usuario.apellido,
        Correo: usuario.correo,
        Documento: usuario.documento,
        Telefono: usuario.telefono,
        ID_Rol: Number(usuario.id_rol),
        Estado: usuario.estado,
    })));
});

const actualizarEstadoUsuario = async (req, res, estado) => {
    if (String(req.params.id) === String(req.usuarioId) && estado === false) {
        return res.status(400).json({ message: "No puedes inhabilitar tu propio usuario" });
    }

    const { data, error } = await supabase
        .from("usuario")
        .update({ estado })
        .eq("id", req.params.id)
        .select("id")
        .maybeSingle();

    if (error) {
        console.error("Error actualizando estado del usuario:", error);
        return res.status(500).json({ message: "Error al actualizar el estado del usuario" });
    }

    if (!data) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
        message: estado ? "Usuario habilitado correctamente" : "Usuario inhabilitado correctamente",
    });
};

router.patch("/usuarios/:id/inhabilitar", verificarToken, verificarAdmin, async (req, res) =>
    actualizarEstadoUsuario(req, res, false)
);

router.patch("/usuarios/:id/habilitar", verificarToken, verificarAdmin, async (req, res) =>
    actualizarEstadoUsuario(req, res, true)
);

router.patch("/usuarios/:id/cambiar-rol", verificarToken, verificarAdmin, async (req, res) => {
    try {
        if (String(req.params.id) === String(req.usuarioId)) {
            return res.status(400).json({ message: "No puedes cambiar tu propio rol" });
        }

        const nuevoRol = Number(req.body?.nuevoRol);
        if (![1, 2].includes(nuevoRol)) {
            return res.status(400).json({ message: "El rol debe ser Usuario o Administrador" });
        }

        const { data, error } = await supabase
            .from("usuario")
            .update({ id_rol: nuevoRol })
            .eq("id", req.params.id)
            .select("id, id_rol")
            .maybeSingle();

        if (error) {
            console.error("Error cambiando rol del usuario:", error);
            return res.status(500).json({ message: "Error al cambiar el rol" });
        }

        if (!data) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const nombreRol = nuevoRol === 1 ? "Usuario" : "Administrador";
        return res.json({ message: `Rol cambiado correctamente a ${nombreRol}`, ID_Rol: nuevoRol });
    } catch (error) {
        console.error("Error inesperado cambiando el rol del usuario:", error);
        return res.status(500).json({ message: "Error interno al cambiar el rol" });
    }
});

router.post("/olvido-contrasena", async (req, res) => {
    const correo = String(req.body.Correo || "").trim().toLowerCase();

    if (!correo) {
        return res.status(400).json({ message: "El correo es obligatorio" });
    }

    try {
        const { data: usuario, error: errorUsuario } = await supabase
            .from("usuario")
            .select("correo")
            .eq("correo", correo)
            .eq("estado", true)
            .maybeSingle();

        if (errorUsuario) {
            console.error("Error buscando usuario para recuperar contraseña:", errorUsuario);
            return res.status(500).json({ message: "Error al verificar el correo" });
        }

        if (!usuario) {
            return res.status(404).json({ message: "No existe una cuenta activa con este correo" });
        }

        const codigo = String(randomInt(100000, 1000000));
        const fechaExpiracion = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const { error: errorCodigo } = await supabase
            .from("verificaciones_email")
            .upsert(
                {
                    correo,
                    codigo,
                    fecha_expiracion: fechaExpiracion,
                    verificado: false,
                    intentos: 0,
                },
                { onConflict: "correo" }
            );

        if (errorCodigo) {
            console.error("Error guardando código de recuperación:", errorCodigo);
            return res.status(500).json({ message: "No se pudo generar el código" });
        }

        try {
            await enviarCodigoVerificacion(correo, codigo);
        } catch (errorCorreo) {
            console.error("Error enviando código de recuperación:", errorCorreo);
            return res.status(500).json({ message: "Error al enviar el correo" });
        }

        return res.json({ message: "Código enviado a tu correo" });
    } catch (error) {
        console.error("Error solicitando recuperación de contraseña:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/verificar-codigo", async (req, res) => {
    const correo = String(req.body.Correo || "").trim().toLowerCase();
    const codigo = String(req.body.Codigo || req.body.codigo || "").trim();

    if (!correo || !codigo) {
        return res.status(400).json({ message: "Correo y código son obligatorios" });
    }

    try {
        const { data: verificacion, error } = await supabase
            .from("verificaciones_email")
            .select("codigo, fecha_expiracion, intentos")
            .eq("correo", correo)
            .eq("verificado", false)
            .maybeSingle();

        if (error) {
            console.error("Error consultando código de recuperación:", error);
            return res.status(500).json({ message: "Error al verificar el código" });
        }

        if (!verificacion) {
            return res.status(404).json({ message: "No se encontró un código pendiente" });
        }

        if (Date.now() > new Date(verificacion.fecha_expiracion).getTime()) {
            return res.status(400).json({ message: "El código expiró. Solicita uno nuevo." });
        }

        if (verificacion.intentos >= 5) {
            return res.status(400).json({ message: "Demasiados intentos. Solicita un nuevo código." });
        }

        if (verificacion.codigo !== codigo) {
            const { error: errorIntentos } = await supabase
                .from("verificaciones_email")
                .update({ intentos: verificacion.intentos + 1 })
                .eq("correo", correo);

            if (errorIntentos) {
                console.error("Error actualizando intentos de recuperación:", errorIntentos);
                return res.status(500).json({ message: "Error al verificar el código" });
            }

            return res.status(400).json({ message: "Código incorrecto" });
        }

        const { error: errorVerificar } = await supabase
            .from("verificaciones_email")
            .update({ verificado: true })
            .eq("correo", correo);

        if (errorVerificar) {
            console.error("Error confirmando código de recuperación:", errorVerificar);
            return res.status(500).json({ message: "Error al verificar el código" });
        }

        return res.json({ message: "Código verificado" });
    } catch (error) {
        console.error("Error verificando código de recuperación:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/restablecer-contrasena", async (req, res) => {
    const correo = String(req.body.Correo || "").trim().toLowerCase();
    const codigo = String(req.body.Codigo || req.body.codigo || "").trim();
    const nuevaClave = String(req.body.nuevaClave || "");

    if (!correo || !codigo || !nuevaClave) {
        return res.status(400).json({ message: "Correo, código y contraseña son obligatorios" });
    }

    if (nuevaClave.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    try {
        const { data: verificacion, error: errorVerificacion } = await supabase
            .from("verificaciones_email")
            .select("codigo, fecha_expiracion")
            .eq("correo", correo)
            .eq("verificado", true)
            .maybeSingle();

        if (errorVerificacion) {
            console.error("Error consultando verificación de recuperación:", errorVerificacion);
            return res.status(500).json({ message: "Error al verificar el código" });
        }

        if (
            !verificacion ||
            verificacion.codigo !== codigo ||
            Date.now() > new Date(verificacion.fecha_expiracion).getTime()
        ) {
            return res.status(400).json({ message: "Código inválido o expirado" });
        }

        const { data: usuario, error: errorUsuario } = await supabase
            .from("usuario")
            .select("id, auth_user_id")
            .eq("correo", correo)
            .eq("estado", true)
            .maybeSingle();

        if (errorUsuario) {
            console.error("Error buscando usuario para restablecer contraseña:", errorUsuario);
            return res.status(500).json({ message: "Error al actualizar la contraseña" });
        }

        if (!usuario || !usuario.auth_user_id) {
            return res.status(404).json({ message: "No se encontró una cuenta activa asociada" });
        }

        const { data: codigoConsumido, error: errorConsumo } = await supabase
            .from("verificaciones_email")
            .update({ verificado: false })
            .eq("correo", correo)
            .eq("codigo", codigo)
            .eq("verificado", true)
            .gt("fecha_expiracion", new Date().toISOString())
            .select("correo")
            .maybeSingle();

        if (errorConsumo) {
            console.error("Error consumiendo código de recuperación:", errorConsumo);
            return res.status(500).json({ message: "No se pudo consumir el código" });
        }

        if (!codigoConsumido) {
            return res.status(400).json({ message: "Código inválido o expirado" });
        }

        const { error: errorAuth } = await supabase.auth.admin.updateUserById(
            usuario.auth_user_id,
            { password: nuevaClave }
        );

        if (errorAuth) {
            console.error("Error actualizando contraseña en Supabase Auth:", errorAuth);
            return res.status(500).json({ message: "No se pudo actualizar la contraseña" });
        }

        const passwordHash = await bcrypt.hash(nuevaClave, 10);
        const { error: errorPerfil } = await supabase
            .from("usuario")
            .update({ clave: passwordHash })
            .eq("id", usuario.id);

        if (errorPerfil) {
            console.error("Error actualizando contraseña del perfil:", errorPerfil);
            return res.status(500).json({
                message: "La contraseña fue cambiada, pero no se pudo actualizar el perfil",
            });
        }

        return res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error restableciendo contraseña:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});


module.exports = router;