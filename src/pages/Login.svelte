<script>
  import { login as loginApi } from "../services/api";
  import { guardarUsuario } from "../services/session";

  export let irARegistro;
  export let irAPerfil;
  export let irACatalogoGeneral;
  export let irACatalogoRehabilitacion;
  export let irACatalogoAdultoMayor;
  export let irAAdmin; // NUEVO

  let correo = "";
  let contrasena = "";
  let error = "";

  async function handleSubmit(e) {
    e.preventDefault();
    error = "";

    try {
      const usuario = await loginApi(correo, contrasena);

      // Guardamos la sesión completa (incluye tipoUsuario y esAdmin)
      guardarUsuario(usuario);

      // Si es admin, puedes mandarlo directo al panel admin (opcional)
      if (usuario.esAdmin && irAAdmin) {
        irAAdmin();
        return;
      }

      // Navegación automática según tipoUsuario REAL del backend
      if (usuario.tipoUsuario === "rehabilitacion") {
        irACatalogoRehabilitacion?.();
      } else if (usuario.tipoUsuario === "adulto_mayor") {
        irACatalogoAdultoMayor?.();
      } else {
        irACatalogoGeneral?.();
      }
    } catch (err) {
      error = err.message || "No se pudo iniciar sesión.";
    }
  }
</script>

<main class="app">
  <section class="card">
    <h1 class="title">TECHFIT</h1>
    <p class="subtitle">Inicia sesión</p>

    {#if error}<p class="error">{error}</p>{/if}

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
  /* Dejamos el mismo estilo bonito que ya tenías */

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
