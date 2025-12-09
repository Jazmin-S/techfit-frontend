<script>
  // Importamos la función login del servicio de API
  import { login as loginApi } from "../services/api";

  // Estas funciones vienen desde App.svelte como "props"
  // y se usan para cambiar de pantalla.
  export let irARegistro;
  export let irAPerfil;

  // Variables reactivas para los campos del formulario
  let correo = "";
  let contrasena = "";
  let error = "";

  // Maneja el envío del formulario de login
  async function handleSubmit(event) {
    event.preventDefault();
    error = "";

    // Validación sencilla (que no haya campos vacíos)
    if (!correo || !contrasena) {
      error = "Todos los campos son obligatorios.";
      return;
    }

    try {
      // Llamamos a la API (por ahora es mock hasta que exista el backend real)
      const usuario = await loginApi(correo, contrasena);

      // Guardamos el usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Cambiamos de pantalla: vamos a Perfil
      if (irAPerfil) irAPerfil();
    } catch (e) {
      console.error(e);
      error = e.message || "No se pudo iniciar sesión.";
    }
  }

  // Llama a la función que cambia a la pantalla de Registro
  function handleIrARegistro() {
    if (irARegistro) irARegistro();
  }
</script>

<!-- Vista de la pantalla de login -->
<main class="app">
  <section class="card">
    <h1 class="title">TECHFIT</h1>
    <p class="subtitle">Inicia sesión para continuar</p>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <form on:submit={handleSubmit} class="form">
      <label>
        Correo electrónico
        <input
          type="email"
          bind:value={correo}
          required
          placeholder="tu@correo.com"
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          bind:value={contrasena}
          required
          minlength="8"
          placeholder="••••••••"
        />
      </label>

      <button type="submit" class="primary-btn">
        Iniciar sesión
      </button>
    </form>

    <button type="button" class="secondary-btn" on:click={handleIrARegistro}>
      Crear cuenta nueva
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

  input {
    padding: 0.6rem 0.7rem;
    border-radius: 8px;
    border: 1px solid #33364d;
    background: #0c0c18;
    color: #f5f5f5;
    font-size: 0.9rem;
  }

  input:focus {
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
