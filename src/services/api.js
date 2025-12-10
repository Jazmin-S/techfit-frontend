// src/services/api.js
// Capa de comunicación con el backend (por ahora simulada con MOCK).

// URL base del backend.
// En local será: http://localhost:8080/api
// En producción será algo como: https://tu-backend.onrender.com/api
const API_BASE = "http://localhost:8080/api";

// Bandera para usar datos simulados mientras no existe backend real.
// Cuando tengas tu backend Spring listo, cambia a false.
// Ya está en false porque pos ya hay backend
const USE_MOCK_API = false;

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
    // simulación
    const stored = localStorage.getItem("usuario");
    if (!stored) throw new Error("No hay usuario registrado");
    const u = JSON.parse(stored);
    if (u.correo === correo && u.contrasena === contrasena) {
      return u;
    }
    throw new Error("Correo o contraseña incorrectos");
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al iniciar sesión");
  }

  const usuario = await res.json();
  localStorage.setItem("usuario", JSON.stringify(usuario));
  return usuario;
}


/**
 * REGISTRO
 * Crea un nuevo usuario en el backend.
 * datos = { nombre, correo, contrasena, tipoUsuario }
 */
export async function registrarUsuario({ nombre, correo, contrasena, tipoUsuario }) {
  if (USE_MOCK_API) {
    // Estas lines son simulacion (para probar el backend chavos)
    const usuario = { idUsuario: 1, nombre, correo, contrasena, tipoUsuario };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    return usuario;
  }

  // MODO REAL: hablar con el backend
  const res = await fetch(`${API_BASE}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      correo,
      contrasena,
      tipoUsuario,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al registrar usuario");
  }

  const usuarioCreado = await res.json();
  //Guardar en localStorage:
  localStorage.setItem("usuario", JSON.stringify(usuarioCreado));
  return usuarioCreado;
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
    // MODO MOCK (si algún día lo vuelves a usar)
    const guardado = localStorage.getItem("usuario");
    const u = guardado ? JSON.parse(guardado) : {};
    const actualizado = { ...u, ...datos };
    localStorage.setItem("usuario", JSON.stringify(actualizado));
    return actualizado;
  }

  const res = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    const text = await res.text();
    // esto es lo que estás viendo en rojo
    throw new Error(text || "Error al actualizar usuario");
  }

  const usuarioActualizado = await res.json();
  return usuarioActualizado;
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
