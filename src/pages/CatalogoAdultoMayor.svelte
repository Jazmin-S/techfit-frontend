<script>
  import { onMount } from "svelte";
  import { listarEjercicios } from "../services/api";

  // Navegación (las funciones vienen de App.svelte)
  export let irALogin;
  export let irAPerfil;
  export let irAAgregarEjercicio;

  // Estado
  let usuario = null;
  let esAdmin = false;

  let ejercicios = [];
  let cargando = true;
  let error = "";

  // Modal video
  let videoAbierto = null;

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    irALogin?.();
  }

  function abrirVideo(ejercicio) {
    if (!ejercicio?.videoUrl) return;
    videoAbierto = ejercicio;
  }

  function cerrarVideo() {
    videoAbierto = null;
  }

  onMount(async () => {
    try {
      const data = localStorage.getItem("usuario");
      if (data) {
        usuario = JSON.parse(data);
        esAdmin = usuario?.rol === "ADMIN";
      }

      // IMPORTANTE: debe coincidir con tu backend
      ejercicios = await listarEjercicios("adulto_mayor");
    } catch (e) {
      console.error(e);
      error = "No se pudieron cargar los ejercicios";
    } finally {
      cargando = false;
    }
  });
</script>

<header class="top-bar">
  <h1>Ejercicios · Adulto Mayor</h1>

  <div class="acciones">
    <button class="btn" on:click={() => irAPerfil?.()}>Perfil</button>

    {#if esAdmin}
      <button class="btn btn-admin" on:click={() => irAAgregarEjercicio?.()}>
        + Agregar ejercicio
      </button>
    {/if}

    <button class="btn btn-salir" on:click={cerrarSesion}>Salir</button>
  </div>
</header>

<div class="page">
  {#if cargando}
    <p class="estado">Cargando ejercicios...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if ejercicios.length === 0}
    <p class="estado">No hay ejercicios registrados</p>
  {:else}
    <section class="grid">
      {#each ejercicios as e}
        <article class="card">
          <h3 class="titulo">{e.nombre}</h3>

          <div class="info">
            <p><strong>Duración:</strong> {e.duracion}</p>
            <p><strong>Nivel:</strong> {e.nivel}</p>
            <p><strong>Objetivo:</strong> {e.objetivo}</p>

            {#if e.recomendaciones}
              <p class="reco">{e.recomendaciones}</p>
            {/if}
          </div>

          {#if e.videoUrl}
            <button class="btn video" on:click={() => abrirVideo(e)}>
              ▶ Ver video
            </button>
          {/if}
        </article>
      {/each}
    </section>
  {/if}
</div>s

{#if videoAbierto}
  <div class="modal" on:click={cerrarVideo}>
    <div class="modal-contenido" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{videoAbierto.nombre}</h2>
        <button class="btn btn-cerrar" on:click={cerrarVideo}>✕</button>
      </div>

      <div class="video-wrap">
        <iframe
          src={videoAbierto.videoUrl}
          title="Video de ejercicio"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </div>
  </div>
{/if}

<style>
  /* ===== Fondo general (por si no tienes un global) ===== */
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }

  /* ===== Barra superior ===== */
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 18px 10px;
  }

  .top-bar h1 {
    margin: 0;
    font-size: clamp(22px, 3vw, 46px);
    line-height: 1.1;
    color: #fff;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
  }

  .acciones {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  /* ===== Contenedor ===== */
  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 18px 18px 40px;
  }

  /* ===== Botones ===== */
  .btn {
    padding: 9px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    transition: 0.15s;
  }

  .btn:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  .btn-admin {
    background: rgba(255, 255, 255, 0.14);
  }

  .btn-salir {
    background: rgba(255, 255, 255, 0.08);
  }

  /* ===== Estados ===== */
  .estado,
  .error {
    padding: 14px 18px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.22);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .error {
    color: #ffb4b4;
  }

  /* ===== Grid responsive ===== */
  .grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    align-items: stretch;
  }

  /* ===== Card ===== */
  .card {
    border-radius: 18px;
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(6px);
    color: #fff;

    display: flex;
    flex-direction: column;
    min-height: 290px;
  }

  .titulo {
    margin: 0 0 10px 0;
    font-size: 22px;
    line-height: 1.2;

    /* Limita títulos largos a 2 líneas */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1; /* empuja botón al fondo */
  }

  .card p {
    margin: 0;
    font-size: 16px;
    line-height: 1.35;
    opacity: 0.95;
  }

  .card strong {
    font-weight: 800;
    opacity: 1;
  }

  .reco {
    opacity: 0.9;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .video {
    margin-top: 14px;
    width: fit-content;
  }

  /* ===== Modal ===== */
  .modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    z-index: 9999;
  }

  .modal-contenido {
    width: min(920px, 100%);
    border-radius: 18px;
    background: rgba(15, 15, 20, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: #fff;
    padding: 14px;
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 6px 12px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 20px;
    line-height: 1.2;
  }

  .btn-cerrar {
    padding: 8px 10px;
    border-radius: 12px;
  }

  .video-wrap {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.4);
  }

  .video-wrap iframe {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ===== Responsive ===== */
  @media (max-width: 640px) {
    .top-bar {
      flex-direction: column;
      align-items: flex-start;
    }

    .acciones {
      width: 100%;
    }
  }
</style>
