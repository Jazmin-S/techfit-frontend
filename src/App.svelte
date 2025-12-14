<script>
  // Importamos las pantallas que vamos a mostrar según la variable "pagina"
  import Login from "./pages/Login.svelte";
  import Registro from "./pages/Registro.svelte";
  import Perfil from "./pages/Perfil.svelte";

  import CatalogoGeneral from "./pages/CatalogoGeneral.svelte";
  import CatalogoRehabilitacion from "./pages/CatalogoRehabilitacion.svelte";
  import CatalogoAdultoMayor from "./pages/CatalogoAdultoMayor.svelte";

  import AgregarEjercicio from "./pages/AgregarEjercicio.svelte";
  import Dashboard from "./pages/Dashboard.svelte";

  // Funciones para leer sesión y saber si el usuario es admin
  import { obtenerUsuario, esAdmin } from "./services/session";

  // Esta variable decide qué pantalla se ve
  let pagina = "login";

  // Si recargamos la app y ya había sesión, entramos directo sin volver a login
  const usuarioSesion = obtenerUsuario();

  if (usuarioSesion) {
    // Si es admin, lo mandamos al dashboard
    if (esAdmin(usuarioSesion)) {
      pagina = "dashboard";
    } else {
      // Si es usuario normal, lo mandamos al catálogo que le toca
      if (usuarioSesion.tipoUsuario === "rehabilitacion") pagina = "rehabilitacion";
      else if (usuarioSesion.tipoUsuario === "adulto_mayor") pagina = "adulto_mayor";
      else pagina = "general";
    }
  }

  // Funciones de navegación
  // Cada una solo cambia el valor de "pagina"
  const irALogin = () => { pagina = "login"; };
  const irARegistro = () => { pagina = "registro"; };
  const irAPerfil = () => { pagina = "perfil"; };

  const irAGeneral = () => { pagina = "general"; };
  const irARehabilitacion = () => { pagina = "rehabilitacion"; };
  const irAAdultoMayor = () => { pagina = "adulto_mayor"; };

  const irAAdmin = () => { pagina = "admin"; };
  const irADashboard = () => { pagina = "dashboard"; };

  // Esto sirve por si algún componente quiere cambiar a una página específica
  const cambiarPagina = (nuevaPagina) => {
    pagina = nuevaPagina;
  };
</script>

{#if pagina === "login"}
  <!-- Pantalla login con funciones para ir a otras pantallas -->
  <Login
    irARegistro={irARegistro}
    irAPerfil={irAPerfil}
    irACatalogoGeneral={irAGeneral}
    irACatalogoRehabilitacion={irARehabilitacion}
    irACatalogoAdultoMayor={irAAdultoMayor}
    irAAdmin={irADashboard}
  />

{:else if pagina === "registro"}
  <!-- Pantalla registro con opción para regresar al login -->
  <Registro irALogin={irALogin} />

{:else if pagina === "perfil"}
  <!-- Pantalla perfil, con opciones para volver al catálogo o al dashboard -->
  <Perfil
    irALogin={irALogin}
    irAGeneral={irAGeneral}
    irADashboard={irADashboard}
  />

{:else if pagina === "dashboard"}
  <!-- Menú principal del admin -->
  <Dashboard
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAGeneral={irAGeneral}
    irARehabilitacion={irARehabilitacion}
    irAAdultoMayor={irAAdultoMayor}
    irAAdmin={irAAdmin}
  />

{:else if pagina === "general"}
  <!-- Catálogo general -->
  <CatalogoGeneral
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAAgregarEjercicio={irAAdmin}
  />

{:else if pagina === "rehabilitacion"}
  <!-- Catálogo de rehabilitación -->
  <CatalogoRehabilitacion
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAAgregarEjercicio={irAAdmin}
  />

{:else if pagina === "adulto_mayor"}
  <!-- Catálogo de adulto mayor -->
  <CatalogoAdultoMayor
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAAgregarEjercicio={irAAdmin}
  />

{:else if pagina === "admin"}
  <!-- Pantalla para agregar ejercicios (solo admin) -->
  <AgregarEjercicio irALogin={irALogin} />
{/if}