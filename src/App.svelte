<script>
  // Pantallas existentes
  import Login from "./pages/Login.svelte";
  import Registro from "./pages/Registro.svelte";
  import Perfil from "./pages/Perfil.svelte";

  // Nuevos catálogos
  import CatalogoGeneral from "./pages/CatalogoGeneral.svelte";
  import CatalogoRehabilitacion from "./pages/CatalogoRehabilitacion.svelte";
  import CatalogoAdultoMayor from "./pages/CatalogoAdultoMayor.svelte";
  import AgregarEjercicio from "./pages/AgregarEjercicio.svelte";

  // "login" | "registro" | "perfil" | "catalogoGeneral" | "catalogoRehabilitacion" | "catalogoAdultoMayor"
  let paginaActual = "catalogoGeneral";

  function irALogin() {
    paginaActual = "login";
  }

  function irARegistro() {
    paginaActual = "registro";
  }

  function irAPerfil() {
    paginaActual = "perfil";
  }

  function irACatalogoGeneral() {
    paginaActual = "catalogoGeneral";
  }

  function irACatalogoRehabilitacion() {
    paginaActual = "catalogoRehabilitacion";
  }

  function irACatalogoAdultoMayor() {
    paginaActual = "catalogoAdultoMayor";
  }

  function irAAgregarEjercicio(){
    paginaActual = "agregarEjercicio";
  }

  function volverDesdeAgregarEjercicio() {
    paginaActual = "catalogoGeneral";
}

</script>

<div class="root">
  {#if paginaActual === "login"}
    <Login
      irARegistro={irARegistro}
      irAPerfil={irAPerfil}
      irACatalogoGeneral={irACatalogoGeneral}
      irACatalogoRehabilitacion={irACatalogoRehabilitacion}
      irACatalogoAdultoMayor={irACatalogoAdultoMayor}
      irAAgregarEjercicio={irAAgregarEjercicio}
    />

  {:else if paginaActual === "registro"}
    <Registro irALogin={irALogin} />

  {:else if paginaActual === "perfil"}
    <Perfil irALogin={irALogin} />

  {:else if paginaActual === "catalogoGeneral"}
    <CatalogoGeneral irALogin={irALogin}
     irAAgregarEjercicio={irAAgregarEjercicio} />

  {:else if paginaActual === "catalogoRehabilitacion"}
    <CatalogoRehabilitacion irALogin={irALogin} />

  {:else if paginaActual === "catalogoAdultoMayor"}
    <CatalogoAdultoMayor irALogin={irALogin} />

  {:else if paginaActual === "agregarEjercicio"}
    <AgregarEjercicio volver={volverDesdeAgregarEjercicio} />
  {/if}
</div>

<style>
  .root {
    min-height: 100vh;
  }
</style>
