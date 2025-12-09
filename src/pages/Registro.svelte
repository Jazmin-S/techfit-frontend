<script>
  import { registrarUsuario } from "../services/api";

  export let irALogin;

  let nombre = "";
  let correo = "";
  let contrasena = "";
  let confirmarContrasena = "";
  let tipoUsuario = "general";

  let error = "";
  let exito = "";

  async function handleSubmit(event) {
    event.preventDefault();
    error = "";
    exito = "";

    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      error = "Todos los campos son obligatorios.";
      return;
    }

    if (contrasena.length < 8) {
      error = "La contraseña debe tener al menos 8 caracteres.";
      return;
    }

    if (contrasena !== confirmarContrasena) {
      error = "Las contraseñas no coinciden.";
      return;
    }

    try {
      const nuevoUsuario = await registrarUsuario({
        nombre,
        correo,
        contrasena,
        tipoUsuario,
      });

      console.log("Usuario registrado:", nuevoUsuario);

      exito = "Registro exitoso (simulado). Ahora puedes iniciar sesión.";
    } catch (e) {
      console.error(e);
      error = e.message || "No se pudo registrar el usuario.";
    }
  }

  function handleIrALogin() {
    if (irALogin) irALogin();
  }
</script>

<main class="app">
  <section class="card">
    <h1 class="title">Crear cuenta TECHFIT</h1>
    <p class="subtitle">Registra tus datos para continuar</p>

    {#if error}
      <p class="alert error">{error}</p>
    {/if}

    {#if exito}
      <p class="alert success">{exito}</p>
    {/if}

    <form class="form" on:submit={handleSubmit}>
      <label>
        Nombre completo
        <input
          type="text"
          bind:value={nombre}
          placeholder="Tu nombre"
          required
        />
      </label>

      <label>
        Correo electrónico
        <input
          type="email"
          bind:value={correo}
          placeholder="tu@correo.com"
          required
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          bind:value={contrasena}
          placeholder="••••••••"
          minlength="8"
          required
        />
      </label>

      <label>
        Confirmar contraseña
        <input
          type="password"
          bind:value={confirmarContrasena}
          placeholder="••••••••"
          minlength="8"
          required
        />
      </label>

      <label>
        Tipo de usuario
        <select bind:value={tipoUsuario}>
          <option value="general">General</option>
          <option value="rehabilitacion">Rehabilitación</option>
          <option value="adulto_mayor">Adulto mayor</option>
        </select>
      </label>

      <button type="submit" class="primary-btn">
        Registrar cuenta
      </button>
    </form>

    <button type="button" class="secondary-btn" on:click={handleIrALogin}>
      Ya tengo cuenta
    </button>
  </section>
</main>

<style>
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
