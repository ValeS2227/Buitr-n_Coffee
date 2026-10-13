const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const { enviarCodigoVerificacion } = require("../utils/emailService");
const { verificarEmail, corregirEmail, generarCodigo } = require("../utils/emailValidator");

// =============================================
//  ENVIAR CÓDIGO DE VERIFICACIÓN
// =============================================
router.post("/enviar-codigo", async (req, res) => {
  const { Correo } = req.body;
  console.log("📧 Verificando email:", Correo);

  if (!Correo || !Correo.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "❌ Correo inválido. Ingresa un correo válido.",
    });
  }

  const emailCorregido = corregirEmail(Correo);
  const correccionAplicada = emailCorregido !== Correo;
  const verificacion = await verificarEmail(emailCorregido);
  console.log("📊 Resultado verificación:", verificacion);

  if (!verificacion.valido) {
    return res.status(400).json({
      success: false,
      message: verificacion.mensaje,
      correo_sugerido: verificacion.correo_sugerido || null,
    });
  }

  const { data: existente, error: errCheck } = await supabase
    .from("usuario")
    .select("id")
    .eq("correo", emailCorregido)
    .maybeSingle();

  if (errCheck) {
    console.error("❌ Error al verificar correo:", errCheck);
    return res.status(500).json({
      success: false,
      message: "Error al verificar correo",
    });
  }

  if (existente) {
    return res.status(400).json({
      success: false,
      message: "⚠️ El correo ya está registrado. Inicia sesión.",
    });
  }

  const codigo = generarCodigo();
  const fechaExpiracion = new Date();
  fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 10);

  const { error: errUpsert } = await supabase.from("verificaciones_email").upsert(
    {
      correo: emailCorregido,
      codigo,
      fecha_expiracion: fechaExpiracion.toISOString(),
      verificado: false,
      intentos: 0,
    },
    { onConflict: "correo" }
  );

  if (errUpsert) {
    console.error("❌ Error al guardar código:", errUpsert);
    return res.status(500).json({
      success: false,
      message: "Error al generar código de verificación",
    });
  }

  try {
    await enviarCodigoVerificacion(emailCorregido, codigo);
    console.log(`✅ Código enviado a ${emailCorregido}`);

    const respuesta = {
      success: true,
      message: "✅ Código de verificación enviado a tu correo",
      email: emailCorregido,
    };

    if (correccionAplicada) {
      respuesta.correo_original = Correo;
      respuesta.mensaje_correccion = `Tu correo fue corregido a "${emailCorregido}"`;
    }

    if (verificacion.advertencia) {
      respuesta.advertencia = "⚠️ No se pudo verificar completamente. Se permitirá el registro.";
    }

    res.status(200).json(respuesta);
  } catch (emailError) {
    console.error("❌ Error al enviar correo:", emailError);
    res.status(500).json({
      success: false,
      message: "Error al enviar el código de verificación",
    });
  }
});

// =============================================
//  VERIFICAR CÓDIGO — ✅ CORREGIDO CON CONFIRMACIÓN DE SUPABASE
// =============================================
router.post("/verificar-codigo", async (req, res) => {
  const { Correo, Codigo } = req.body;

  if (!Correo || !Codigo) {
    return res.status(400).json({
      success: false,
      message: "Correo y código son obligatorios",
    });
  }

  const emailCorregido = corregirEmail(Correo);

  // Buscar verificación en TU tabla
  const { data: verificacion, error } = await supabase
    .from("verificaciones_email")
    .select("*")
    .eq("correo", emailCorregido)
    .eq("verificado", false)
    .maybeSingle();

  if (error) {
    console.error("❌ Error al verificar código:", error);
    return res.status(500).json({
      success: false,
      message: "Error al verificar código",
    });
  }

  if (!verificacion) {
    return res.status(404).json({
      success: false,
      message: "No se encontró una verificación pendiente para este correo",
    });
  }

  // Verificar expiración
  if (new Date() > new Date(verificacion.fecha_expiracion)) {
    return res.status(400).json({
      success: false,
      message: "⚠️ El código ha expirado. Solicita uno nuevo.",
    });
  }

  // Verificar intentos
  if (verificacion.intentos >= 5) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Demasiados intentos fallidos. Solicita un nuevo código.",
    });
  }

  // Código incorrecto
  if (verificacion.codigo !== Codigo) {
    const nuevosIntentos = verificacion.intentos + 1;

    await supabase
      .from("verificaciones_email")
      .update({ intentos: nuevosIntentos })
      .eq("correo", emailCorregido);

    const intentosRestantes = 5 - nuevosIntentos;
    return res.status(400).json({
      success: false,
      message: `Código incorrecto. Te quedan ${intentosRestantes} intentos.`,
    });
  }

  // ✅ Marcar como verificado en TU tabla
  const { error: errVerificar } = await supabase
    .from("verificaciones_email")
    .update({ verificado: true })
    .eq("correo", emailCorregido);

  if (errVerificar) {
    console.error("❌ Error al marcar verificado:", errVerificar);
    return res.status(500).json({
      success: false,
      message: "Error al verificar código",
    });
  }

  // 🔥 CONFIRMAR TAMBIÉN EN SUPABASE para que deje iniciar sesión
  try {
    // Buscar el auth_user_id del usuario
    const { data: usuario } = await supabase
      .from("usuario")
      .select("auth_user_id")
      .eq("correo", emailCorregido)
      .maybeSingle();

    if (usuario?.auth_user_id) {
      // Usar admin API para confirmar el correo en Supabase
      await supabase.auth.admin.updateUserById(usuario.auth_user_id, {
        email_confirm: true,
      });
      console.log("✅ Correo confirmado en Supabase:", emailCorregido);
    }
  } catch (adminError) {
    console.warn("⚠️ No se pudo confirmar en Supabase (no impide continuar):", adminError.message);
  }

  res.json({
    success: true,
    message: "✅ Correo verificado correctamente. Ya puedes completar tu registro e iniciar sesión.",
  });
});

// =============================================
//  REENVIAR CÓDIGO
// =============================================
router.post("/reenviar-codigo", async (req, res) => {
  const { Correo } = req.body;

  if (!Correo || !Correo.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Correo inválido",
    });
  }

  const emailCorregido = corregirEmail(Correo);

  const { data: existente, error: errCheck } = await supabase
    .from("verificaciones_email")
    .select("id")
    .eq("correo", emailCorregido)
    .eq("verificado", false)
    .maybeSingle();

  if (errCheck) {
    console.error("❌ Error al verificar:", errCheck);
    return res.status(500).json({
      success: false,
      message: "Error al verificar",
    });
  }

  if (!existente) {
    return res.status(404).json({
      success: false,
      message: "No hay una verificación pendiente para este correo",
    });
  }

  const nuevoCodigo = generarCodigo();
  const fechaExpiracion = new Date();
  fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 10);

  const { error: errUpdate } = await supabase
    .from("verificaciones_email")
    .update({
      codigo: nuevoCodigo,
      fecha_expiracion: fechaExpiracion.toISOString(),
      intentos: 0,
    })
    .eq("correo", emailCorregido);

  if (errUpdate) {
    console.error("❌ Error al actualizar código:", errUpdate);
    return res.status(500).json({
      success: false,
      message: "Error al reenviar código",
    });
  }

  try {
    await enviarCodigoVerificacion(emailCorregido, nuevoCodigo);
    res.json({
      success: true,
      message: "✅ Nuevo código enviado a tu correo",
    });
  } catch (emailError) {
    console.error("❌ Error al enviar correo:", emailError);
    res.status(500).json({
      success: false,
      message: "Error al enviar el código",
    });
  }
});

module.exports = router;