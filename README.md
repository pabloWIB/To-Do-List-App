# JS To-Do

To-do list that survives a page reload, using `localStorage` and no dependencies.

[![Live demo](https://img.shields.io/badge/demo-jstodo.wib.digital-2ea44f)](https://jstodo.wib.digital)
[![Hire me on Fiverr](https://img.shields.io/badge/Hire%20me%20on-Fiverr-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white)](https://www.fiverr.com/pablonietop)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![Build step](https://img.shields.io/badge/build%20step-none-lightgrey)

## Description

A to-do list is the standard exercise for learning state, and most versions skip the part that makes one usable: the tasks are gone on refresh. This one persists. Every add, toggle and delete is written to `localStorage` immediately and read back on load, so closing the tab and returning leaves the list exactly as you left it — including which tasks were already ticked off.

The task array is the single source of truth. Each mutation writes to storage and repaints the list from the array, which is what keeps the DOM and the stored state from drifting apart. Reads are defensive: corrupt JSON, a non-array payload or a browser that blocks storage in private mode all degrade to an empty list instead of a broken page.

There is no framework and no CDN script. The interface is in Spanish.

## Features

- Tasks, and their completed state, persist across reloads and browser restarts.
- Every change is written immediately — nothing depends on the tab closing cleanly.
- Add, complete, delete, and clear all completed tasks at once.
- Reads the legacy storage format (a plain array of strings) and migrates it on load, so lists saved by earlier versions are not lost.
- Keyboard operable end to end, with a visible focus ring and 44×44 px touch targets.
- No dependencies at all — not even a CDN script tag.

## Tech stack

| Layer | Technology | Role in project |
|---|---|---|
| Markup | HTML5 | `index.html` and `404.html` |
| Styling | CSS3 custom properties | 651 lines across three files, no preprocessor |
| Scripting | JavaScript (vanilla, ES2015+) | 300 lines in `assets/js/main.js` |
| Persistence | `localStorage` | Task list storage, key `listaTareas` |
| Typography | Inconsolata via Google Fonts | Single family, `font-display: swap` |

## Project structure

```
.
├── index.html               # The application: form, task list, footer
├── 404.html                 # Error page, links back to index.html
├── robots.txt               # Allows all crawlers, points to the sitemap
├── sitemap.xml              # Single URL: the site root
├── assets/
│   ├── css/
│   │   ├── base.css         # Design tokens, reset, typography, utilities
│   │   ├── layout.css       # Container, header, main, footer, error page
│   │   └── components.css   # Buttons, form, task list, empty state
│   ├── js/
│   │   └── main.js          # Whole application, wrapped in an IIFE
│   └── img/
│       └── logo/
│           ├── favicon.png    # 32×32, browser tab
│           ├── js-to-do.png   # 512×512, og:image and apple-touch-icon
│           └── wib.png        # 96×96, author mark in the footer
└── docs/
    ├── auditoria.md         # State of the project before the reorganisation
    └── cambios.md           # Change log, grouped by phase
```

## Running it locally

Every path in the project is relative, so opening the file works:

```bash
git clone https://github.com/pabloWIB/To-Do-List-App.git
cd To-Do-List-App
```

Then open `index.html` in a browser, or serve the folder if you prefer a real origin:

```bash
npx serve .
```

A server is not required — there is no build, no bundler and no module loading that would need one. Note that `localStorage` on `file://` is shared across all local files, while over HTTP it is scoped to the origin, so the two contexts show different lists.

## Data and storage

Everything lives in the visitor's browser under the key `listaTareas`, as an array of `{ text, done }` objects. There is no server, no account and no network request carrying task data.

To inspect or clear the stored list from the browser console:

```javascript
// Read what is stored
JSON.parse(localStorage.getItem("listaTareas"));

// Start over
localStorage.removeItem("listaTareas");
location.reload();
```

Because storage is per-origin and per-browser, the list does not follow the user to another device or another browser.

## Deployment

Deployed on Vercel at [jstodo.wib.digital](https://jstodo.wib.digital). Static: upload the repository root as-is, no build command and no output directory. `404.html` is picked up automatically for unknown paths. Each visitor's list lives in their own browser.

## Author

**Pablo Nieto Pérez** — [wib.digital](https://wib.digital)
GitHub: [@pabloWIB](https://github.com/pabloWIB)

## Hire me

I build **custom internal tools, CRMs and dashboards** for small teams, and
**conversion-focused websites** for businesses.

- [Custom internal tool, CRM or dashboard](https://www.fiverr.com/pablonietop/build-a-custom-internal-app-for-your-business) — from $45
- [Conversion-focused website](https://www.fiverr.com/pablonietop/convert-your-landing-page-design-to-code) — from $80
- [All my services on Fiverr](https://www.fiverr.com/pablonietop)
- [wib.digital](https://wib.digital)
