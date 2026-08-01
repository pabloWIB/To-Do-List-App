# Registro de cambios — reorganización

Trabajo local, sin operaciones de git. Estado de partida documentado en
[`auditoria.md`](auditoria.md). Fecha: 2026-07-31.

---

## Fase 1 — Auditoría

- Inventariados los 13 archivos del proyecto: 1 HTML, 4 CSS (solo 2 cargados), 1 JS, 6 imágenes (solo 2 referenciadas) y 1 dependencia externa.
- Medidas de todas las imágenes (formato, dimensiones, peso) y comprobación de referencias con `grep`.
- Documentados 8 defectos funcionales del JavaScript, 7 fallos de accesibilidad y 4 problemas de rendimiento.
- Resultado en `docs/auditoria.md`.

## Fase 2 — Estructura

| Antes | Después |
|---|---|
| `CSS/normalize.css` | absorbido en `assets/css/base.css` |
| `CSS/styles.css` | repartido en `assets/css/{base,layout,components}.css` |
| `CSS/styles.scss` | eliminado |
| `CSS/prepros.config` | eliminado |
| `JS/function.js` | reescrito como `assets/js/main.js` |
| `IMG/trashWhite.svg` | incrustado como SVG inline en `main.js` |
| `IMG/icon.png` (492×492) | `assets/img/logo/wib.png` (96×96) |
| `JS-To-Do.png` (1024×1024) | `assets/img/logo/js-to-do.png` (512×512) + `favicon.png` (32×32) |
| `IMG/wallpaper.jpg`, `IMG/next.svg`, `IMG/trash.svg` | eliminados |

Archivos nuevos: `404.html`, `robots.txt`, `sitemap.xml`, `.gitignore`, `docs/auditoria.md`, `docs/cambios.md`.

Todas las rutas internas quedaron relativas y en minúsculas. Verificado con `grep` que no queda
ninguna ruta absoluta, ninguna ruta de la máquina local ni ninguna referencia a los directorios antiguos.

### Dos desviaciones de la estructura estándar, deliberadas

1. **No hay `assets/js/modules/`.** La estructura pide `main.js` + módulos, pero los módulos ES
   (`<script type="module">`) están bloqueados por CORS al abrir la página con `file://`, y el punto 13.1
   exige que el proyecto funcione abriendo `index.html` directamente. Con ~250 líneas de JavaScript en
   un único dominio funcional, un solo archivo con secciones comentadas es la opción correcta.
   No se crean carpetas vacías.
2. **No hay `assets/css/pages/` ni `assets/fonts/`.** No hay ninguna página con CSS propio y la única
   tipografía se sirve desde Google Fonts. Carpetas vacías descartadas.

## Fase 3 — Higiene

- Eliminado `CSS/prepros.config` (22,2 KB de configuración de un IDE, más que todo el código del proyecto).
- Eliminado `CSS/styles.scss`: sin él el proyecto no tiene paso de compilación, coherente con lo que ya
  anunciaba el README. La fuente Sass ya había divergido de la salida CSS.
- Eliminadas las 4 imágenes que ningún archivo referenciaba, confirmado con `grep` antes de borrar.
- Eliminado `normalize.css`: sustituido por un reset propio dentro de `base.css`. Con él se fue el
  scrollbar rojo `#BD0003`, resto de otro proyecto.
- **Credenciales: ninguna.** El proyecto no consume ninguna API y no había tokens ni claves en el código.
- Formato normalizado en todos los archivos: indentación de 2 espacios, comillas dobles en HTML,
  punto y coma en JS, salto de línea final.

## Fase 4 — Imágenes

- `JS-To-Do.png` pasaba de 1024×1024 y 412 KB para pintarse a 16 px como favicon. Sustituido por
  `favicon.png` de 32×32 y 1,4 KB. **Reducción del 99,7 % en el peso del favicon.**
- Generado `js-to-do.png` de 512×512 (142 KB) para `og:image` y `apple-touch-icon`. No se descarga en
  la carga normal de la página.
- `icon.png` (492×492) redimensionado a `wib.png` de 96×96 (6 KB) y puesto a trabajar como marca del
  autor en el pie, con enlace real a wib.digital.
- Ninguna imagen supera los 200 KB, así que no hizo falta convertir nada a WebP.
- La única imagen del HTML lleva `width`, `height`, `alt` descriptivo y `loading="lazy"` (está bajo el fold).
- No se ha inventado, descargado ni referenciado ninguna imagen que no exista en disco.

## Fase 5 — HTML, SEO y accesibilidad

- `lang="en"` → `lang="es"`: todo el contenido visible está en español.
- `<title>WIBINWEB</title>` → título real y descriptivo de 54 caracteres. Resuelve el «Known issue»
  que el propio README declaraba.
- Añadidos `meta description` (158 caracteres), Open Graph completo, `canonical`, `theme-color` y favicon.
  `og:image` apunta a un archivo que existe de verdad.
- Estructura semántica: `<header>`, `<main>`, `<section>`, `<footer>`, un solo `<h1>`, `<h2>` sin saltos.
- La lista de tareas es ahora un `<ul>` de `<li>`, no un `<div>` de `<div>`.
- El contenedor de la lista sale de dentro del `<form>`: los botones de borrar ya no disparan el submit.
- `<label>` visible asociado al campo de texto; cada tarea es un `<label>` que envuelve su checkbox,
  así que hacer clic en el texto la marca.
- `aria-label` real en cada botón de borrar, con el texto de su tarea.
- `role="alert"` en el mensaje de error y `aria-live="polite"` en el contador.
- Generados `robots.txt` y `sitemap.xml` con la URL real del sitio (jstodo.wib.digital, verificada: 200).
- Creado `404.html` con `noindex`, título y descripción propios y enlace de vuelta al inicio.

### Contraste corregido

| Uso | Antes | Ahora | Ratio |
|---|---|---|---|
| Texto principal | `#BF871F` sobre `#1C3D59` — 3,60:1 | `#e8edf2` sobre `#1c3d59` | **9,58:1** |
| Texto secundario | no existía | `#a7bacd` sobre `#1c3d59` | **5,67:1** |
| Texto del botón | `#D9D9D9` sobre `#BF871F` — 2,22:1 | `#10202e` sobre `#bf871f` | **5,28:1** |
| Enlaces y acentos | — | `#e0ae38` sobre `#1c3d59` | **5,52:1** |
| Mensajes de error | — | `#ff9c94` sobre `#1c3d59` | **5,61:1** |

## Fase 6 — CSS y sistema de diseño

- 25 variables en `:root`: color, espaciado, tipografía, formas, movimiento y medidas de layout.
- La paleta **deriva de la que ya usaba el sitio** (`#1C3D59` navy, `#BF871F` ocre). El ocre de marca se
  conserva para fondos de botón y acentos; para texto se usa una variante aclarada que sí pasa AA.
- Escala de espaciado 4/8/16/24/32/48/64/96. Ningún valor suelto.
- Una sola familia tipográfica (Inconsolata, la original) con escala de 6 tamaños.
- Eliminados: todos los prefijos `-webkit-box`/`-ms-flexbox`/`-ms-grid` para IE, el selector de 4 niveles
  `body main form .haceres > div`, la clase muerta `.etiquetas`, la regla `img::selection` y
  `main { scale: 1.6 }`, que era la causa del desbordamiento en móvil.
- Cero `!important` salvo el de la utilidad `[hidden]`, que es donde debe estar.
- Orden en cada archivo: variables → reset → base → layout → componentes → utilidades → media queries.

## Fase 7 — Responsive

- Mobile-first con `min-width` en 480 / 768 / 1024 / 1440.
- Comprobado en 360, 768, 1024 y 1440 px con la página cargada en iframes de ancho fijo:
  `scrollWidth === clientWidth` en los cuatro. **Sin scroll horizontal en ningún ancho.**
- Medidas reales de las áreas táctiles a 360 px: campo 318×46, botón principal 318×44,
  fila de tarea 249×44, botón de borrar 44×44. Todas cumplen el mínimo.
- `overflow-wrap: anywhere` en el texto de la tarea: una palabra larga no rompe el layout.
- No hay menú móvil porque el sitio tiene una sola página y ninguna navegación. No se ha inventado uno.

## Fase 8 — UX / UI

- La cabecera dice qué es y qué garantiza en una línea: el sitio se entiende de un vistazo.
- Un solo CTA principal por pantalla, «Agregar», con destino real.
- Estados completos en todo lo interactivo: default, hover, focus visible, active. El estado disabled
  existe donde tiene sentido: «Borrar completadas» está deshabilitado mientras no haya ninguna
  completada, y oculto mientras no haya ninguna tarea.
- Transiciones de 180 ms, dentro del rango 150–250. Respetan `prefers-reduced-motion`.
- Estado vacío con texto propio en lugar de una lista en blanco.
- Contador de pendientes derivado de datos reales, anunciado por lectores de pantalla.
- El formulario **funciona de verdad**: no manda nada a ningún servidor, escribe en `localStorage`.
  Valida en el envío, marca el campo con `aria-invalid` y muestra un error concreto.
- Ancho de línea limitado a 68 caracteres.
- Sin gradientes, sin sombras exageradas, sin animaciones gratuitas.

## Fase 9 — JavaScript

Reescrito de 80 a ~250 líneas dentro de un IIFE con `"use strict"`. Cero variables globales, cero `var`.

| Defecto original | Corrección |
|---|---|
| Guardado solo en `beforeunload` (poco fiable en móvil) | `persist()` en cada alta, cambio y borrado. `beforeunload` eliminado |
| El estado «completada» no se guardaba | El modelo pasa a `{ text, done }` y `done` se persiste |
| Borrado por `indexOf(texto)`: con duplicados borraba el equivocado | Borrado por índice del array |
| Alta y restauración construían botones distintos | Un único `buildItem()` para ambos caminos |
| Un listener por cada checkbox y cada botón | Dos listeners delegados en el `<ul>` |
| Sin comprobar la existencia de los elementos | Salida temprana si falta cualquiera de los siete nodos |
| `localStorage` sin protección | `try/catch` en lectura y escritura; en modo privado la app sigue funcionando y avisa |
| JSON corrupto tumbaba la carga | `try/catch` en `JSON.parse` y validación de que sea un array |

- **Migración de datos:** el formato antiguo (array de cadenas) se convierte al leerlo. Verificado en el
  navegador con una lista real guardada por la versión anterior: se restauró correctamente.
- Foco gestionado al borrar: pasa al botón que ocupa esa posición, al último, o al campo de texto.
- El icono de papelera es ahora un SVG inline que hereda `currentColor`, lo que permite estados de
  hover y foco reales. Una petición menos.
- **Cero errores y cero warnings en consola**, comprobado en las dos páginas.

## Fase 10 — Rendimiento

| Métrica | Antes | Ahora |
|---|---|---|
| Peso de la primera carga (propio) | ~420 KB | **32,2 KB** |
| Favicon | 412,6 KB | 1,4 KB |
| Peticiones bloqueantes de render | 3 + cadena `@import` | 3 CSS + 1 CSS de fuente, sin cadena |
| `<script>` | sin `defer` | con `defer` |
| `preconnect` a la fuente | no | sí, a los dos orígenes |
| `font-display` | no declarado | `swap` |

- El `@import` de Google Fonts dentro del CSS se sustituye por `<link rel="preconnect">` + `<link rel="stylesheet">`
  en el `<head>`: se elimina la cadena de descarga que retrasaba la fuente.
- Los 3 archivos CSS suman 13,8 KB. Todos son críticos para el primer pintado, así que se cargan
  normalmente; partirlos en crítico y diferido a esta escala añadiría complejidad sin ganancia medible.
- Ninguna librería. Ninguna dependencia. Ningún paso de build.

## Fase 11 — QA

Verificación en Chrome sobre servidor local, en `index.html` y `404.html`:

- [x] Cada enlace del pie lleva a una URL que responde 200 (wib.digital, github.com/pabloWIB/To-Do-List-App)
- [x] Cada ruta de imagen corresponde a un archivo real en disco
- [x] Cada `<link>` y `<script>` apunta a un archivo que existe
- [x] Cero errores en consola en las dos páginas
- [x] Sin scroll horizontal en 360, 768, 1024 y 1440 px
- [x] Formulario: valida el campo vacío y el campo con solo espacios, muestra el error, lo limpia al escribir
- [x] Alta, marcado, borrado y «borrar completadas» probados con clics reales
- [x] El estado «completada» sobrevive a una recarga completa
- [x] Con dos tareas de texto idéntico se borra la que se pulsa, no la primera
- [x] Foco visible en campo, botones y checkboxes; navegación por teclado completa
- [x] No queda «Lorem ipsum», «TODO» ni texto del template
- [x] Ninguna imagen rota
- [x] Las dos páginas tienen title y description únicos
- [x] `404.html` existe y enlaza al inicio
- [x] No hay credenciales en el código

Dos fallos encontrados durante el QA y corregidos en el momento:

1. El botón «Volver a la lista» del 404 salía subrayado: `.btn` no reseteaba `text-decoration` y la regla
   de `a` se aplicaba. Añadido `text-decoration: none` a `.btn`.
2. `.field__input:focus` llevaba `outline: none`, que anulaba el anillo de foco global (la regla global
   usa `:where()`, de especificidad cero). Eliminado; el campo ya muestra el anillo dorado.

## Fase 12 — Documentación

- `docs/auditoria.md` y `docs/cambios.md` creados.
- `README.md` actualizado: rutas nuevas, comandos nuevos, tabla de stack corregida (ya no hay Sass),
  bloque «Known issues» eliminado porque el problema del `<title>` está resuelto, y corregida la clave de
  `localStorage` del ejemplo de consola, que decía `tareas` cuando el código usa `listaTareas`.

## Fase 13 — Deploy

- Verificado sobre servidor HTTP local en `http://127.0.0.1:3111`.
- Compatibilidad con `file://` verificada por análisis estático: todas las rutas internas son relativas,
  no hay módulos ES, no hay `fetch` ni `XMLHttpRequest`, no hay service worker. No queda ninguna ruta
  absoluta ni ninguna referencia a `C:\Users\...`.
- No se ha creado configuración de hosting: no se indicó destino. El sitio ya está publicado en Vercel
  como estático, que no la necesita.
- No se ha ejecutado ningún despliegue.

---

## Nota sobre git

No se ha ejecutado ningún comando de git en toda la sesión. Todos los cambios son locales.
Conviene revisar que `git status` refleje los archivos eliminados (`CSS/`, `JS/`, `IMG/`, `JS-To-Do.png`)
antes de subirlos.
