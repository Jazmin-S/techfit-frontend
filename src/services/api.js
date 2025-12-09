// src/services/api.js
// Capa de comunicación con el backend (por ahora simulada con MOCK).

// URL base del backend.
// En local será: http://localhost:8080/api
// En producción será algo como: https://tu-backend.onrender.com/api
const API_BASE = "http://localhost:8080/api";

// Bandera para usar datos simulados mientras no existe backend real.
// Cuando tengas tu backend Spring listo, cambia a false.
const USE_MOCK_API = true;

/**
 * Función auxiliar para manejar respuestas HTTP del backend.
 * Si la respuesta no es OK (status 200–299) lanza un error con el texto.
 */
async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error en la petición al servidor");
  }
  return res.json();
}

/**
 * LOGIN
 * Envía correo y contraseña al backend y devuelve el usuario.
 */
export async function login(correo, contrasena) {
  if (USE_MOCK_API) {
    // Simulación de respuesta del backend
    console.log("[MOCK] login", correo, contrasena);
    return {
      id: 1,
      nombre: "Usuario TECHFIT (mock)",
      correo,
      tipoUsuario: "general",
    };
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
  });

  return handleResponse(res);
}

/**
 * REGISTRO
 * Crea un nuevo usuario en el backend.
 * datos = { nombre, correo, contrasena, tipoUsuario }
 */
export async function registrarUsuario(datos) {
  if (USE_MOCK_API) {
    console.log("[MOCK] registrarUsuario", datos);
    // Simulamos que el backend responde con el usuario creado
    return {
      id: Math.floor(Math.random() * 1000) + 2,
      ...datos,
    };
  }

  const res = await fetch(`${API_BASE}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  return handleResponse(res);
}

/**
 * OBTENER USUARIO POR ID
 */
export async function obtenerUsuario(id) {
  if (USE_MOCK_API) {
    console.log("[MOCK] obtenerUsuario", id);
    // Leemos desde localStorage como simulación
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  }

  const res = await fetch(`${API_BASE}/usuarios/${id}`);
  return handleResponse(res);
}

/**
 * ACTUALIZAR USUARIO
 */
export async function actualizarUsuario(id, datos) {
  if (USE_MOCK_API) {
    console.log("[MOCK] actualizarUsuario", id, datos);
    // Solo actualizamos localStorage en modo mock
    localStorage.setItem("usuario", JSON.stringify({ id, ...datos }));
    return { id, ...datos };
  }

  const res = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  return handleResponse(res);
}

/**
 * ELIMINAR USUARIO
 */
export async function eliminarUsuario(id) {
  if (USE_MOCK_API) {
    console.log("[MOCK] eliminarUsuario", id);
    // En simulación solo borramos localStorage
    localStorage.removeItem("usuario");
    return;
  }

  const res = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al eliminar usuario");
  }
}
