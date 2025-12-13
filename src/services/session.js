// src/services/session.js
// Manejo centralizado de sesión en localStorage.

const KEY = "usuario";

export function guardarUsuario(usuario) {
  localStorage.setItem(KEY, JSON.stringify(usuario));
}

export function obtenerUsuario() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function cerrarSesion() {
  localStorage.removeItem(KEY);
}

export function esAdmin(usuario) {
  return !!usuario?.esAdmin;
}
