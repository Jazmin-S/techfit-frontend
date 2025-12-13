<script>
  // Estado actual de la pantalla (login, perfil, catálogos, etc.)
  export let paginaActual;

  // Funciones que vienen de App.svelte
  export let irALogin;
  export let irAPerfil;
  export let irACatalogoGeneral;
  export let irACatalogoRehabilitacion;
  export let irACatalogoAdultoMayor;

  function cerrarSesion() {
    // Logout sencillo
    localStorage.removeItem("usuario");
    if (irALogin) irALogin();
  }
</script>

<nav class="navbar">
  <div class="navbar-inner">
    <div class="navbar-left">
      <span class="logo">TECHFIT</span>
    </div>

    <div class="navbar-center">
      <button
        class:active={paginaActual === "catalogoGeneral"}
        on:click={irACatalogoGeneral}
      >
        General
      </button>

      <button
        class:active={paginaActual === "catalogoRehabilitacion"}
        on:click={irACatalogoRehabilitacion}
      >
        Rehabilitación
      </button>

      <button
        class:active={paginaActual === "catalogoAdultoMayor"}
        on:click={irACatalogoAdultoMayor}
      >
        Adulto mayor
      </button>
    </div>

    <div class="navbar-right">
      <button
        class:active={paginaActual === "perfil"}
        on:click={irAPerfil}
      >
        Perfil
      </button>

      <button class="logout" on:click={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  </div>
</nav>

<style>
  .navbar {
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(15, 15, 30, 0.98),
      rgba(10, 18, 40, 0.98)
    );
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
  }

  /* Contenedor centrado, como tus cards */
  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.6rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    box-sizing: border-box;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo {
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 1rem;
  }

  .navbar-center {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    justify-content: center;
  }

  .navbar-right {
    display: flex;
    gap: 0.5rem;
  }

  button {
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    border: 1px solid transparent;
    background: transparent;
    color: #f1f1ff;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  button.active {
    background: rgba(70, 230, 176, 0.14);
    border-color: rgba(70, 230, 176, 0.7);
  }

  .logout {
    border-color: rgba(255, 120, 120, 0.7);
    background: rgba(255, 80, 80, 0.08);
    color: #ffb7b7;
  }

  .logout:hover {
    background: rgba(255, 80, 80, 0.18);
  }

  @media (max-width: 640px) {
    .navbar-inner {
      flex-wrap: wrap;
      padding: 0.6rem 0.9rem;
    }

    .navbar-center {
      order: 3;
      width: 100%;
      justify-content: space-around;
      flex-wrap: wrap;
    }
  }
</style>
