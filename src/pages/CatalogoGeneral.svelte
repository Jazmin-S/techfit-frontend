<script>
  // Catálogo de ejercicios para usuarios generales de TECHFIT

  // Función que viene de App.svelte para volver al login (cerrar sesión)
  export let irALogin;

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

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    if (irALogin) irALogin();
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
      <button class="logout-btn" on:click={cerrarSesion}>
        Cerrar sesión
      </button>
    </header>

    <div class="grid">
      {#each ejercicios as ejercicio}
        <article class="exercise-card">
          <h2>{ejercicio.nombre}</h2>
          <p class="pill">Nivel: {ejercicio.nivel}</p>
          <p class="detail"><strong>Duración:</strong> {ejercicio.duracion}</p>
          <p class="detail"><strong>Objetivo:</strong> {ejercicio.objetivo}</p>
          <p class="detail"><strong>Recomendaciones:</strong> {ejercicio.recomendaciones}</p>
        </article>
      {/each}
    </div>
  </section>
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
    background: rgba(70, 230, 176, 0.16);
    color: #c6ffe8;
    margin-bottom: 0.4rem;
  }

  .detail {
    margin: 0.2rem 0;
    font-size: 0.9rem;
  }
</style>
