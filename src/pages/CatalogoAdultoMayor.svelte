<script>
  import { onMount } from "svelte";

  /** @type {() => void} */
  export let irALogin = () => {};
  /** @type {() => void} */
  export let irAPerfil = () => {};
  /** @type {() => void} */
  export let irAAgregarEjercicio = () => {};

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

  let usuario = null;
  let esAdmin = false;

  let cargando = true;
  let error = "";
  let ejercicios = [];

  let videoAbierto = null;

  const fallback = [
    {
      nombre: "Caminata suave en lugar seguro",
      duracion: "10 - 15 minutos",
      nivel: "Bajo impacto",
      objetivo: "Mantener movilidad general y salud cardiovascular.",
      recomendaciones: "Calzado cómodo, evitar superficies irregulares.",
      tipoUsuario: "adulto_mayor",
      videoUrl: "https://www.youtube.com/embed/-X9VNfRg1Mw"
    },
    {
      nombre: "Sentarse y levantarse de la silla",
      duracion: "2 - 3 series de 8 repeticiones",
      nivel: "Bajo impacto",
      objetivo: "Fortalecer piernas y facilitar actividades diarias.",
      recomendaciones: "Silla estable, moverse a ritmo cómodo.",
      tipoUsuario: "adulto_mayor",
      videoUrl: "https://www.youtube.com/embed/untx40bsbC0"
    },
    {
      nombre: "Movimiento de brazos con botellas ligeras",
      duracion: "2 series de 10 repeticiones",
      nivel: "Suave",
      objetivo: "Mantener fuerza en brazos y hombros.",
      recomendaciones: "Peso muy ligero, respirar normal.",
      tipoUsuario: "adulto_mayor",
      videoUrl: "https://www.youtube.com/embed/wdX5mg7b6Ig"
    }
  ];

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    irALogin();
  }

  function abrirVideo(ej) {
    if (!ej?.videoUrl) return;
    videoAbierto = ej;
  }

  function cerrarVideo() {
    videoAbierto = null;
  }

  async function cargarEjercicios() {
    cargando = true;
    error = "";
    try {
      const res = await fetch(`${API_BASE}/ejercicios?tipoUsuario=adulto_mayor`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      ejercicios = Array.isArray(data) ? data : [];
      if (ejercicios.length === 0) ejercicios = fallback;
    } catch (e) {
      console.error(e);
      error = "No se pudieron cargar ejercicios desde el servidor. Mostrando fallback.";
      ejercicios = fallback;
    } finally {
      cargando = false;
    }
  }

  onMount(() => {
    const guardado = localStorage.getItem("usuario");
    usuario = guardado ? JSON.parse(guardado) : null;
    esAdmin = !!usuario?.esAdmin;
    cargarEjercicios();
  });
</script>

<main class="app">
  <section class="card">
    <header class="header">
      <div>
        <h1 class="title">CATÁLOGO – ADULTOS MAYORES</h1>
        <p class="subtitle">Ejercicios de bajo impacto para seguridad y autonomía.</p>
      </div>

      <div class="header-buttons">
        <button class="btn" on:click={irAPerfil}>Perfil</button>

        {#if esAdmin}
          <button class="btn add" on:click={irAAgregarEjercicio}>Agregar ejercicio</button>
        {/if}

        <button class="btn logout" on:click={cerrarSesion}>Cerrar sesión</button>
      </div>
    </header>

    {#if cargando}
      <div class="info">Cargando ejercicios...</div>
    {:else if error}
      <div class="error">
        <span>{error}</span>
        <button class="btn small" on:click={cargarEjercicios}>Reintentar</button>
      </div>
    {/if}

    <div class="grid">
      {#each ejercicios as ej}
        <article class="exercise-card" on:click={() => abrirVideo(ej)}>
          <h2>{ej.nombre}</h2>
          <p class="pill senior">NIVEL: {String(ej.nivel || "").toUpperCase()}</p>
          <p class="detail"><strong>Duración:</strong> {ej.duracion}</p>
          <p class="detail"><strong>Objetivo:</strong> {ej.objetivo}</p>
          <p class="detail"><strong>Recomendaciones:</strong> {ej.recomendaciones}</p>

          {#if ej.videoUrl}
            <p class="hint">▶ Ver video</p>
          {:else}
            <p class="hint muted">Sin video</p>
          {/if}
        </article>
      {/each}
    </div>
  </section>

  {#if videoAbierto}
    <div class="overlay" on:click={cerrarVideo}>
      <div class="modal" on:click|stopPropagation>
        <button class="close-btn" on:click={cerrarVideo}>✕</button>
        <h2>{videoAbierto.nombre}</h2>
        <div class="video-wrapper">
          <iframe
            src={videoAbierto.videoUrl}
            title={"Video - " + videoAbierto.nombre}
            frameborder="0"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .app { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
  .card { width:100%; max-width:1100px; background:rgba(15,15,30,.95); border-radius:18px; padding:1.8rem 1.6rem; box-shadow:0 20px 40px rgba(0,0,0,.6); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,.06); }
  .header { display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; margin-bottom:1.4rem; }
  .title { margin:0; font-size:1.7rem; letter-spacing:.06em; text-transform:uppercase; }
  .subtitle { margin:.3rem 0 0; font-size:.95rem; color:#b0b0c0; }
  .header-buttons { display:flex; gap:.5rem; flex-wrap:wrap; justify-content:flex-end; }

  .btn { border-radius:999px; padding:.45rem .9rem; border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.06); color:#f1f1ff; font-size:.85rem; cursor:pointer; white-space:nowrap; }
  .btn:hover { background:rgba(255,255,255,.12); }
  .btn.logout { border:1px solid rgba(255,120,120,.7); background:rgba(255,80,80,.08); color:#ffb7b7; }
  .btn.logout:hover { background:rgba(255,80,80,.18); }
  .btn.add { border:1px solid rgba(125,255,120,.7); background:rgba(80,255,80,.08); color:#b7ffc2ff; }
  .btn.add:hover { background:rgba(80,255,80,.18); }
  .btn.small { padding:.35rem .7rem; font-size:.8rem; }

  .info { margin:.6rem 0 1rem; color:#b0b0c0; }
  .error { margin:.6rem 0 1rem; padding:.8rem 1rem; border-radius:12px; border:1px solid rgba(255,120,120,.35); background:rgba(255,80,80,.10); color:#ffd1d1; display:flex; align-items:center; justify-content:space-between; gap:1rem; }

  .grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.2rem; }
  .exercise-card { background:rgba(255,255,255,.02); border-radius:14px; padding:1rem 1.1rem; border:1px solid rgba(255,255,255,.06); cursor:pointer; transition:transform .15s ease; }
  .exercise-card:hover { transform: translateY(-2px); }
  .exercise-card h2 { margin:0 0 .3rem; font-size:1.1rem; }

  .pill { display:inline-flex; padding:.2rem .6rem; border-radius:999px; font-size:.75rem; text-transform:uppercase; letter-spacing:.06em; margin-bottom:.4rem; }
  .pill.senior { background: rgba(255, 196, 87, 0.16); color:#ffe8b8; }

  .detail { margin:.2rem 0; font-size:.9rem; }
  .hint { margin-top:.6rem; font-size:.85rem; color:#b7ffc2; }
  .hint.muted { color:#8a8aa0; }

  .overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); display:flex; align-items:center; justify-content:center; z-index:50; }
  .modal { width:90%; max-width:800px; background:#101020; border-radius:16px; padding:1.4rem 1.2rem 1.6rem; position:relative; box-shadow:0 18px 40px rgba(0,0,0,.7); }
  .close-btn { position:absolute; top:.6rem; right:.8rem; border:none; border-radius:999px; width:28px; height:28px; cursor:pointer; background:rgba(255,255,255,.1); color:#f5f5f5; font-size:.9rem; }
  .video-wrapper { position:relative; width:100%; padding-top:56.25%; margin-top:.8rem; }
  .video-wrapper iframe { position:absolute; inset:0; width:100%; height:100%; border-radius:12px; }
</style>
