<script>
  // Catálogo de ejercicios para ADULTOS MAYORES

  export let irALogin;

  const ejercicios = [
    {
      nombre: "Caminata suave en lugar seguro",
      duracion: "10 - 15 minutos",
      nivel: "Bajo impacto",
      objetivo: "Mantener movilidad general y salud cardiovascular.",
      recomendaciones: "Usar calzado cómodo, evitar superficies irregulares, detenerse si hay mareos."
    },
    {
      nombre: "Sentarse y levantarse de la silla",
      duracion: "2 - 3 series de 8 repeticiones",
      nivel: "Bajo impacto",
      objetivo: "Fortalecer piernas y facilitar actividades de la vida diaria.",
      recomendaciones: "Usar silla estable, apoyar manos si es necesario, moverse a ritmo cómodo."
    },
    {
      nombre: "Movimiento de brazos con botellas ligeras",
      duracion: "2 series de 10 repeticiones",
      nivel: "Suave",
      objetivo: "Mantener fuerza en brazos y hombros.",
      recomendaciones: "Usar peso muy ligero, respirar normal, evitar aguantar el aire."
    }
  ];

  // null = cerrado, 0 = primer ejercicio, 1 = segundo, 2 = tercero
  let videoAbierto = null;
    function abrirVideo(indice) {
    videoAbierto = indice;
  }

  function cerrarVideo() {
    videoAbierto = null;
  }

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    if (irALogin) irALogin();
  }
</script>

<main class="app">
  <section class="card">
    <header class="header">
      <div>
        <h1 class="title">Catálogo – Adultos mayores</h1>
        <p class="subtitle">
          Ejercicios de bajo impacto, pensados para seguridad y autonomía.
        </p>
      </div>
      <button class="logout-btn" on:click={cerrarSesion}>
        Cerrar sesión
      </button>
    </header>

    <div class="grid">
      {#each ejercicios as ejercicio, i}
          <article class="exercise-card" on:click={() => abrirVideo(i)}>
              <h2>{ejercicio.nombre}</h2>
              <p class="pill senior">Nivel: {ejercicio.nivel}</p>
              <p class="detail"><strong>Duración / series:</strong> {ejercicio.duracion}</p>
              <p class="detail"><strong>Objetivo:</strong> {ejercicio.objetivo}</p>
              <p class="detail"><strong>Recomendaciones:</strong> {ejercicio.recomendaciones}</p>
          </article>
      {/each}
    </div>
  </section>

  {#if videoAbierto !== null}
    <div class="overlay" on:click={cerrarVideo}>
      <div class="modal" on:click|stopPropagation>
        <button class="close-btn" on:click={cerrarVideo}>✕</button>

        {#if videoAbierto === 0}
          <h2>Video – Caminata suave en lugar seguro</h2>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_1"
              title="Caminata suave en lugar seguro"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        {:else if videoAbierto === 1}
          <h2>Video – Sentarse y levantarse de la silla</h2>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_2"
              title="Sentarse y levantarse de la silla"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        {:else if videoAbierto === 2}
          <h2>Video – Movimiento de brazos con botellas ligeras</h2>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_3"
              title="Movimiento de brazos con botellas ligeras"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        {/if}
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

  .logout-btn {
    border: 1px solid rgba(255, 120, 120, 0.7);
    background: rgba(255, 80, 80, 0.08);
    color: #ffb7b7;
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .logout-btn:hover {
    background: rgba(255, 80, 80, 0.18);
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
    margin-bottom: 0.4rem;
  }

  .pill.senior {
    background: rgba(255, 196, 87, 0.16);
    color: #ffe8b8;
  }

  .detail {
    margin: 0.2rem 0;
    font-size: 0.9rem;
  }

    .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal {
    width: 90%;
    max-width: 800px;
    background: #101020;
    border-radius: 16px;
    padding: 1.2rem 1.1rem 1.4rem;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.7rem;
    border: none;
    border-radius: 999px;
    width: 26px;
    height: 26px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    font-size: 0.9rem;
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 */
    margin-top: 0.7rem;
  }

  .video-wrapper iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }

</style>
