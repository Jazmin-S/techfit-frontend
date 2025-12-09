// src/main.js
// Entrada de la app para Svelte 5: usamos `mount` en vez de `new App`.

import "./app.css";
import App from "./App.svelte";
import { mount } from "svelte";

const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;
