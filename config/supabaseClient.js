const { createClient } = require("@supabase/supabase-js");

// Variables de entorno en tu archivo .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Faltan variables de entorno de Supabase");
}

// LOG TEMPORAL: debe imprimir "sb_secret_". Bórralo cuando termines.
console.log("Clave empieza con:", SUPABASE_SERVICE_ROLE_KEY.slice(0, 10));

// Cliente con permisos de administrador (service_role / secret key)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

module.exports = supabase;