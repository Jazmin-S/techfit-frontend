<script>
  /**
   * AgregarEjercicio.svelte
   * Panel ADMIN para crear ejercicios en BD.
   *
   * Reglas:
   * - SOLO admin puede crear (backend valida con header X-USER-ID).
   * - El frontend toma el usuario desde localStorage.
   * - Permite capturar un video en formato "embed" de YouTube.
   */

  import { crearEjercicio } from "../services/api";
  import { obtenerUsuario, cerrarSesion, esAdmin } from "../services/session";

  export let irALogin;              // navegación a login (desde App.svelte)
  export let irAGeneral = null;     // opcional: volver al catálogo general
  export let irAPerfil = null;      // opcional: ir a perfil

  // Estado del usuario
  let usuario = null;
  let autorizado = false;

  // Campos del formulario
  let tipoUsuario = "general";
  let nombre = "";
  let duracion = "";
  let nivel = "";
  let objetivo = "";
  let recomendaciones = "";
  let videoUrl = ""; // guardaremos embed: https://www.youtube.com/embed/XXXX

  // UI
  let cargando = false;
  let error = "";
  let ok = "";

  // Helpers
  function normalizarEmbed(url) {
    // Acepta:
    // - https://youtu.be/ID
    // - https://www.youtube.com/watch?v=ID
    // - https://www.youtube.com/embed/ID
    // Y regresa: https://www.youtube.com/embed/ID
    if (!url) return "";

    try {
      const u = new URL(url);

      // youtu.be/ID
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      // youtube.com/watch?v=ID
      if (u.hostname.includes("youtube.com") && u.pathname.includes("/watch")) {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      // youtube.com/embed/ID
      if (u.hostname.includes("youtube.com") && u.pathname.includes("/embed/")) {
        // ya viene embed
        return url;
      }

      // si viene algo raro, lo dejamos igual
      return url;
    } catch (e) {
      // si no es URL válida, lo dejamos igual
      return url;
    }
  }

  function volver() {
    // si existe irAGeneral, volvemos al general, si no, al login
    if (irAGeneral) return irAGeneral();
    if (irALogin) return irALogin();
  }

  function salir() {
    cerrarSesion();
    if (irALogin) irALogin();
  }

  // Carga sesión al montar
  (() => {
    usuario = obtenerUsuario();
    autorizado = !!usuario && esAdmin(usuario);
  })();

  async function guardar(e) {
    e.preventDefault();
    ok = "";
    error = "";

    // seguridad front (igual backend manda 403 si no es admin)
    if (!autorizado) {
      error = "No autorizado: solo administradores pueden agregar ejercicios.";
      return;
    }

    // Validaciones básicas
    if (!nombre.trim() || !duracion.trim() || !nivel.trim() || !objetivo.trim()) {
      error = "Completa los campos obligatorios (nombre, duración, nivel, objetivo).";
      return;
    }

    cargando = true;
    try {
      const userId = usuario?.id ?? usuario?.idUsuario;

      // armamos payload EXACTO como lo espera el backend
      const payload = {
        tipoUsuario,
        nombre: nombre.trim(),
        duracion: duracion.trim(),
        nivel: nivel.trim(),
        objetivo: objetivo.trim(),
        recomendaciones: recomendaciones.trim(),
      };

      // video opcional: si lo capturó, lo normalizamos a embed y lo mandamos
      const embed = normalizarEmbed(videoUrl.trim());
      if (embed) {
        // OJO: si tu backend NO tiene este campo, podría causar 400.
        // Si te llega a dar 400, dime y lo ajustamos backend o lo quitamos temporalmente.
        payload.videoUrl = embed;
      }

      console.log("Enviando payload:", payload, "X-USER-ID:", userId);

      await crearEjercicio(payload);


      ok = "✅ Ejercicio guardado correctamente.";

      // limpiar form
      nombre = "";
      duracion = "";
      nivel = "";
      objetivo = "";
      recomendaciones = "";
      videoUrl = "";
      tipoUsuario = "general";
    } catch (err) {
      console.error("Error al guardar:", err);
      error = err?.message || "Error al guardar ejercicio.";
    } finally {
      cargando = false;
    }
  }
</script>

<main class="app">
  <section class="card">
    <header class="header">
      <div>
        <h1 class="brand">TECHFIT</h1>
        <p class="subtitle">Panel Administrador · Agregar Ejercicio</p>
      </div>

      <div class="top-actions">
        {#if irAPerfil}
          <button class="btn ghost" on:click={irAPerfil}>Perfil</button>
        {/if}
        <button class="btn ghost" on:click={volver}>Volver</button>
        <button class="btn danger" on:click={salir}>Salir</button>
      </div>
    </header>

    {#if !autorizado}
      <div class="alert error">
        No autorizado. Inicia sesión con un usuario administrador.
      </div>
    {:else}
      {#if error}
        <div class="alert error">{error}</div>
      {/if}
      {#if ok}
        <div class="alert ok">{ok}</div>
      {/if}

      <form class="form" on:submit={guardar}>
        <div class="grid">
          <div class="field">
            <label>Tipo de usuario <span class="muted">(catálogo)</span></label>
            <select bind:value={tipoUsuario}>
              <option value="general">General</option>
              <option value="rehabilitacion">Rehabilitación</option>
              <option value="adulto_mayor">Adulto mayor</option>
            </select>
            <small>Se guarda en BD para filtrar ejercicios por tipo.</small>
          </div>

          <div class="field">
            <label>Nombre del ejercicio <span class="req">*</span></label>
            <input
              type="text"
              bind:value={nombre}
              placeholder="Ej. Caminata suave"
              required
            />
            <small>Nombre corto y claro.</small>
          </div>

          <div class="field">
            <label>Duración <span class="req">*</span></label>
            <input
              type="text"
              bind:value={duracion}
              placeholder="Ej. 15 minutos / 3 series de 10"
              required
            />
            <small>Ejemplo: 10 min, 3 series, 20 repeticiones.</small>
          </div>

          <div class="field">
            <label>Nivel <span class="req">*</span></label>
            <input
              type="text"
              bind:value={nivel}
              placeholder="Ej. Básico / Intermedio"
              required
            />
            <small>Útil para orientar al usuario.</small>
          </div>

          <div class="field full">
            <label>Objetivo <span class="req">*</span></label>
            <textarea
              rows="3"
              bind:value={objetivo}
              placeholder="¿Qué busca lograr este ejercicio?"
              required
            ></textarea>
            <small>Ejemplo: mejorar movilidad, fuerza, resistencia.</small>
          </div>

          <div class="field full">
            <label>Recomendaciones <span class="muted">(opcional)</span></label>
            <textarea
              rows="3"
              bind:value={recomendaciones}
              placeholder="Consejos de seguridad, postura, respiración, etc."
            ></textarea>
          </div>

          <div class="field full">
            <label>Video de YouTube <span class="muted">(opcional)</span></label>
            <input
              type="text"
              bind:value={videoUrl}
              placeholder="Pega link normal o youtu.be (yo lo convierto a embed)"
            />
            <small>
              Puedes pegar: youtu.be/ID o youtube.com/watch?v=ID. Se convertirá a formato embed.
            </small>

            {#if videoUrl.trim()}
              <div class="preview">
                <div class="preview-title">Vista previa</div>
                <div class="video-wrapper">
                  <iframe
                    src={normalizarEmbed(videoUrl.trim())}
                    title="Video de ejercicio"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" type="submit" disabled={cargando}>
            {#if cargando}Guardando...{:else}Guardar ejercicio{/if}
          </button>
        </div>
      </form>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: radial-gradient(1200px 600px at 20% 10%, #1a2440 0%, #0b0f1a 45%, #070914 100%);
    color: #f1f1ff;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .card {
    width: min(1100px, 100%);
    background: rgba(15, 15, 30, 0.80);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 22px;
    padding: 22px 22px 26px;
    box-shadow: 0 20px 50px rgba(0,0,0,.55);
    backdrop-filter: blur(16px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255,255,255,.08);
    margin-bottom: 18px;
  }

  .brand {
    margin: 0;
    font-size: 40px;
    letter-spacing: .08em;
    font-weight: 800;
  }

  .subtitle {
    margin: 6px 0 0;
    color: rgba(255,255,255,.70);
  }

  .top-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn {
    border: 1px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.06);
    color: #f1f1ff;
    padding: 10px 14px;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 600;
    transition: .2s ease;
    white-space: nowrap;
  }

  .btn:hover { transform: translateY(-1px); background: rgba(255,255,255,.10); }

  .btn.primary {
    background: linear-gradient(135deg, #1c99ff, #46e6b0);
    border: none;
    color: #0b0f1a;
  }

  .btn.primary:hover { filter: brightness(1.06); }

  .btn.danger {
    border-color: rgba(255, 120, 120, .60);
    background: rgba(255, 80, 80, .10);
    color: #ffc2c2;
  }

  .btn.ghost {
    border-color: rgba(255,255,255,.14);
  }

  .alert {
    padding: 12px 14px;
    border-radius: 14px;
    margin-bottom: 14px;
    border: 1px solid transparent;
  }

  .alert.error {
    background: rgba(255, 80, 80, .10);
    border-color: rgba(255, 80, 80, .25);
    color: #ffbcbc;
  }

  .alert.ok {
    background: rgba(80, 255, 140, .10);
    border-color: rgba(80, 255, 140, .25);
    color: #bfffe0;
  }

  .form { margin-top: 12px; }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field {
    display: grid;
    gap: 8px;
  }

  .field.full { grid-column: 1 / -1; }

  label {
    font-weight: 700;
    color: rgba(255,255,255,.92);
  }

  .muted { color: rgba(255,255,255,.65); font-weight: 500; }

  .req { color: #ff8f8f; }

  input, select, textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.10);
    background: rgba(10,10,20,.55);
    color: #f1f1ff;
    outline: none;
    transition: .2s ease;
  }

  input:focus, select:focus, textarea:focus {
    border-color: rgba(28, 153, 255, .55);
    box-shadow: 0 0 0 3px rgba(28,153,255,.18);
    background: rgba(10,10,20,.70);
  }

  small {
    color: rgba(255,255,255,.62);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 18px;
  }

  .preview {
    margin-top: 10px;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.03);
  }

  .preview-title {
    font-weight: 700;
    margin-bottom: 10px;
    color: rgba(255,255,255,.85);
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    border-radius: 14px;
    overflow: hidden;
  }

  .video-wrapper iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  @media (max-width: 820px) {
    .grid { grid-template-columns: 1fr; }
    .brand { font-size: 32px; }
  }
</style>
