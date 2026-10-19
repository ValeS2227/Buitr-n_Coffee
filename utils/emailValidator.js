const axios = require('axios');

// =============================================
// CONFIGURACIÓN
// =============================================
const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY || '';
const API_URL = 'https://emailvalidation.abstractapi.com/v1/';

// =============================================
// LISTA DE DOMINIOS VÁLIDOS CONOCIDOS
// =============================================
const DOMINIOS_VALIDOS = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com',
    'proton.me',
    'mail.com',
    'yandex.com',
    'aol.com',
    'zoho.com',
    'gmx.com',
    'gmx.es',
    'gmx.net',
    'tutanota.com',
    'tutanota.de',
    'keemail.me',
    'fastmail.com',
    'hushmail.com',
    'safe-mail.net',
    'inbox.com'
];

const DOMINIOS_TEMPORALES = [
    'mailinator.com',
    'guerrillamail.com',
    'tempmail.com',
    '10minutemail.com',
    'throwaway.email',
    'temp-mail.org',
    'maildrop.cc',
    'guerrillamail.org',
    'getnada.com',
    'mytemp.email',
    'trashmail.com',
    'spamgourmet.com',
    'yopmail.com',
    'mailnesia.com',
    'fakeinbox.com',
    'discard.email',
    'sogetthis.com',
    'spambox.us',
    'mailexpire.com',
    'tempinbox.com'
];

// =============================================
// FUNCIÓN PARA VERIFICAR DOMINIO
// =============================================
const verificarDominio = async (dominio) => {
    // 🔥 Verificar si el dominio está en la lista de temporales
    if (DOMINIOS_TEMPORALES.includes(dominio.toLowerCase())) {
        return {
            valido: false,
            razon: 'Correo temporal',
            mensaje: '❌ No se permiten correos temporales o desechables'
        };
    }

    // 🔥 Verificar si el dominio está en la lista de válidos
    if (DOMINIOS_VALIDOS.includes(dominio.toLowerCase())) {
        return {
            valido: true,
            razon: 'Dominio válido conocido',
            mensaje: '✅ Dominio verificado'
        };
    }

    // 🔥 Si no está en la lista, verificar con API externa
    if (!ABSTRACT_API_KEY) {
        return {
            valido: false,
            razon: 'Dominio no reconocido',
            mensaje: `❌ El dominio "${dominio}" no está en la lista de dominios válidos. Usa un correo de Gmail, Hotmail, Outlook, etc.`
        };
    }

    try {
        const response = await axios.get(API_URL, {
            params: {
                api_key: ABSTRACT_API_KEY,
                email: `test@${dominio}`
            }
        });

        const data = response.data;

        if (data.is_mx_found?.value === true) {
            return {
                valido: true,
                razon: 'Dominio verificado por API',
                mensaje: ' Dominio verificado'
            };
        } else {
            return {
                valido: false,
                razon: 'Dominio sin servidor MX',
                mensaje: `❌ El dominio "${dominio}" no existe o no tiene servidor de correo`
            };
        }
    } catch (error) {
        console.error('❌ Error al verificar dominio:', error.message);
        return {
            valido: false,
            razon: 'Error de verificación',
            mensaje: `❌ No se pudo verificar el dominio "${dominio}"`
        };
    }
};

// =============================================
// FUNCIÓN PRINCIPAL PARA VERIFICAR EMAIL
// =============================================
const verificarEmail = async (email) => {

    if (!email || !email.includes('@')) {
        return {
            valido: false,
            razon: 'Formato inválido',
            mensaje: ' El correo ingresado no tiene un formato válido',
            correo_sugerido: null
        };
    }

    const erroresComunes = [
        { patron: /gnail\.com$/i, correccion: 'gmail.com', mensaje: '❌ ¿Quisiste decir @gmail.com?' },
        { patron: /hotmail\.con$/i, correccion: 'hotmail.com', mensaje: '❌ ¿Quisiste decir @hotmail.com?' },
        { patron: /outlook\.con$/i, correccion: 'outlook.com', mensaje: '❌ ¿Quisiste decir @outlook.com?' },
        { patron: /yahoo\.con$/i, correccion: 'yahoo.com', mensaje: '❌ ¿Quisiste decir @yahoo.com?' },
        { patron: /gmial\.com$/i, correccion: 'gmail.com', mensaje: '❌ ¿Quisiste decir @gmail.com?' },
        { patron: /gmai\.com$/i, correccion: 'gmail.com', mensaje: '❌ ¿Quisiste decir @gmail.com?' },
        { patron: /hotmai\.com$/i, correccion: 'hotmail.com', mensaje: '❌ ¿Quisiste decir @hotmail.com?' },
        { patron: /outloook\.com$/i, correccion: 'outlook.com', mensaje: '❌ ¿Quisiste decir @outlook.com?' },
        { patron: /yahooo\.com$/i, correccion: 'yahoo.com', mensaje: '❌ ¿Quisiste decir @yahoo.com?' },
        { patron: /gnail\.con$/i, correccion: 'gmail.com', mensaje: '❌ ¿Quisiste decir @gmail.com?' },
        { patron: /gmail\.con$/i, correccion: 'gmail.com', mensaje: '❌ ¿Quisiste decir @gmail.com?' },
        { patron: /hotmail\.co$/i, correccion: 'hotmail.com', mensaje: '❌ ¿Quisiste decir @hotmail.com?' },
        { patron: /outlook\.co$/i, correccion: 'outlook.com', mensaje: '❌ ¿Quisiste decir @outlook.com?' },
    ];

    for (const error of erroresComunes) {
        if (error.patron.test(email)) {
            const emailCorregido = email.replace(error.patron, error.correccion);
            return {
                valido: false,
                razon: 'Error de tipeo',
                mensaje: error.mensaje,
                correo_sugerido: emailCorregido
            };
        }
    }

    const dominio = email.split('@')[1].toLowerCase();

    if (DOMINIOS_TEMPORALES.includes(dominio)) {
        return {
            valido: false,
            razon: 'Correo temporal',
            mensaje: ' No se permiten correos temporales o desechables',
            correo_sugerido: null
        };
    }

    const resultadoDominio = await verificarDominio(dominio);

    if (!resultadoDominio.valido) {
        return {
            valido: false,
            razon: resultadoDominio.razon,
            mensaje: resultadoDominio.mensaje,
            correo_sugerido: null
        };
    }

    if (ABSTRACT_API_KEY) {
        try {
            const response = await axios.get(API_URL, {
                params: {
                    api_key: ABSTRACT_API_KEY,
                    email: email
                }
            });

            const data = response.data;

            if (data.deliverability === 'UNDELIVERABLE') {
                return {
                    valido: false,
                    razon: 'No entregable',
                    mensaje: ' El correo no es entregable (no existe o está inactivo)',
                    correo_sugerido: null
                };
            }

            if (data.deliverability === 'RISKY') {
                return {
                    valido: false,
                    razon: 'Correo riesgoso',
                    mensaje: ' El correo parece ser falso o temporal. Por favor, usa un correo real.',
                    correo_sugerido: null
                };
            }

            if (data.is_valid_format?.value === false) {
                return {
                    valido: false,
                    razon: 'Formato inválido',
                    mensaje: ' El formato del correo no es válido',
                    correo_sugerido: null
                };
            }

            if (data.is_mx_found?.value === false) {
                return {
                    valido: false,
                    razon: 'Dominio sin MX',
                    mensaje: ` El dominio "${dominio}" no existe o no tiene servidor de correo`,
                    correo_sugerido: null
                };
            }

            return {
                valido: true,
                razon: 'Correo válido',
                mensaje: ' Correo verificado correctamente',
                correo_sugerido: null,
                detalles: {
                    formato: data.is_valid_format?.value,
                    dominio: data.is_mx_found?.value,
                    entregable: data.deliverability,
                    proveedor: data.mailbox_verification || 'No verificado'
                }
            };

        } catch (error) {
            console.error(' Error al verificar email con API:', error.message);
            // Si la API falla, permitir el registro pero con advertencia
            return {
                valido: true,
                razon: 'Verificación fallida',
                mensaje: ' No se pudo verificar el correo. Se permitirá el registro.',
                correo_sugerido: null,
                advertencia: true
            };
        }
    }

    // Si no hay API Key, permitir solo si el dominio está en la lista de válidos
    if (DOMINIOS_VALIDOS.includes(dominio)) {
        return {
            valido: true,
            razon: 'Dominio válido conocido',
            mensaje: ' Correo verificado (dominio conocido)',
            correo_sugerido: null
        };
    }

    return {
        valido: false,
        razon: 'Dominio no reconocido',
        mensaje: `❌ El dominio "${dominio}" no está en la lista de dominios válidos. Usa un correo de Gmail, Hotmail, Outlook, etc.`,
        correo_sugerido: null
    };
};

// =============================================
// FUNCIÓN PARA CORREGIR ERRORES COMUNES
// =============================================
const corregirEmail = (email) => {
    if (!email) return email;

    const correcciones = [
        { buscar: /gnail\.com$/i, reemplazar: 'gmail.com' },
        { buscar: /gmial\.com$/i, reemplazar: 'gmail.com' },
        { buscar: /gmai\.com$/i, reemplazar: 'gmail.com' },
        { buscar: /hotmail\.con$/i, reemplazar: 'hotmail.com' },
        { buscar: /hotmai\.com$/i, reemplazar: 'hotmail.com' },
        { buscar: /outlook\.con$/i, reemplazar: 'outlook.com' },
        { buscar: /outloook\.com$/i, reemplazar: 'outlook.com' },
        { buscar: /yahoo\.con$/i, reemplazar: 'yahoo.com' },
        { buscar: /yahooo\.com$/i, reemplazar: 'yahoo.com' },
        { buscar: /gnail\.con$/i, reemplazar: 'gmail.com' },
        { buscar: /gmail\.con$/i, reemplazar: 'gmail.com' },
        { buscar: /hotmail\.co$/i, reemplazar: 'hotmail.com' },
        { buscar: /outlook\.co$/i, reemplazar: 'outlook.com' },
    ];

    let emailCorregido = email;
    for (const correccion of correcciones) {
        emailCorregido = emailCorregido.replace(correccion.buscar, correccion.reemplazar);
    }

    return emailCorregido;
};

// =============================================
// GENERAR CÓDIGO DE 6 DÍGITOS
// =============================================
const generarCodigo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    verificarEmail,
    corregirEmail,
    generarCodigo
};