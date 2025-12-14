<script>
  import { onMount } from "svelte";
  // Importamos funciones del servicio
  import {
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
  } from "../services/api";

  // Función para volver al login (viene de App.svelte)
  export let irALogin;
  // Función para ir al catálogo general
  export let irAGeneral;
  // Función opcional para volver al dashboard
  export let irADashboard = null;

  // Datos del usuario que se mostrarán en el perfil
  let usuario = {
    id: null,
    nombre: "", 
    correo: "",
    tipoUsuario: "",
  };

  let cargando = true;  // controla el mensaje "Cargando..."
  let error = "";       // mensaje de error
  let mensaje = "";     // mensaje de éxito

  // Función para volver al Catálogo General (o al Dashboard si es admin )
  function volverCatalogo() {
    console.log("Volviendo...");

    // Detectar usuario guardado
    const raw = localStorage.getItem("usuario");
    let u = null;
    try { u = raw ? JSON.parse(raw) : null; } catch { u = null; }

    // Si es admin función para regresar a dashboard
    if (u?.esAdmin && typeof irADashboard === "function") {
      irADashboard();
      return;
    }

    // Para todos los demás casos, regresar al catálogo general
    if (typeof irAGeneral === "function") {
      irAGeneral();
      return;
    }

    // Fallback si no hay funciones
    window.history.back();
  }


  // onMount se ejecuta cuando el componente se pinta por primera vez
  onMount(async () => {
    try {
      // Obtenemos información del usuario desde localStorage (guardado en login)
      const guardado = localStorage.getItem("usuario");

      // Si no hay usuario, mostramos error
      if (!guardado) {
        error = "No hay usuario en sesión.";
        cargando = false;
        return;
      }

      // Convertimos lo que estaba guardado a un objeto de JavaScript
      const datos = JSON.parse(guardado);
        // Aquí armamos el objeto usuario con lo que venga guardado
        // Si falta algo, ponemos un valor por default
        usuario = {
          id: datos.idUsuario || 1,                 // guardamos el id
          nombre: datos.nombre || "",               // guardamos el nombre
          correo: datos.correo || "",               // guardamos el correo
          tipoUsuario: datos.tipoUsuario || "general" // guardamos el tipo 
        };

      } catch (e) {
        // Si algo falla al leer o convertir los datos, lo mostramos en consola
        console.error(e);

        // Enseñamos un mensaje al usuario del error
        error = "No se pudieron leer los datos del usuario.";
      } finally {
        // Al final, haya salido bien o mal, quitamos el estado de cargando
        cargando = false;
      }
    });

  // Guarda los cambios del perfil
  async function guardarCambios(event) {
    event.preventDefault();
    mensaje = "";
    error = "";

    try {
      // Variable para guardar los nuevos datos que actualiza el usuario
      const actualizado = await actualizarUsuario(usuario.id, {
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipoUsuario: usuario.tipoUsuario,
      });

      // Guardamos lo que regresa la API en localStorage
      localStorage.setItem("usuario", JSON.stringify(actualizado));
      mensaje = "Cambios guardados correctamente.";
    } catch (e) {
      console.error(e);
      error = e.message || "No se pudieron guardar los cambios.";
    }
  }

  // Eliminar la cuenta del usuario
  async function eliminarCuenta() {
    const confirmar = confirm(
      "¿Seguro que deseas eliminar tu cuenta? Esta acción es permanente."
    );
    if (!confirmar) return;

    try {
      await eliminarUsuario(usuario.id);
      mensaje = "Cuenta eliminada. Regresando al login.";

      // Regresamos al login
      if (irALogin) irALogin();
    } catch (e) {
      console.error(e);
      error = e.message || "No se pudo eliminar la cuenta.";
    }
  }
</script>

<!-- Vista de la pantalla de perfil -->
<main class="app">
  <div class="container">
    <!-- Header del sitio con botón de volver -->
    <header class="header">
      <button class="back-btn" on:click={volverCatalogo}>
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al Catálogo
      </button>
      <div class="header-info">
        <h1 class="app-title">TECHFIT</h1>
        <p class="app-subtitle">Bienestar Digital</p>
      </div>
    </header>

    <!-- Panel del perfil -->
    <section class="card">
      <div class="profile-header">
        <div class="avatar">
          {usuario.nombre.charAt(0).toUpperCase()}
        </div>
        <div class="profile-info">
          <h1 class="title">Mi Perfil</h1>
          <p class="subtitle">Gestiona tu información personal</p>
        </div>
      </div>

      {#if cargando}
        <!-- Spinner de carga -->
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando datos...</p>
        </div>
        <!-- Muestra mensajes para posibles errores -->
      {:else}
        {#if error}
          <div class="alert error">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        {/if}

        {#if mensaje}
          <div class="alert success">
            <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {mensaje}
          </div>
        {/if}

        <!-- Formulario de edición de datos -->
        <form class="form" on:submit={guardarCambios}>
          <!-- CAmpo de nombre -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-text">Nombre</span>
              <input
                type="text"
                class="form-input"
                bind:value={usuario.nombre}
                placeholder="Tu nombre completo"
                required
              />
            </label>
          </div>

        <!-- Campo para ingresar elcorreo -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-text">Correo electrónico</span>
              <input
                type="email"
                class="form-input"
                bind:value={usuario.correo}
                placeholder="ejemplo@email.com"
                required
              />
            </label>
          </div>

          <!-- Campo para seleccionar el tipo de usuario -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-text">Tipo de usuario</span>
              <div class="select-wrapper">
                <select class="form-select" bind:value={usuario.tipoUsuario}>
                  <option value="general">General</option>
                  <option value="rehabilitacion">Rehabilitación</option>
                  <option value="adulto_mayor">Adulto mayor</option>
                </select>
                <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </label>
          </div>

          <!-- Boton para guardar cambios -->
          <div class="button-group">
            <button type="submit" class="primary-btn">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Guardar cambios
            </button>
          </div>
        </form>

        <div class="divider">
          <span>Zona de peligro</span>
        </div>

        <!-- Botón para eliminar la cuenta -->
        <div class="button-group">
          <button type="button" class="danger-btn" on:click={eliminarCuenta}>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar cuenta
          </button>
        </div>
      {/if}
    </section>

    <footer class="footer">
      <p>© 2024 TECHFIT. Todos los derechos reservados.</p>
      <p class="footer-links">
        <a href="#">Términos de servicio</a> • 
        <a href="#">Política de privacidad</a>
      </p>
    </footer>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #0e0e1a 0%, #1a1a2e 50%, #16213e 100%);
    color: #f5f5f5;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    padding: 2rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 100%;
    max-width: 480px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #b0b0c0;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: translateY(-1px);
  }

  .back-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .header-info {
    flex: 1;
    text-align: center;
  }

  .app-title {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1c99ff, #46e6b0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .app-subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    color: #8a8aa0;
  }

  .card {
    background: rgba(15, 15, 30, 0.7);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    margin-bottom: 2rem;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1c99ff, #46e6b0);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: #0e0e1a;
    box-shadow: 0 10px 20px rgba(28, 153, 255, 0.3);
  }

  .profile-info {
    flex: 1;
  }

  .title {
    margin: 0 0 0.25rem;
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff, #b0b0c0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    margin: 0;
    font-size: 0.95rem;
    color: #8a8aa0;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 0;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #1c99ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 12px;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }

  .success {
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #86efac;
  }

  .alert-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: #b0b0c0;
  }

  .form-input, .form-select {
    padding: 0.875rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    background: rgba(10, 10, 20, 0.6);
    color: #ffffff;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-input::placeholder {
    color: #6b6b80;
  }

  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #1c99ff;
    box-shadow: 0 0 0 3px rgba(28, 153, 255, 0.2);
    background: rgba(10, 10, 20, 0.8);
  }

  .select-wrapper {
    position: relative;
  }

  .form-select {
    appearance: none;
    width: 100%;
    cursor: pointer;
  }

  .select-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    pointer-events: none;
    color: #6b6b80;
  }

  .button-group {
    margin-top: 0.5rem;
  }

  .primary-btn, .danger-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem 1.5rem;
    border-radius: 14px;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .primary-btn {
    background: linear-gradient(135deg, #1c99ff, #46e6b0);
    color: #0e0e1a;
    box-shadow: 0 10px 20px rgba(28, 153, 255, 0.3);
  }

  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(28, 153, 255, 0.4);
  }

  .danger-btn {
    background: rgba(239, 68, 68, 0.1);
    border: 1.5px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }

  .danger-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
  }

  .btn-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 2.5rem 0;
    color: #8a8aa0;
    font-size: 0.9rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .divider span {
    padding: 0 1rem;
  }

  .footer {
    text-align: center;
    color: #6b6b80;
    font-size: 0.85rem;
    padding: 0 1rem;
  }

  .footer-links {
    margin: 0.5rem 0 0;
  }

  .footer-links a {
    color: #8a8aa0;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-links a:hover {
    color: #b0b0c0;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .app {
      padding: 1rem;
    }
    
    .card {
      padding: 1.5rem;
    }
    
    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .back-btn {
      align-self: flex-start;
    }
  }
</style>