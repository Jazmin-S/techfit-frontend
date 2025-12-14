/**
 * src/services/api.js
 * Backend en Render
 * Nota: si tu backend tiene context-path=/api, BASE_URL debe incluir /api
 */

const BASE_URL = "https://techfit-backend.onrender.com";


/* =========================
   SESIÓN
========================= */
function setSesion(data) {
  try {
    localStorage.setItem("usuario", JSON.stringify(data));
  } catch {}
}

function getSesion() {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem("usuario");
  } catch {}
}

/* =========================
   UTILS
========================= */
export function normalizarYoutubeUrl(url) {
  if (!url) return "";

  const u = String(url).trim();

  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

  const watch = u.match(/v=([a-zA-Z0-9_-]+)/);
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;

  if (u.includes("/embed/")) return u;

  return u;
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const body = isJson
      ? await res.json().catch(() => ({}))
      : await res.text().catch(() => "");

    const msg =
      body?.message ||
      body?.error ||
      body?.detail ||
      (typeof body === "string" ? body : "") ||
      "Error en la solicitud";

    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return isJson ? res.json() : res.text();
}

/* =========================
   AUTH / USUARIOS (según tu UsuarioController)
========================= */

/**
 * POST /auth/login
 * Tu backend espera: { correo, contrasena }
 */
export async function login(correo, contrasena) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  });

  const data = await handleResponse(res);
  setSesion(data);
  return data;
}

/**
 * POST /usuarios
 * Registro / crear usuario
 * Ajusta campos si tu entidad Usuario tiene nombres distintos.
 */
export async function registrarUsuario({ nombre, correo, contrasena, tipoUsuario }) {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      correo,
      contrasena,
      tipoUsuario: tipoUsuario ?? "general", // default por si no lo mandas
    }),
  });

  const data = await handleResponse(res);
  setSesion(data); // si no quieres autologin, borra esta línea
  return data;
}

/**
 * DELETE /usuarios/{id}
 * Elimina un usuario por id
 */
export async function eliminarUsuario(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "DELETE",
  });

  const data = await handleResponse(res);

  // Si borraste al usuario logueado, cerramos sesión
  const sesion = getSesion();
  if (sesion?.id === id) cerrarSesion();

  return data;
}

/**
 * GET /usuarios/{id}
 * Obtiene un usuario por id
 */
export async function obtenerUsuario(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "GET",
  });

  return handleResponse(res);
}



/**
 * PUT /usuarios/{id}
 * Tu controller actualiza: nombre, tipoUsuario y (si viene) contrasena
 */
export async function actualizarUsuario(id, { nombre, tipoUsuario, contrasena }) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      tipoUsuario,
      contrasena, // si viene vacío, el backend lo ignora (según tu controller)
    }),
  });

  

  const data = await handleResponse(res);

  // refrescar sesión si estás editando tu propio usuario
  const sesion = getSesion();
  if (sesion?.id === id) setSesion(data);

  return data;
}

/* =========================
   EJERCICIOS
========================= */

export async function listarEjercicios(tipoUsuario) {
  const url = `${BASE_URL}/ejercicios?tipoUsuario=${encodeURIComponent(tipoUsuario)}`;
  const res = await fetch(url, { method: "GET" });
  const data = await handleResponse(res);

  return (data || []).map((e) => ({
    ...e,
    videoUrl: normalizarYoutubeUrl(e.videoUrl || ""),
  }));
}

export async function crearEjercicio(payload) {
  const sesion = getSesion();
  const userId = sesion?.id || sesion?.idUsuario;

  const res = await fetch(`${BASE_URL}/ejercicios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": userId ? String(userId) : "",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res);

  if (data && typeof data === "object") {
    data.videoUrl = normalizarYoutubeUrl(data.videoUrl || "");
  }
  return data;
}
