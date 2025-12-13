/**
 * api.js
 * Funciones para consumir el backend (Railway).
 * - Maneja JSON
 * - Maneja errores del backend
 * - Agrega header X-USER-ID cuando se requiere (admin)
 */

const BASE_URL = "https://techfit-backend-production-d2e3.up.railway.app/api";

/** Lee el usuario guardado en localStorage */
function getSesion() {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Convierte links de YouTube a formato embed */
export function normalizarYoutubeUrl(url) {
  if (!url) return "";

  let u = String(url).trim();

  // youtu.be/ID -> https://www.youtube.com/embed/ID
  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

  // youtube.com/watch?v=ID -> embed
  const watch = u.match(/v=([a-zA-Z0-9_-]+)/);
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;

  // ya viene embed
  if (u.includes("/embed/")) return u;

  return u; // fallback (por si ya viene bien)
}

/** Manejo estándar de respuestas */
async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");
    const msg = body?.message || body?.error || body?.detail || body?.path || body || "Error en la solicitud";
    throw new Error(msg);
  }

  if (res.status === 204) return null; // No Content
  return isJson ? res.json() : res.text();
}

/**
 * GET /ejercicios?tipoUsuario=general
 * Regresa lista de ejercicios del tipo solicitado.
 */
export async function listarEjercicios(tipoUsuario) {
  const url = `${BASE_URL}/ejercicios?tipoUsuario=${encodeURIComponent(tipoUsuario)}`;
  const res = await fetch(url, { method: "GET" });
  const data = await handleResponse(res);

  // Aseguramos que videoUrl venga normalizado
  return (data || []).map((e) => ({
    ...e,
    // IMPORTANTE: el backend manda "videoUrl" (camelCase)
    videoUrl: normalizarYoutubeUrl(e.videoUrl || ""),
  }));
}

/**
 * POST /ejercicios  (SOLO ADMIN)
 * Requiere header X-USER-ID con el id del usuario logueado.
 */
export async function crearEjercicio(payload) {
  const sesion = getSesion();
  const userId = sesion?.id || sesion?.idUsuario; // por si tu login guarda uno u otro

  const res = await fetch(`${BASE_URL}/ejercicios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId ? String(userId) : "",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res);
  // Normalizar videoUrl al regresar
  if (data && typeof data === "object") {
    data.videoUrl = normalizarYoutubeUrl(data.videoUrl || "");
  }
  return data;
}
