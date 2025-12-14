<script>
  /**
   * CatalogoGeneral.svelte
   * muestra el catologo general de ejercicios
   */

  import { onMount } from "svelte";
  import { listarEjercicios } from "../services/api"; //se importa la lista de ejercicios

  // Navegación (viene de App.svelte)
  export let irALogin = null; //se navega a la pantalla de login 
  export let irAPerfil = null; // se navega a la pantalla perfil 
  export let irAAgregarEjercicio = null; //se navega al formulario para agregar un ejercicio (solo el admin)

  // Estado del usuario
  let usuario = null; //datos del usuario
  let esAdmin = false; //bandera que indica si el usuario es admin

  //estado de catalogo 
  let ejercicios = []; //lista de ejercicio obtenidos del servidor 
  let cargando = true; //muestra el estado de "cargando" mientras obtiene los datos
  let error = ""; //mensaje de error si falla la carga

  // Modal video
  let videoAbierto = null; //video de ejercicio que se este mostrando (en null = modal cerrado)

  //cierra la sesion eliminando datos de usuario y redirigiendo a Login
  function cerrarSesion() {
    localStorage.removeItem("usuario");
    irALogin?.();
  }

  //abre el modal con el video del ejercicio seleccionado
  function abrirVideo(ejercicio) {
    if (!ejercicio?.videoUrl) return;
    videoAbierto = ejercicio;
  }

  function cerrarVideo() {
    videoAbierto = null;
  }

  //Obtiene la lista de ejercicios desde el servidor
  async function cargar() {
    cargando = true;
    error = "";
    try {
      ejercicios = await listarEjercicios("general");
    } catch (e) {
      console.error(e);
      error = e.message || "No se pudieron cargar los ejercicios.";
    } finally {
      cargando = false;
    }
  }

//Al montar componente, verifica el usuario y carga los ejercicios
  onMount(async () => {
    try {
      const raw = localStorage.getItem("usuario");
      usuario = raw ? JSON.parse(raw) : null;
    } catch {
      usuario = null;
    }
//Determina si el usuario tiene permisos de admin
    esAdmin = !!(usuario?.esAdmin || usuario?.isAdmin || usuario?.es_admin);
    await cargar();
  });
</script>


<main class="app">
  <section class="card">
    <header class="header">
      <div>
        <h1 class="title">CATÁLOGO DE EJERCICIOS – GENERAL</h1>
        <p class="subtitle">
          Rutinas pensadas para personas sin restricciones médicas importantes.
        </p>
      </div>

      <div class="header-buttons">
        {#if irAPerfil}
  <button class="btn" on:click={irAPerfil}>Perfil</button>
        {/if}

        {#if esAdmin && irAAgregarEjercicio}
        <!-- Botón visible solo para administradores -->
          <button class="btn add" on:click={irAAgregarEjercicio}>
            Agregar ejercicio
          </button>
        {/if}


        <button class="btn logout" on:click={cerrarSesion}>Cerrar sesión</button>
      </div>
    </header>

    {#if cargando}
      <div class="state">Cargando ejercicios...</div>
    {:else if error}
    <!-- Mensaje de error con opción de reintentar -->
      <div class="state error">
        {error}
        <button class="retry" on:click={cargar}>Reintentar</button>
      </div>
    {:else if ejercicios.length === 0}
      <div class="state">No hay ejercicios para mostrar.</div>
    {:else}
      <div class="grid">
        {#each ejercicios as e}
        <!-- Cada tarjeta es clickeable para abrir el video -->
          <article class="exercise-card" on:click={() => abrirVideo(e)}>
            <h2>{e.nombre}</h2>

            <p class="pill">
              NIVEL: {(e.nivel || "").toUpperCase()}
            </p>

            <p class="detail"><strong>Duración:</strong> {e.duracion}</p>
            <p class="detail"><strong>Objetivo:</strong> {e.objetivo}</p>
            <p class="detail">
              <strong>Recomendaciones:</strong> {e.recomendaciones}
            </p>

            {#if e.videoUrl}
              <p class="video-ok">🎬 Ver video</p>
            {:else}
              <p class="video-none">Sin video</p>
            {/if}
          </article>
        {/each}
      </div>
    {/if}
  </section>

  {#if videoAbierto}
      <!-- Modal que se muestra al reproducir un video -->
    <div class="overlay" on:click={cerrarVideo}>
      <div class="modal" on:click|stopPropagation>
        <button class="close-btn" on:click={cerrarVideo}>✕</button>

        <h2 class="modal-title">{videoAbierto.nombre}</h2>

        <div class="video-wrapper">
          <iframe
            src={videoAbierto.videoUrl}
            title={"Video: " + videoAbierto.nombre}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  {/if}
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
    max-width: 1100px;
    background: rgba(15, 15, 30, 0.95);
    border-radius: 18px;
    padding: 1.8rem 1.6rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.4rem;
  }

  .title {
    margin: 0;
    font-size: 1.7rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .subtitle {
    margin: 0.3rem 0 0;
    font-size: 0.95rem;
    color: #b0b0c0;
  }

  .header-buttons {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn {
    border-radius: 999px;
    padding: 0.45rem 0.95rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
    color: #f1f1ff;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .btn.logout {
    border: 1px solid rgba(255, 120, 120, 0.7);
    background: rgba(255, 80, 80, 0.08);
    color: #ffb7b7;
  }

  .btn.add {
    border: 1px solid rgba(125, 255, 120, 0.7);
    background: rgba(80, 255, 80, 0.08);
    color: #b7ffc2ff;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.2rem;
  }

  .exercise-card {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 14px;
    padding: 1rem 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
  }

  .exercise-card h2 {
    margin: 0 0 0.3rem;
    font-size: 1.1rem;
  }

  .pill {
    display: inline-flex;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: rgba(70, 230, 176, 0.16);
    color: #c6ffe8;
    margin-bottom: 0.4rem;
  }

  .detail {
    margin: 0.2rem 0;
    font-size: 0.9rem;
  }

  .video-none {
    margin-top: 0.8rem;
    opacity: 0.7;
  }

  .video-ok {
    margin-top: 0.8rem;
    opacity: 0.95;
  }

  .state {
    padding: 1rem;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
  }

  .state.error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .retry {
    border-radius: 12px;
    padding: 0.45rem 0.8rem;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06);
    color: #f1f1ff;
    cursor: pointer;
  }

  /* Modal */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }

  .modal {
    width: 95%;
    max-width: 900px;
    background: #101020;
    border-radius: 16px;
    padding: 1.4rem 1.2rem 1.6rem;
    position: relative;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
  }

  .modal-title {
    margin: 0 0 0.8rem;
  }

  .close-btn {
    position: absolute;
    top: 0.6rem;
    right: 0.8rem;
    border: none;
    border-radius: 999px;
    width: 28px;
    height: 28px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    color: #f5f5f5;
    font-size: 0.9rem;
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    margin-top: 0.6rem;
  }

  .video-wrapper iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
</style>
