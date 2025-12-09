<script>
  // Importamos las "pantallas" (componentes) que creaste
  import Login from "./pages/Login.svelte";
  import Registro from "./pages/Registro.svelte";
  import Perfil from "./pages/Perfil.svelte";

  // Controla qué pantalla se muestra actualmente
  // valores posibles: "login", "registro", "perfil"
  let paginaActual = "login";

  // Cambia la pantalla a Login
  function irALogin() {
    paginaActual = "login";
  }

  // Cambia la pantalla a Registro
  function irARegistro() {
    paginaActual = "registro";
  }

  // Cambia la pantalla a Perfil
  function irAPerfil() {
    paginaActual = "perfil";
  }
</script>

<!-- Contenedor general de la app -->
<div class="root">
  {#if paginaActual === "login"}
    <!-- Pantalla de inicio de sesión -->
    <Login irARegistro={irARegistro} irAPerfil={irAPerfil} />

  {:else if paginaActual === "registro"}
    <!-- Pantalla de registro -->
    <Registro irALogin={irALogin} />

  {:else if paginaActual === "perfil"}
    <!-- Pantalla de perfil -->
    <Perfil irALogin={irALogin} />
  {/if}
</div>

<style>
  /* Contenedor para que las pantallas ocupen todo el alto */
  .root {
    min-height: 100vh;
  }
</style>
