# Auditoría inicial — JS-To-Do

Estado del proyecto **antes** de la reorganización. Documento de trabajo interno.
Fecha: 2026-07-31.

## 1. Archivos HTML

| Archivo | `<title>` | `<h1>` | Propósito real | Estado |
|---|---|---|---|---|
| `index.html` | `WIBINWEB` | `#to-do` | Única página. Formulario para añadir tareas y contenedor de la lista | Funciona, pero el `<title>` es el nombre de la agencia, no el de la app |

No existía `404.html`.

## 2. CSS

| Archivo | Peso | ¿Se carga? | Observaciones |
|---|---|---|---|
| `CSS/normalize.css` | 2,4 KB | Sí (`index.html`) | Normalize minificado en una línea + añadidos propios. Incluye un scrollbar `#BD0003` (rojo) ajeno a la paleta del proyecto y un `img::selection` sin ningún `<img>` en la página |
| `CSS/styles.css` | 1,6 KB | Sí (`index.html`) | Salida compilada de `styles.scss` con prefijos `-webkit-`/`-ms-` para navegadores obsoletos |
| `CSS/styles.scss` | 1,3 KB | No | Fuente Sass. Requiere Prepros para recompilar; ya divergía de la salida (`main { scale: 1.6 }` existe solo en el `.css`) |
| `CSS/prepros.config` | 22,2 KB | No | Configuración del IDE Prepros. Archivo basura: pesa más que todo el código del proyecto junto |

## 3. JavaScript

| Archivo | Peso | ¿Se carga? | Observaciones |
|---|---|---|---|
| `JS/function.js` | 3,1 KB | Sí (`index.html`, sin `defer`) | 80 líneas. Toda la lógica: alta, completado, borrado y persistencia |

Sin `package.json`, sin dependencias, sin paso de build.

## 4. Imágenes

| Archivo | Formato | Dimensiones | Peso | ¿Referenciada? |
|---|---|---|---|---|
| `JS-To-Do.png` | PNG | 1024×1024 | 412,6 KB | Sí — como favicon en `index.html` |
| `IMG/wallpaper.jpg` | JPG | 870×580 | 259,7 KB | No |
| `IMG/icon.png` | PNG | 492×492 | 42,7 KB | No |
| `IMG/trashWhite.svg` | SVG | 48×48 | 262 B | Sí — `background` de `.borrar` en `styles.css` |
| `IMG/trash.svg` | SVG | 48×48 | 247 B | No (duplicado en negro del anterior) |
| `IMG/next.svg` | SVG | 48×48 | 171 B | No |

Total de imágenes en disco: 715,7 KB. Realmente usadas: 412,9 KB, de los cuales 412,6 KB
son un favicon de 1024×1024 que el navegador descarga entero para pintarlo a 16 px.

## 5. Dependencias externas

| Tipo | Recurso | Cómo se cargaba |
|---|---|---|
| Fuente | Google Fonts — Inconsolata | `@import url(...)` en la primera línea de `styles.css` |

Sin CDNs de librerías, sin jQuery, sin frameworks.

## 6. Archivos basura

| Archivo | Motivo |
|---|---|
| `CSS/prepros.config` | Configuración de un IDE concreto, irrelevante para el proyecto |

Sin `.bak`, sin `copia de`, sin `node_modules`, sin `.DS_Store`, sin `Thumbs.db`.
Tampoco existía `.gitignore`, `robots.txt` ni `sitemap.xml`.

## 7. Enlaces y referencias rotas

| Comprobación | Resultado |
|---|---|
| `href` a archivos inexistentes | Ninguno (la página no tenía ni un solo enlace) |
| `src` de imágenes inexistentes | Ninguno |
| `<link>` / `<script>` a archivos inexistentes | Ninguno |
| Imágenes huérfanas en disco | 4 de 6 (`wallpaper.jpg`, `icon.png`, `trash.svg`, `next.svg`) |

## 8. CSS duplicado, muerto o problemático

| Regla | Archivo | Problema |
|---|---|---|
| `.etiquetas` | `styles.css`, `styles.scss` | Clase que no aparece en el HTML ni en el JS. CSS muerto |
| `::-webkit-scrollbar { background: #BD0003 }` | `normalize.css` | Rojo que no pertenece a la paleta. Resto de otro proyecto |
| `img::selection` | `normalize.css` | No hay ningún `<img>` en la página |
| `main { scale: 1.6 }` | `styles.css` | Escalado global para simular tamaños. Desborda la ventana en móvil y no se puede corregir con media queries sin pelearse con el `scale` |
| Prefijos `-webkit-box`, `-ms-flexbox`, `-ms-grid` | `styles.css` | Generados para IE10/11, navegadores sin soporte desde 2022 |
| `body main form .haceres > div` | `styles.css` | Selector de 4 niveles |
| `all: unset` en `.tareas`, `.enviar`, `.borrar` | `styles.css` | Elimina también el `outline` de foco: navegación por teclado sin indicador visible |

## 9. HTML duplicado entre páginas

No aplica: el proyecto tenía una sola página.

## 10. Contenido de relleno y restos

| Elemento | Problema |
|---|---|
| `<title>WIBINWEB</title>` | Nombre de la agencia, no de la aplicación |
| `<html lang="en">` | Todo el contenido visible está en español |
| `placeholder="tareas"` | Único texto que identifica el campo; desaparece al escribir |
| `<form action="">` | Atributo vacío |
| `IMG/wallpaper.jpg` | Patrón azul genérico de banco de imágenes, ajeno a la paleta del sitio |

## 11. Accesibilidad

| Comprobación | Resultado |
|---|---|
| `<label>` asociado al input | No existe |
| Foco visible | No (`all: unset` lo borra) |
| Botón de borrar solo con icono | Sin `aria-label` ni texto accesible |
| Contraste `#BF871F` sobre `#1C3D59` | **3,60:1** — falla AA (mínimo 4,5:1) |
| Contraste `#D9D9D9` sobre botón `#BF871F` | **2,22:1** — falla AA con holgura |
| Área táctil del botón de borrar | 15×15 px — muy por debajo de 44×44 px |
| `lang` correcto | No |

## 12. Defectos funcionales encontrados en `JS/function.js`

| # | Defecto | Consecuencia |
|---|---|---|
| 1 | El contenedor de la lista está **dentro** del `<form>` y los botones de borrar no declaran `type` | Cada clic en «borrar» dispara además el `submit` del formulario |
| 2 | El alta y la restauración construyen el botón de borrar de forma distinta: el alta le pone `class="borrar"` (icono), la restauración le pone `textContent = "Borrar"` (texto sin clase) | Tras recargar, las tareas antiguas y las nuevas se ven diferentes en la misma lista |
| 3 | El estado «completada» nunca se guarda | Marcas una tarea, recargas y vuelve a aparecer sin marcar |
| 4 | Al añadir una tarea solo se hace `push` al array; el guardado real ocurre en `beforeunload` | `beforeunload` no se dispara de forma fiable al cerrar pestaña en móvil: se pierden tareas |
| 5 | El borrado localiza la tarea con `indexOf(texto)` | Con dos tareas de texto idéntico se borra siempre la primera, no la que pulsaste |
| 6 | El texto de la tarea se inserta con `textContent`, correcto, pero el `label` no está asociado a su checkbox | Hacer clic en el texto no marca la tarea |
| 7 | `var` en todas las declaraciones, tres variables globales sueltas (`formulario`, `haceres`, `listaTareas`) | Contaminación del ámbito global |
| 8 | `guardarTareas()` se define y solo se llama desde `beforeunload` | La función de guardado no participa en el flujo normal de la app |

## 13. Rendimiento

| Métrica | Valor inicial |
|---|---|
| Peso de la primera carga | ~420 KB, de los cuales 412 KB son el favicon |
| Peticiones bloqueantes de render | 3 (2 CSS + 1 `@import` encadenado a Google Fonts) |
| `<script>` con `defer` | No |
| `preconnect` a `fonts.gstatic.com` | No |

El `@import` de Google Fonts dentro de `styles.css` crea una cadena: el navegador
descarga `styles.css`, lo interpreta, y solo entonces descubre y pide la fuente.

## 14. Credenciales

Búsqueda de tokens, claves y credenciales en todo el proyecto: **ninguna encontrada**.
El proyecto no consume ninguna API.

## Resumen en 5 líneas

1. Es una lista de tareas en JavaScript sin dependencias que guarda el estado en `localStorage`; una sola página, ~80 líneas de JS, interfaz en español.
2. La base funciona y la idea está terminada: se añaden, se marcan y se borran tareas, y sobreviven a una recarga.
3. Lo más grave es que la persistencia depende de `beforeunload`, que en móvil no siempre se ejecuta: se pierden tareas de verdad.
4. Le sigue de cerca la accesibilidad: el texto principal está en 3,60:1 de contraste, no hay `<label>`, no hay foco visible y el botón de borrar mide 15×15 px.
5. El resto es desorden: favicon de 412 KB para pintar 16 px, 4 imágenes que nadie usa, 22 KB de configuración de un IDE y un `scale: 1.6` global que rompe el móvil.
