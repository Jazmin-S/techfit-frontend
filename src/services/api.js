/**
 * src/services/api.js
 * 
 * Servicio de comunicación con el backend de TECHFIT.
 * Contiene todas las funciones para interactuar con la API REST.
 * 
 * Backend desplegado en: https://techfit-backend.onrender.com
 */

const BASE_URL = "https://techfit-backend.onrender.com";


// MANEJO DE SESIÓN (LocalStorage)

//Guarda los datos del usuario en el almacenamiento local del navegador
function setSesion(data) {
  try {
    localStorage.setItem("usuario", JSON.stringify(data));
  } catch {}
}

// Obtiene los datos del usuario desde el almacenamiento local.
function getSesion() {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Cierra la sesión eliminando los datos del usuario
export function cerrarSesion() {
  try {
    localStorage.removeItem("usuario");
  } catch {}
}

// FUNCIONES UTILITARIA

//  Convierte cualquier URL de YouTube a formato embed (para iframes)
export function normalizarYoutubeUrl(url) {
  if (!url) return "";

  const u = String(url).trim();

  // Detectar formato youtu.be/
  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

  // Detectar formato youtube.com/watch?v=
  const watch = u.match(/v=([a-zA-Z0-9_-]+)/);
  if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;

  // Si ya está en formato embed, dejarla igual
  if (u.includes("/embed/")) return u;

  return u;
}

// Procesa la respuesta de fetch (maneja errores y formato JSON/texto).
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

//  AUTENTICACIÓN Y USUARIOS

// Inicia sesión con correo y contraseña
export async function login(correo, contrasena) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  });

  const data = await handleResponse(res);
  setSesion(data); // Guarda automáticamente la sesión
  return data;
}

// Registra un nuevo usuario.
export async function registrarUsuario({ nombre, correo, contrasena, tipoUsuario }) {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      correo,
      contrasena,
      tipoUsuario: tipoUsuario ?? "general", // default por si no se manda
    }),
  });

  const data = await handleResponse(res);
  setSesion(data); // Inicia sesión automáticamente tras registro
  return data;
}

// Elimina un usuario por su ID.
export async function eliminarUsuario(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "DELETE",
  });

  const data = await handleResponse(res);

 // Si se eliminó al usuario actual, cerrar sesión
  const sesion = getSesion();
  if (sesion?.id === id) cerrarSesion();

  return data;
}

// Obtiene información de un usuario por su ID.
export async function obtenerUsuario(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "GET",
  });

  return handleResponse(res);
}



// Actualiza información de un usuario 
export async function actualizarUsuario(id, { nombre, tipoUsuario, contrasena }) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      tipoUsuario,
      contrasena, // Se ignora si está vacío 
    }),
  });

  

  const data = await handleResponse(res);

  // Actualiza la sesión si se editó al usuario actual
  const sesion = getSesion();
  if (sesion?.id === id) setSesion(data);

  return data;
}

//   EJERCICIOS

// Obtiene la lista de ejercicios según el tipo de usuario
export async function listarEjercicios(tipoUsuario) {
  // Armamos la URL con el tipo de usuario para que el backend nos filtre
  const url = `${BASE_URL}/ejercicios?tipoUsuario=${encodeURIComponent(tipoUsuario)}`;

  // Hacemos la petición al backend para traer la lista
  const res = await fetch(url, { method: "GET" });

  // Leemos la respuesta
  const data = await handleResponse(res);

  // Regresamos una lista 
  return (data || []).map((e) => ({
    ...e, 
    videoUrl: normalizarYoutubeUrl(e.videoUrl || ""), // dejamos el link listo para usarse
  }));
}

// Crea un nuevo ejercicio (solo administradores)
export async function crearEjercicio(payload) {
  // Obtenemos la sesión que tengamos guardada
  const sesion = getSesion();

  // Agarramos el id del usuario
  const userId = sesion?.id || sesion?.idUsuario;

  // Hacemos la petición al backend para guardar el ejercicio
  const res = await fetch(`${BASE_URL}/ejercicios`, {
    method: "POST",
    headers: {
      // Le decimos que mandamos JSON
      "Content-Type": "application/json",

      // Mandamos el id del usuario para que el backend sepa quién está intentando crear
      "X-USER-ID": userId ? String(userId) : "",
    },

    // Convertimos el payload a texto JSON para enviarlo
    body: JSON.stringify(payload),
  });

  // Aquí procesamos la respuesta
  const data = await handleResponse(res);

  // Si la respuesta trae un objeto, arreglamos el videoUrl por si viene raro
  if (data && typeof data === "object") {
    data.videoUrl = normalizarYoutubeUrl(data.videoUrl || "");
  }

  // Regresamos lo que respondió el backend (el ejercicio creado)
  return data;
}