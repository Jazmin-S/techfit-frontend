// src/services/session.js
// Manejo centralizado de sesión en localStorage.

// Clave única para identificar los datos del usuario en localStorage
const KEY = "usuario";

/**
 * Guarda los datos del usuario en el almacenamiento local del navegador.
 * Esto permite que el usuario mantenga su sesión activa al cerrar y volver a abrir la aplicación.
 */
export function guardarUsuario(usuario) {
  localStorage.setItem(KEY, JSON.stringify(usuario));
}
/*
* Obtiene los datos del usuario actual desde el almacenamiento local
* Si no hay datos o hay un error al leerlos, devuelve null.
*/
export function obtenerUsuario() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
/*
* Cierra la sesión del usuario eliminando sus datos del almacenamiento local
* Esto se usa cuando el usuario hace logout o cuando se detecta que la sesión ha expirado.
*/
export function cerrarSesion() {
  localStorage.removeItem(KEY);
}

/*
* Verifica si el usuario tiene permisos de administrador
* Revisa varias propiedades comunes que podrían indicar el rol de administrador
*/
export function esAdmin(usuario) {
  return !!usuario?.esAdmin;
}
