<script>
  /**
   * Dashboard.svelte
   * Menú principal para ADMIN:
   * - Ir a catálogos
   * - Ir a perfil
   * - Ir a panel admin
   * - Cerrar sesión
   */

  export let irALogin;

  export let irAPerfil;
  export let irAGeneral;
  export let irARehabilitacion;
  export let irAAdultoMayor;
  export let irAAdmin; // pantalla agregar ejercicio

  // Leer usuario actual
  const usuario = (() => {
    const raw = localStorage.getItem("usuario");
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  })();

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    irALogin?.();
  }
</script>

<main class="page">
  <section class="card">
    <header class="header">
      <div>
        <h1 class="title">TECHFIT</h1>
        <p class="subtitle">
          {#if usuario?.nombre}
            Hola, <strong>{usuario.nombre}</strong> (Admin) 👋
          {:else}
            Menú principal (Admin)
          {/if}
        </p>
      </div>

      <button class="btn ghost" on:click={cerrarSesion}>Salir</button>
    </header>

    <div class="grid">
      <button class="tile" on:click={irAPerfil}>
        <h2>Perfil</h2>
        <p>Ver tus datos y sesión.</p>
      </button>

      <button class="tile" on:click={irAGeneral}>
        <h2>Catálogo General</h2>
        <p>Ver rutinas para usuarios generales.</p>
      </button>

      <button class="tile" on:click={irARehabilitacion}>
        <h2>Catálogo Rehabilitación</h2>
        <p>Ejercicios suaves de recuperación.</p>
      </button>

      <button class="tile" on:click={irAAdultoMayor}>
        <h2>Catálogo Adultos Mayores</h2>
        <p>Ejercicios de bajo impacto.</p>
      </button>

      <button class="tile admin" on:click={irAAdmin}>
        <h2>Panel Admin</h2>
        <p>Agregar ejercicios al sistema.</p>
      </button>
    </div>
  </section>
</main>

<style>
  .page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    background: radial-gradient(1200px 600px at 20% 10%, #1f2a44 0%, #0b1020 55%, #070a14 100%);
    color: #e7eaf3;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
  }

  .card {
    width: min(950px, 100%);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 18px 60px rgba(0,0,0,0.45);
    backdrop-filter: blur(8px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.10);
    margin-bottom: 14px;
  }

  .title { margin: 0; font-size: 30px; }
  .subtitle { margin: 6px 0 0; opacity: 0.85; }

  .btn {
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.08);
    color: #e7eaf3;
    padding: 10px 14px;
    cursor: pointer;
    font-weight: 700;
  }
  .btn.ghost { background: transparent; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin-top: 14px;
  }

  .tile {
    text-align: left;
    border-radius: 16px;
    padding: 14px;
    cursor: pointer;
    background: rgba(10, 14, 28, 0.55);
    border: 1px solid rgba(255,255,255,0.14);
    color: #e7eaf3;
  }

  .tile h2 { margin: 0 0 6px; font-size: 18px; }
  .tile p { margin: 0; opacity: 0.85; }

  .tile.admin {
    border-color: rgba(120, 160, 255, 0.35);
    background: rgba(120, 160, 255, 0.12);
  }
</style>
