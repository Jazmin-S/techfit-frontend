<script>
export let volver; //regresar al catologo

//los campos del formulario
let nombre = "";
let descripcion = "";
let categoria = "General";

function handleSubmit(e){
    e.preventDefault();

    //llamar al Backend
    console.log({nombre,descripcion,categoria})

    alert("ejercicio listo para guardar(mock).");
    //para volver despues de "guardar"
    if(volver) volver();
}

</script>

<main class="app">
  <section class="card">
    <header class="header">
      <div>
        <h1 class="title">Agregar Ejercicio</h1>
        <p class="subtitle">Captura los datos del ejercicio para añadirlo al catálogo.</p>
      </div>
    </header>

    <form class="form" on:submit={handleSubmit}>
      <div class="field">
        <span class="label">Nombre</span>
        <input
          class="input"
          bind:value={nombre}
          placeholder="Ej: Sentadilla"
          required
        />
      </div>

      <div class="field">
        <span class="label">Descripción</span>
        <textarea
          class="textarea"
          bind:value={descripcion}
          placeholder="Cómo se realiza?"
          required
        ></textarea>
      </div>

      <div class="field">
        <span class="label">Categoría</span>
        <select class="select" bind:value={categoria}>
          <option value="General">General</option>
          <option value="Rehabilitacion">Rehabilitación</option>
          <option value="AdultoMayor">Adulto Mayor</option>
        </select>
        <p class="hint">Elige en que categoria se mostrara el ejercicio.</p>
      </div>

      <div class="footer">
        <button class="btn btn-primary" type="submit">Guardar</button>
        <button class="btn btn-danger" type="button" on:click={volver}>
          Cancelar
        </button>
      </div>
    </form>
  </section>
</main>


<style>
/* Fondo y centrado, igual que tus catálogos */
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Tarjeta oscura con blur */
.card {
  width: 100%;
  max-width: 900px;
  background: rgba(15, 15, 30, 0.95);
  border-radius: 18px;
  padding: 1.8rem 1.6rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Título como el estilo Techfit */
.card h1 {
  margin: 0 0 1rem;
  font-size: 1.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Form con separación */
form {
  display: grid;
  gap: 1rem;
  margin-top: 0.5rem;
}

/* select en columna */
select {
  display: grid;
  gap: 0.45rem;
  font-size: 0.9rem;
  color: #ffffffff;
  letter-spacing: 0.02em;
  text-transform: capitalize;
}

/* Inputs/Select/Textarea estilo oscuro */
input,
textarea,
select {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #f1f1ff;
  outline: none;
  font-size: 0.95rem;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

/* Focus estilo “glow” verde */
input:focus,
textarea:focus,
select:focus {
  border-color: rgba(70, 230, 176, 0.55);
  box-shadow: 0 0 0 3px rgba(70, 230, 176, 0.14);
}

/* El contenedor de botones que ya tienes con inline style */
form > div {
  justify-content: flex-end;
  margin-top: 0.6rem;
  flex-wrap: wrap;
}

/* Botones base */
button {
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #f1f1ff;
}

/* Hover general */
button:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* Primer botón (Guardar) en verde */
button[type="submit"] {
  border: 1px solid rgba(125, 255, 120, 0.7);
  background: rgba(80, 255, 80, 0.08);
  color: #b7ffc2;
}

button[type="submit"]:hover {
  background: rgba(80, 255, 80, 0.18);
}

/* Segundo botón (Cancelar) rojo */
button[type="button"] {
  border: 1px solid rgba(255, 120, 120, 0.7);
  background: rgba(255, 80, 80, 0.08);
  color: #ffb7b7;
}

button[type="button"]:hover {
  background: rgba(255, 80, 80, 0.18);
}

/* Responsive */
@media (max-width: 640px) {
  .card {
    padding: 1.4rem 1.1rem;
  }

  form > div {
    justify-content: stretch;
  }

  button {
    width: 100%;
    text-align: center;
  }
}
</style>