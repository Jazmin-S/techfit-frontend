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

      const datos = JSON.parse(guardado);

      usuario = {
        id: datos.idUsuario || 1, // en mock usamos 1
        nombre: datos.nombre || "",
        correo: datos.correo || "",
        tipoUsuario: datos.tipoUsuario || "general",
      };

      // Más adelante podríamos refrescar desde la API real:
      // const desdeApi = await obtenerUsuario(usuario.id);
      // usuario = { ...usuario, ...desdeApi };
    } catch (e) {
      console.error(e);
      error = "No se pudieron leer los datos del usuario.";
    } finally {
      cargando = false;
    }
  });

  // Guarda los cambios del perfil (por ahora en mock/localStorage)
  async function guardarCambios(event) {
    event.preventDefault();
    mensaje = "";
    error = "";

    try {
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

  // Elimina la cuenta del usuario (simulado)
  async function eliminarCuenta() {
    const confirmar = confirm(
      "¿Seguro que deseas eliminar tu cuenta? Esta acción es permanente."
    );
    if (!confirmar) return;

    try {
      await eliminarUsuario(usuario.id);
      mensaje = "Cuenta eliminada (simulada). Regresando al login.";

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
  <section class="card">
    <h1 class="title">Perfil de usuario</h1>
    <p class="subtitle">Consulta y actualiza tus datos en TECHFIT</p>

    {#if cargando}
      <!-- Mientras lee datos mostramos "Cargando..." -->
      <p>Cargando datos...</p>
    {:else}
      {#if error}
        <p class="alert error">{error}</p>
      {/if}

      {#if mensaje}
        <p class="alert success">{mensaje}</p>
      {/if}

      <!-- Formulario de edición de datos -->
      <form class="form" on:submit={guardarCambios}>
        <label>
          Nombre
          <input
            type="text"
            bind:value={usuario.nombre}
            required
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            bind:value={usuario.correo}
            required
          />
        </label>

        <label>
          Tipo de usuario
          <select bind:value={usuario.tipoUsuario}>
            <option value="general">General</option>
            <option value="rehabilitacion">Rehabilitación</option>
            <option value="adulto_mayor">Adulto mayor</option>
          </select>
        </label>

        <button type="submit" class="primary-btn">
          Guardar cambios
        </button>
      </form>

      <!-- Botón para eliminar la cuenta -->
      <button type="button" class="danger-btn" on:click={eliminarCuenta}>
        Eliminar cuenta
      </button>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    background: radial-gradient(circle at top left, #1c99ff 0, #0e0e1a 45%, #000 100%);
    color: #f5f5f5;
  }

  .app {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .card {
    width: 100%;
    max-width: 460px;
    background: rgba(15, 15, 30, 0.9);
    border-radius: 18px;
    padding: 2.3rem 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .title {
    margin: 0 0 0.25rem;
    font-size: 1.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: center;
  }

  .subtitle {
    margin: 0 0 1.5rem;
    text-align: center;
    font-size: 0.95rem;
    color: #b0b0c0;
  }

  .alert {
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .error {
    background: rgba(255, 80, 80, 0.18);
    border: 1px solid rgba(255, 120, 120, 0.6);
    color: #ffdede;
  }

  .success {
    background: rgba(70, 230, 176, 0.18);
    border: 1px solid rgba(70, 230, 176, 0.7);
    color: #d8ffef;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin-bottom: 1.2rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.9rem;
  }

  input,
  select {
    padding: 0.6rem 0.7rem;
    border-radius: 8px;
    border: 1px solid #33364d;
    background: #0c0c18;
    color: #f5f5f5;
    font-size: 0.9rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #1c99ff;
    box-shadow: 0 0 0 1px rgba(28, 153, 255, 0.5);
  }

  .primary-btn {
    width: 100%;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    border: none;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, #1c99ff, #46e6b0);
    color: #05050a;
    margin-top: 0.2rem;
  }

  .primary-btn:hover {
    filter: brightness(1.05);
  }

  .danger-btn {
    width: 100%;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 120, 120, 0.7);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    background: rgba(255, 80, 80, 0.08);
    color: #ffb7b7;
  }

  .danger-btn:hover {
    background: rgba(255, 80, 80, 0.18);
  }
</style>
