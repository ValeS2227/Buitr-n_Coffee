const express = require("express");
const router = express.Router();

const supabase = require("../config/supabaseClient");
const supabaseAuth = require("../config/supabaseAuthClient");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secreto123";

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
        // 2. Crear cuenta en SUPABASE AUTH
        // --------------------------------------------------

        const {
            data: authData,
            error: authError,
        } = await supabaseAuth.auth.signUp({
            email: correo,
            password: Clave,
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
        // 3. Crear perfil en tabla usuario
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
        // 4. Si falla el perfil, borrar Auth
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
        // 5. Respuesta
        // --------------------------------------------------

        return res.status(201).json({
            message:
                "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
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

        const token = jwt.sign(
            {
                id: user.id,
                rol: user.id_rol,
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
                ID_Rol: user.id_rol,
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


module.exports = router;