<script>
  import { login as loginApi } from "../services/api";
  import { guardarUsuario } from "../services/session";

  //exporta funciones de navegacion
  export let irARegistro; // Para ir a la pantalla de registro
  export let irAPerfil; // Para ir al perfil del usuario
  export let irACatalogoGeneral; // Para ir al catálogo general
  export let irACatalogoRehabilitacion; // Para ir al catálogo de rehabilitación
  export let irACatalogoAdultoMayor;  // Para ir al catálogo de adultos mayores
  export let irAAdmin; // Para ir al panel de administración 

  let correo = ""; // Correo electrónico ingresado por el usuario
  let contrasena = ""; // Contraseña ingresada por el usuario
  let error = ""; // Mensaje de error si el login falla

  // Maneja el envío del formulario de login
  async function handleSubmit(e) {
    e.preventDefault(); // Evita que la página se recargue
    error = ""; //limpia errores anteriores 

    try {
      // Intenta iniciar sesión con las credenciales
      const usuario = await loginApi(correo, contrasena);

      // Guarda la información del usuario en el almacenamiento local
      guardarUsuario(usuario);

      // Si el usuario es administrador, lo redirige al panel de admin
      if (usuario.esAdmin && irAAdmin) {
        irAAdmin();
        return;
      }

       // Redirige automáticamente según el tipo de usuario
      if (usuario.tipoUsuario === "rehabilitacion") {
        irACatalogoRehabilitacion?.(); 
      } else if (usuario.tipoUsuario === "adulto_mayor") {
        irACatalogoAdultoMayor?.();
      } else {
        irACatalogoGeneral?.();
      }
    } catch (err) {
       // Muestra un mensaje de error si el login falla
      error = err.message || "No se pudo iniciar sesión.";
    }
  }
</script>

<main class="app">
  <section class="card">
    <h1 class="title">TECHFIT</h1>
    <p class="subtitle">Inicia sesión</p>

     <!-- Muestra mensaje de error si existe -->
    {#if error}<p class="error">{error}</p>{/if}

     <!-- Formulario de inicio de sesión -->
    <form class="form" on:submit={handleSubmit}>
      <label>
        Correo
        <input type="email" bind:value={correo} required />
      </label>

      <label>
        Contraseña
        <input type="password" bind:value={contrasena} required minlength="3" />
      </label>

      <button class="primary-btn" type="submit">Entrar</button>
    </form>

    <button class="secondary-btn" type="button" on:click={() => irARegistro?.()}>
      Crear cuenta
    </button>
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
    max-width: 420px;
    background: rgba(15, 15, 30, 0.9);
    border-radius: 18px;
    padding: 2.5rem 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .title {
    margin: 0 0 0.25rem;
    font-size: 2rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
  }

  .subtitle {
    margin: 0 0 1.5rem;
    text-align: center;
    font-size: 0.95rem;
    color: #b0b0c0;
  }

  .error {
    background: rgba(255, 80, 80, 0.18);
    border: 1px solid rgba(255, 120, 120, 0.6);
    color: #ffdede;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
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

  .primary-btn,
  .secondary-btn {
    width: 100%;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    border: none;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
  }

  .primary-btn {
    background: linear-gradient(135deg, #1c99ff, #46e6b0);
    color: #05050a;
    margin-top: 0.2rem;
  }

  .primary-btn:hover {
    filter: brightness(1.05);
  }

  .secondary-btn {
    background: transparent;
    color: #d0d0e0;
    border: 1px solid rgba(255, 255, 255, 0.18);
    margin-top: 0.4rem;
  }

  .secondary-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }
</style>
