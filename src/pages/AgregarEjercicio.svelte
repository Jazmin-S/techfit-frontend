<script>
  /**
   * AgregarEjercicio.svelte
   * pantalla para ADMIN donde se agregan ejercicios a la BD.
   */

  // Función para mandar el ejercicio al backend (API)
  import { crearEjercicio } from "../services/api";

  // Cosas para manejar sesión del usuario(obtener al usuario, cerrar sesión y revisar si es admin)
  import { obtenerUsuario, cerrarSesion, esAdmin } from "../services/session";

  // Estas funciones para poder navegar
  export let irALogin;              // nos manda al login
  export let irAGeneral = null;     // opción oara regresar al catálogo general
  export let irAPerfil = null;      // opcional para ir al perfil

  // variables para guardar info del usuario que está logueado
  let usuario = null;
  let autorizado = false; // true si el usuario existe y es admin

  // Variables que que utiliza el formulario
  let tipoUsuario = "general";
  let nombre = "";
  let duracion = "";
  let nivel = "";
  let objetivo = "";
  let recomendaciones = "";
  let videoUrl = "";

  // Para controlar lo que se ve en pantalla
  let cargando = false; // cuando se guarda la variable se pone en true
  let error = "";       // mensaje de error
  let ok = "";          // mensaje de éxito

  // Funcion para convertir el enlace del vídeo y poder mostrar el vídeo.
  function normalizarEmbed(url) {
    // si viene vacio no hacemos nada
    if (!url) return "";

    try {
      // Intentamos entender la URL
      const u = new URL(url);

      // Si el link es corto tipo youtu.be/ID
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      // Sino si el link es normal tipo youtube.com/watch?v=ID
      if (u.hostname.includes("youtube.com") && u.pathname.includes("/watch")) {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      // Sino si ya viene en formato embed, entonces lo dejamos igual
      if (u.hostname.includes("youtube.com") && u.pathname.includes("/embed/")) {
        return url;
      }

      // Si es otro formato, lo dejamos como venía
      return url;
    } catch (e) {
      // Si no se pudo interpretar como URL, igual lo dejamos como está
      return url;
    }
  }

  // Función para el botón volver
  function volver() {
    // Si se puede la opción de ir al general, vamos ahí
    if (irAGeneral) return irAGeneral();

    // Si no, se regresa al login
    if (irALogin) return irALogin();
  }

  // Función para el botón salir
  function salir() {
    // Borra la sesión(localstorage)
    cerrarSesion();

    // Y redireciona al login
    if (irALogin) irALogin();
  }

  // Obtenemos el usuario que accede y verificamos si es admin
  (() => {
    usuario = obtenerUsuario();
    autorizado = !!usuario && esAdmin(usuario);
  })();

  // Funcion para guardar el ejercicio y mandarlo al backennd
  async function guardar(e) {
    e.preventDefault(); // método que evita que el form recargue la página

    // Reiniciamos los mensajes para que no se queden los de antes
    ok = "";
    error = "";

    // Verica si el usuario está autrizada para agregar ejercicios y muestrael mensaje en caso de no estarlo
    if (!autorizado) {
      error = "No autorizado: solo administradores pueden agregar ejercicios.";
      return;
    }

    // Verificacón para asegurar que los campos obligatorios venga llenos
    if (!nombre.trim() || !duracion.trim() || !nivel.trim() || !objetivo.trim()) {
      error = "Completa los campos obligatorios (nombre, duración, nivel, objetivo).";
      return;
    }

    // Activamos el modo guardar
    cargando = true;

    try {
      // Obtenemos el id del usuario
      const userId = usuario?.id ?? usuario?.idUsuario;

      // Armamos los datos que se mandan al backend
      const payload = {
        tipoUsuario,
        nombre: nombre.trim(),
        duracion: duracion.trim(),
        nivel: nivel.trim(),
        objetivo: objetivo.trim(),
        recomendaciones: recomendaciones.trim(),
      };

      // Para el vídeo solo lo mandamos si el admin escribió algo en el campo
      const embed = normalizarEmbed(videoUrl.trim());
      if (embed) {
        // Si el backend no tiene videoUrl puede dar error, entonces lo evitamos así
        payload.videoUrl = embed;
      }

      // Para ver en consola qué se está enviando al backend
      console.log("Enviando payload:", payload, "X-USER-ID:", userId);

      // Mandamos la info al backend
      await crearEjercicio(payload);

      // Mensaje que muestra si se mandó todo sin errores
      ok = "✅ Ejercicio guardado correctamente.";

      // Limpiamos el formulario
      nombre = "";
      duracion = "";
      nivel = "";
      objetivo = "";
      recomendaciones = "";
      videoUrl = "";
      tipoUsuario = "general";
    } catch (err) {
      // Si falló mostramos un mensaje de error y también lo dejamos en consola
      console.error("Error al guardar:", err);
      error = err?.message || "Error al guardar ejercicio.";
    } finally {
      // Pase lo que pase, quitamos el modo guardando
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
          <!-- Este botón solo aparece si nos pasaron la función irAPerfil -->
          <button class="btn ghost" on:click={irAPerfil}>Perfil</button>
        {/if}

        <!-- Botón para volver a la pantalla anterior -->
        <button class="btn ghost" on:click={volver}>Volver</button>

        <!-- Botón para cerrar sesión -->
        <button class="btn danger" on:click={salir}>Salir</button>
      </div>
    </header>

    {#if !autorizado}
      <!-- Si no es admin, no dejamos usar el form -->
      <div class="alert error">
        No autorizado. Inicia sesión con un usuario administrador.
      </div>
    {:else}
      <!-- Mensajes dependiendo la situación -->
      {#if error}
        <div class="alert error">{error}</div>
      {/if}
      {#if ok}
        <div class="alert ok">{ok}</div>
      {/if}

      <!-- cuando se envía el formulario llama a la función de guardar() -->
      <form class="form" on:submit={guardar}>
        <div class="grid">
          <div class="field">
            <label>Tipo de usuario <span class="muted">(catálogo)</span></label>

            <!-- Opciones para seleccionar el tipo de usuario del que se va a guardar el ejercicio -->
            <select bind:value={tipoUsuario}>
              <option value="general">General</option>
              <option value="rehabilitacion">Rehabilitación</option>
              <option value="adulto_mayor">Adulto mayor</option>
            </select>
            <small>Se guarda en BD para filtrar ejercicios por tipo.</small>
          </div>

          <div class="field">
            <label>Nombre del ejercicio <span class="req">*</span></label>

            <!-- Campo del formulario para le nombre del ejercicio y que se guarda en la varible nombre -->
            <input
              type="text"
              bind:value={nombre}
              placeholder="Ej. Caminata suave"
              required
            />
            <small>Nombre corto y claro.</small>
          </div>

          <!-- Campo para definir la duración del ejercicico -->
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

          <!-- Campo del formulario para definir el nivel del ejercicio -->
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

            <!-- Campo para descrir para qué sirve el ejercicio -->
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

          <!-- Campo para pegar el enlace del video -->
          <div class="field full">
            <label>Video de YouTube <span class="muted">(opcional)</span></label>
            <input
              type="text"
              bind:value={videoUrl}
              placeholder="Pega el enlace del videro de Youtube"
            />
            <small>
              Puedes pegar: youtu.be/ID o youtube.com/watch?v=ID. Se convertirá a formato embed.
            </small>

            {#if videoUrl.trim()}
              <!-- Si se puso un video valido mostramos una vista previa -->
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
          <!-- Desactivamos el botón mientras está guardando el ejercicio -->
          <button class="btn primary" type="submit" disabled={cargando}>
            {#if cargando}Guardando...{:else}Guardar ejercicio{/if}
          </button>
        </div>
      </form>
    {/if}
  </section>
</main>

<style>
  /* Estilos generales del body */
  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: radial-gradient(1200px 600px at 20% 10%, #1a2440 0%, #0b0f1a 45%, #070914 100%);
    color: #f1f1ff;
    min-height: 100vh;
  }

  /* Centramos todo en pantalla */
  .app {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  /* La “tarjeta” donde va todo el contenido de c/ejercicio */
  .card {
    width: min(1100px, 100%);
    background: rgba(15, 15, 30, 0.80);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 22px;
    padding: 22px 22px 26px;
    box-shadow: 0 20px 50px rgba(0,0,0,.55);
    backdrop-filter: blur(16px);
  }

  /* Estilos del Header */
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

  /* Botones de arriba */
  .top-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  /* Botón base */
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

  /* Botón principal */
  .btn.primary {
    background: linear-gradient(135deg, #1c99ff, #46e6b0);
    border: none;
    color: #0b0f1a;
  }

  .btn.primary:hover { filter: brightness(1.06); }

  /* Botón de peligro (salir) */
  .btn.danger {
    border-color: rgba(255, 120, 120, .60);
    background: rgba(255, 80, 80, .10);
    color: #ffc2c2;
  }

  .btn.ghost {
    border-color: rgba(255,255,255,.14);
  }

  /* Cajitas de mensaje (error/ok) */
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

  /* Grid para poner 2 columnas en pantallas grandes */
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

  /* Estilo de inputs */
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

  /* Botón de guardar */
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 18px;
  }

  /* preview del video */
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

  /* video en formato 16:9 */
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

  /* Cuando la pantalla es pequeña el form se vuelve de 1 columna */
  @media (max-width: 820px) {
    .grid { grid-template-columns: 1fr; }
    .brand { font-size: 32px; }
  }
</style>
