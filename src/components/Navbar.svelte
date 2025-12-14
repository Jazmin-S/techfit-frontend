<script>
  // Estado actual de la pantalla (login, perfil, catálogos, etc.)
  export let paginaActual;

  // Funciones para navegar entre el sistema que vienen de App.svelte
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
  <!-- contenedor interno para alinear todo y que no se vaya a los bordes -->
  <div class="navbar-inner">

    <!-- lado izquierdo, para el logo -->
    <div class="navbar-left">
      <span class="logo">TECHFIT</span>
    </div>

    <!-- centro, para poner los botones para cambiar de catálogo -->
    <div class="navbar-center">
      <!-- botóon para el catálogo General -->
      <button
        class:active={paginaActual === "catalogoGeneral"}
        on:click={irACatalogoGeneral}
      >
        General
      </button>

      <!-- Boton para el catalogo de rehabilitación -->
      <button
        class:active={paginaActual === "catalogoRehabilitacion"} 
        on:click={irACatalogoRehabilitacion}
      >
        Rehabilitación
      </button>

      <!-- Botón para ir al catálogo de adultos mayores -->
      <button
        class:active={paginaActual === "catalogoAdultoMayor"} 
        on:click={irACatalogoAdultoMayor}
      >
        Adulto mayor
      </button>
    </div>

    <!-- lado derecho para el Perfil y Cerrar sesión -->
    <div class="navbar-right">
      <button
        class:active={paginaActual === "perfil"}
        on:click={irAPerfil}
      >
        Perfil
      </button>

      <button class="logout" on:click={cerrarSesion}>
        <!-- botón para cerrar sesión -->
        Cerrar sesión
      </button>
    </div>
  </div>
</nav>

<style>
  /* estilo de la barra de navegación */
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

  /* estilo del contenedor interno */
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

  /* estilo del lado izquierdo */
  .navbar-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* estilo del logo */
  .logo {
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 1rem;
  }

  /* estilo del centro con los botones de catálogos */
  .navbar-center {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    justify-content: center;
  }

  /* estilo del lado derecho */
  .navbar-right {
    display: flex;
    gap: 0.5rem;
  }

  /* estilo general de los botones */
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

  /* estilo del hover de botones */
  button:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  /* estilo del botón activo */
  button.active {
    background: rgba(70, 230, 176, 0.14);
    border-color: rgba(70, 230, 176, 0.7);
  }

  /* estilo del botón cerrar sesión */
  .logout {
    border-color: rgba(255, 120, 120, 0.7);
    background: rgba(255, 80, 80, 0.08);
    color: #ffb7b7;
  }

  /* estilo del hover de cerrar sesión */
  .logout:hover {
    background: rgba(255, 80, 80, 0.18);
  }

  @media (max-width: 640px) {
    /* estilo responsive del contenedor */
    .navbar-inner {
      flex-wrap: wrap;
      padding: 0.6rem 0.9rem;
    }

    /* estilo responsive del centro */
    .navbar-center {
      order: 3;
      width: 100%;
      justify-content: space-around;
      flex-wrap: wrap;
    }
  }
</style>