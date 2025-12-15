# TECHFIT – Frontend

Este repositorio contiene el **frontend del sistema TECHFIT**, desarrollado como parte del proyecto final de la materia **Desarrollo Web**.  
El frontend está hecho como una **Single Page Application (SPA)** y consume un **backend (Spring Boot)** por medio de una **API REST** (JSON).

**Repositorio del frontend:** https://github.com/Jazmin-S/techfit-frontend

---

## Tecnologías utilizadas

- **Svelte 5**
- **Vite**
- **JavaScript (ES Modules)**
- **HTML5 + CSS**
- **Fetch API** para consumo de servicios REST

---

## Requisitos previos

- **Node.js** 18+ (recomendado)
- **npm**

Verificación rápida:

```bash
node -v
npm -v
```

---

## Ejecución en local del proyecto (frontend)

1) Clonamos el repositorio:

```bash
git clone https://github.com/Jazmin-S/techfit-frontend.git
cd techfit-frontend
```

2) Instalamos dependencias:

```bash
npm install
```

3) Levantamos el entorno de desarrollo:

```bash
npm run dev
```

4) Abrimos en el navegador:

- http://localhost:5173/

---

## Scripts disponibles

```bash
npm run dev      # servidor de desarrollo (Vite)
npm run build    # build de producción (genera dist/)
npm run preview  # preview local del build
```

---

## Configuración de conexión con el backend

El frontend consume el backend usando `fetch`. La URL base se define en:

```
src/services/api.js
```

Ahí se encuentra una constante de la URL:

```js
const BASE_URL = "https://<TU-BACKEND-DEPLOY>.com";
```

### Backend local

Si el backend corre localmente, normalmente se apunta a:

```js
http://localhost:8080
```

> Nota: el backend debe permitir **CORS** para que el frontend pueda consumirlo.

---

## Despliegue en la nube (GitHub Pages)

Como es una SPA, al compilar se generan archivos estáticos en `dist/`, y eso es lo que se publica.

### 1) Build de producción

```bash
npm run build
```

Esto genera:

- `dist/` (archivos finales del frontend)

### 2) Publicación en GitHub Pages 

Publicamos nuestro proyecto en GitPages dentro del mismo repositorio siguiendo estos pasos:

1. Ejecutamos `npm run build`.
2. Subimos el contenido de `dist/` a la rama `main` .
3. En el GitHub del repositorio vamos a:
   - Settings -> Pages -> Source -> `/root`.

### URL del frontend

Logramos conseguir levantar el sitio en GitHub Pages, resultando en este url para proyecto:

- https://jazmin-s.github.io/techfit-frontend/

---

## Arquitectura del frontend

El frontend está organizado por capas para mejor manejo el proyecto:

- **pages/**: pantallas completas (login, registro, perfil, catálogos, admin)
- **components/**: componentes reutilizables
- **services/**: integración (API + sesión)

La navegación se maneja como SPA (sin recarga) desde `App.svelte` mediante estado y render condicional.

---

## Sesión y roles

La sesión se maneja desde el frontend usando `localStorage`:

- Key: `usuario`

La lógica está centralizada en:

- `src/services/session.js`

Esto nos permitió:
- Mantener la sesión al recargar la página
- Distinguir rol (admin/usuario)
- Redirigir a la vista correspondiente

---

## Documentación del código

El proyecto incluye comentarios y estructura modular para que el flujo sea entendible:

- consumo de API (fetch + JSON)
- manejo de sesión y persistencia
- control de vistas/pantallas
- validaciones básicas en formularios