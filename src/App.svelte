<script>
  import Login from "./pages/Login.svelte";
  import Registro from "./pages/Registro.svelte";
  import Perfil from "./pages/Perfil.svelte";

  import CatalogoGeneral from "./pages/CatalogoGeneral.svelte";
  import CatalogoRehabilitacion from "./pages/CatalogoRehabilitacion.svelte";
  import CatalogoAdultoMayor from "./pages/CatalogoAdultoMayor.svelte";

  import AgregarEjercicio from "./pages/AgregarEjercicio.svelte";
  import Dashboard from "./pages/Dashboard.svelte";

  import { obtenerUsuario, esAdmin } from "./services/session";

  let pagina = "login";

  // ✅ Si ya hay sesión al recargar
  const usuarioSesion = obtenerUsuario();
  if (usuarioSesion) {
    if (esAdmin(usuarioSesion)) {
      pagina = "dashboard";
    } else {
      if (usuarioSesion.tipoUsuario === "rehabilitacion") pagina = "rehabilitacion";
      else if (usuarioSesion.tipoUsuario === "adulto_mayor") pagina = "adulto_mayor";
      else pagina = "general";
    }
  }

  // Navegación
  const irALogin = () => (pagina = "login");
  const irARegistro = () => (pagina = "registro");
  const irAPerfil = () => (pagina = "perfil");

  const irAGeneral = () => (pagina = "general");
  const irARehabilitacion = () => (pagina = "rehabilitacion");
  const irAAdultoMayor = () => (pagina = "adulto_mayor");

  const irAAdmin = () => (pagina = "admin");
  const irADashboard = () => (pagina = "dashboard");

  // ✅ Función para cambiar página desde cualquier componente
  const cambiarPagina = (nuevaPagina) => {
    pagina = nuevaPagina;
  };
</script>

{#if pagina === "login"}
  <Login
    irARegistro={irARegistro}
    irAPerfil={irAPerfil}
    irACatalogoGeneral={irAGeneral}
    irACatalogoRehabilitacion={irARehabilitacion}
    irACatalogoAdultoMayor={irAAdultoMayor}
    irAAdmin={irADashboard}
  />

{:else if pagina === "registro"}
  <Registro irALogin={irALogin} />

{:else if pagina === "perfil"}
  <Perfil
    irALogin={irALogin}
    irAGeneral={irAGeneral}
    irADashboard={irADashboard}
  />



{:else if pagina === "dashboard"}
  <Dashboard
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAGeneral={irAGeneral}
    irARehabilitacion={irARehabilitacion}
    irAAdultoMayor={irAAdultoMayor}
    irAAdmin={irAAdmin}
  />

{:else if pagina === "general"}
  <CatalogoGeneral
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAAgregarEjercicio={irAAdmin}
  />

{:else if pagina === "rehabilitacion"}
  <CatalogoRehabilitacion
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAAgregarEjercicio={irAAdmin}
  />

{:else if pagina === "adulto_mayor"}
  <CatalogoAdultoMayor
    irALogin={irALogin}
    irAPerfil={irAPerfil}
    irAAgregarEjercicio={irAAdmin}
  />

{:else if pagina === "admin"}
  <AgregarEjercicio irALogin={irALogin} />
{/if}