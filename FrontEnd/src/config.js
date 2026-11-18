export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://buitr-n-coffee-backend.onrender.com";

const STORAGE_URL =
  "https://pzlytvmkpbhlmqskizgn.supabase.co/storage/v1/object/public/productos";

export const getImagen = (img) => {
  if (!img) return "/sin-imagen.png";

  // Si ya es una URL completa, utilizarla directamente
  if (img.startsWith("http")) return img;

  // Limpiar la ruta
  const nombreImagen = img
    .replace(/^\/+/, "")
    .replace(/^productos\//, "");

  // Codificar cada parte de la ruta sin eliminar las carpetas
  const rutaImagen = nombreImagen
    .split("/")
    .map((parte) => encodeURIComponent(parte))
    .join("/");

  return `${STORAGE_URL}/${rutaImagen}`;
};