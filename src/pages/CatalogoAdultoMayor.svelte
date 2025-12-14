<script>
  import { onMount } from "svelte";
  import { listarEjercicios, cerrarSesion } from "../services/api";

  // Navegación (viene de App.svelte o router)
  export let irALogin;
  export let irAPerfil;
  export let irAAgregarEjercicio;

  // Si tu backend usa otro texto, cámbialo aquí:
  const TIPO_USUARIO = "adultoMayor";

  let usuario = null;
  let esAdmin = false;

  let ejercicios = [];
  let cargando = true;
  let error = "";

  // Modal video
  let videoAbierto = null;

  function go(fn) {
    if (typeof fn === "function") fn();
  }

  function cargarSesion() {
    try {
      usuario = JSON.parse(localStorage.getItem("usuario"));
    } catch {
      usuario = null;
    }

    // Ajusta esto si tu backend usa otro campo para rol
    esAdmin = !!usuario && usuario.tipoUsuario === "admin";
  }

  function salir() {
    cerrarSesion();
    go(irALogin);
  }

  function abrirVideo(ejercicio) {
    if (!ejercicio?.videoUrl) return;
    videoAbierto = ejercicio;
  }

  function cerrarVideo() {
    videoAbierto = null;
  }

  async function cargarEjercicios() {
    cargando = true;
    error = "";
    try {
      ejercicios = await listarEjercicios(TIPO_USUARIO);
    } catch (e) {
      error = e?.message || "Error al cargar ejercicios";
      ejercicios = [];
    } finally {
      cargando = false;
    }
  }

  onMount(() => {
    cargarSesion();
    cargarEjercicios();
  });
</script>

<div class="page">
  <header class="topbar">
    <div class="left">
      <h1>Catálogo Adulto Mayor</h1>
      <p class="sub">Ejercicios cargados desde el backend</p>
    </div>

    <div class="actions">
      <button class="btn ghost" type="button" on:click={() => go(irAPerfil)}>
        Perfil
      </button>

      {#if esAdmin}
        <button class="btn" type="button" on:click={() => go(irAAgregarEjercicio)}>
          Agregar ejercicio
        </button>
      {/if}

      <button class="btn danger" type="button" on:click={salir}>
        Cerrar sesión
      </button>
    </div>
  </header>

  {#if error}
    <div class="alert error">{error}</div>
  {/if}

  {#if cargando}
    <div class="loading">Cargando ejercicios...</div>
  {:else}
    {#if ejercicios.length === 0}
      <div class="empty">
        No hay ejercicios todavía para <b>{TIPO_USUARIO}</b>.
      </div>
    {:else}
      <section class="grid">
        {#each ejercicios as e (e.id)}
          <article class="card">
            <div class="card-head">
              <h3 class="title">{e.nombre}</h3>

              {#if e.videoUrl}
                <button class="btn small" type="button" on:click={() => abrirVideo(e)}>
                  Ver video
                </button>
              {/if}
            </div>

            {#if e.descripcion}
              <p class="desc">{e.descripcion}</p>
            {/if}

            <div class="meta">
              {#if e.duracionMinutos}
                <span>{e.duracionMinutos} min</span>
              {/if}
              {#if e.nivel}
                <span>Nivel: {e.nivel}</span>
              {/if}
            </div>
          </article>
        {/each}
      </section>
    {/if}
  {/if}
</div>

{#if videoAbierto}
  <div class="modal-backdrop" role="presentation" on:click={cerrarVideo}>
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Video ejercicio"
      on:click|stopPropagation
    >
      <div class="modal-head">
        <h2>{videoAbierto.nombre}</h2>
        <button class="btn ghost" type="button" on:click={cerrarVideo}>Cerrar</button>
      </div>

      <div class="video-wrap">
        <iframe
          title="Video"
          src={videoAbierto.videoUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
{/if}

<style>
  .page { padding: 24px; color: #eaeaea; }
  .topbar { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom:16px; }
  .left h1 { margin:0; font-size:28px; }
  .sub { margin:6px 0 0; opacity:.75; }
  .actions { display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
  .btn { padding:10px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.08); color:#fff; cursor:pointer; }
  .btn:hover { background: rgba(255,255,255,.12); }
  .btn.ghost { background: transparent; }
  .btn.danger { border-color: rgba(255,80,80,.35); background: rgba(255,80,80,.12); }
  .btn.small { padding:8px 10px; font-size: 13px; }
  .alert { padding:12px 14px; border-radius:12px; margin:12px 0; }
  .alert.error { background: rgba(255,80,80,.12); border: 1px solid rgba(255,80,80,.35); }
  .loading, .empty { opacity:.8; padding:16px 0; }
  .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:14px; margin-top:12px; }
  .card { border-radius:16px; border:1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); padding:14px; }
  .card-head { display:flex; justify-content:space-between; align-items:center; gap:10px; }
  .title { margin:0; font-size:18px; }
  .desc { margin:10px 0 0; opacity:.85; }
  .meta { display:flex; gap:10px; opacity:.75; margin-top:10px; font-size:13px; }
  .modal-backdrop { position:fixed; inset:0; background: rgba(0,0,0,.6); display:flex; align-items:center; justify-content:center; padding:16px; }
  .modal { width:min(900px, 96vw); border-radius:18px; border:1px solid rgba(255,255,255,.12); background: rgba(20,20,30,.98); padding:14px; }
  .modal-head { display:flex; justify-content:space-between; align-items:center; gap:10px; }
  .video-wrap { margin-top:12px; }
  iframe { width:100%; aspect-ratio: 16/9; border:0; border-radius:14px; }
</style>
