<script>
  // Catálogo de ejercicios para usuarios generales de TECHFIT

  // Función que viene de App.svelte para volver al login (cerrar sesión)
  export let irALogin;
  export let irAAgregarEjercicio

  // Lista de ejercicios (datos estáticos por ahora)
  const ejercicios = [
    {
      nombre: "Calentamiento dinámico",
      duracion: "5 - 10 minutos",
      nivel: "Principiante",
      objetivo: "Preparar músculos y articulaciones antes del entrenamiento.",
      recomendaciones: "Movimiento suave, sin dolor, evitar rebotes bruscos."
    },
    {
      nombre: "Circuito de cuerpo completo",
      duracion: "20 - 30 minutos",
      nivel: "Intermedio",
      objetivo: "Mejorar resistencia y fuerza general.",
      recomendaciones: "Realizar 3 rondas de 8–10 repeticiones, descansar 1 min entre rondas."
    },
    {
      nombre: "HIIT suave",
      duracion: "15 - 20 minutos",
      nivel: "Avanzado",
      objetivo: "Aumentar capacidad cardiovascular en poco tiempo.",
      recomendaciones: "Alternar 30s de trabajo y 30s de descanso. No recomendado para principiantes."
    }
  ];

    // null | "calentamiento" | "circuito" | "hiit"
  let videoAbierto = null;

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    if (irALogin) irALogin();
  }

  function abrirVideo(tipo) {
    videoAbierto = tipo;
  }

  function cerrarVideo() {
    videoAbierto = null;
  }
</script>

<main class="app">
  <section class="card">
    <header class="header">
      <div>
        <h1 class="title">Catálogo de ejercicios – General</h1>
        <p class="subtitle">
          Rutinas pensadas para personas sin restricciones médicas importantes.
        </p>
      </div>
      <div class="header-buttons">
        <button class="btn" on:click={irAAgregarEjercicio}>Agregar ejercicio</button>
        <button class="btn logout" on:click={cerrarSesion}>Cerrar sesión</button>
      </div>
    </header>

    <div class="grid">
      <!-- Card 1 -->
      <article class="exercise-card" on:click={() => abrirVideo("calentamiento")}>
        <h2>{ejercicios[0].nombre}</h2>
        <p class="pill">NIVEL: {ejercicios[0].nivel.toUpperCase()}</p>
        <p class="detail"><strong>Duración:</strong> {ejercicios[0].duracion}</p>
        <p class="detail"><strong>Objetivo:</strong> {ejercicios[0].objetivo}</p>
        <p class="detail">
          <strong>Recomendaciones:</strong> {ejercicios[0].recomendaciones}
        </p>
      </article>

      <!-- Card 2 -->
      <article class="exercise-card" on:click={() => abrirVideo("circuito")}>
        <h2>{ejercicios[1].nombre}</h2>
        <p class="pill">NIVEL: {ejercicios[1].nivel.toUpperCase()}</p>
        <p class="detail"><strong>Duración:</strong> {ejercicios[1].duracion}</p>
        <p class="detail"><strong>Objetivo:</strong> {ejercicios[1].objetivo}</p>
        <p class="detail">
          <strong>Recomendaciones:</strong> {ejercicios[1].recomendaciones}
        </p>
      </article>

      <!-- Card 3 -->
      <article class="exercise-card" on:click={() => abrirVideo("hiit")}>
        <h2>{ejercicios[2].nombre}</h2>
        <p class="pill">NIVEL: {ejercicios[2].nivel.toUpperCase()}</p>
        <p class="detail"><strong>Duración:</strong> {ejercicios[2].duracion}</p>
        <p class="detail"><strong>Objetivo:</strong> {ejercicios[2].objetivo}</p>
        <p class="detail">
          <strong>Recomendaciones:</strong> {ejercicios[2].recomendaciones}
        </p>
      </article>
    </div>
  </section>

  {#if videoAbierto}
    <!-- Fondo oscuro -->
    <div class="overlay" on:click={cerrarVideo}>
      <!-- Popup -->
      <div class="modal" on:click|stopPropagation>
        <button class="close-btn" on:click={cerrarVideo}>✕</button>

        {#if videoAbierto === "calentamiento"}
          <h2>Calentamiento dinámico</h2>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_1"
              title="Calentamiento dinámico"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        {:else if videoAbierto === "circuito"}
          <h2>Circuito de cuerpo completo</h2>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_2"
              title="Circuito de cuerpo completo"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        {:else if videoAbierto === "hiit"}
          <h2>HIIT suave</h2>
          <div class="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID_3"
              title="HIIT suave"
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

  .header-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
    color: #f1f1ff;
    font-size: 0.85rem;
    cursor: pointer;
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

  .Agregar-btn{
    border: 1px solid rgba(125, 255, 120, 0.7);
    background: rgba(80, 255, 80, 0.08);
    color: #b7ffc2ff;
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .Agregar-btn:hover {
    background: rgba(80, 255, 80, 0.18);
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
    background: rgba(70, 230, 176, 0.16);
    color: #c6ffe8;
    margin-bottom: 0.4rem;
  }

  .detail {
    margin: 0.2rem 0;
    font-size: 0.9rem;
  }

  /* === POPUP === */
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
    padding: 1.4rem 1.2rem 1.6rem;
    position: relative;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
  }

  .modal h2 {
    margin-top: 0;
    margin-bottom: 0.8rem;
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
    padding-top: 56.25%; /* 16:9 */
    margin-top: 0.8rem;
  }

  .video-wrapper iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
</style>
