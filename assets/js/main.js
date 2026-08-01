/**
 * JS To-Do
 * Lista de tareas persistida en localStorage. Sin dependencias.
 *
 * El array de tareas es la única fuente de verdad: cada cambio se guarda
 * inmediatamente y la lista se vuelve a pintar a partir de él.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "listaTareas";
  const MAX_LENGTH = 120;

  const TRASH_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">' +
    '<path d="M261-120q-24 0-42-18t-18-42v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Z' +
    'm106-146h60v-399h-60v399Zm166 0h60v-399h-60v399Z"/></svg>';

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const errorBox = document.getElementById("task-error");
  const list = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const counter = document.getElementById("task-count");
  const clearDoneButton = document.getElementById("clear-done");

  if (!form || !input || !errorBox || !list || !emptyState || !counter || !clearDoneButton) {
    return;
  }

  /* ---------------------------------------------------------------------
     Almacenamiento
     --------------------------------------------------------------------- */

  /**
   * Normaliza un elemento guardado. Acepta el formato antiguo (cadenas)
   * y el actual ({ text, done }) para no perder listas ya existentes.
   */
  function normalise(item) {
    const isObject = item !== null && typeof item === "object";
    let raw = "";

    if (typeof item === "string") {
      raw = item;
    } else if (isObject && typeof item.text === "string") {
      raw = item.text;
    }

    const text = raw.trim();

    if (text === "") {
      return null;
    }

    return {
      text: text.slice(0, MAX_LENGTH),
      done: isObject && item.done === true
    };
  }

  function readStorage() {
    let raw;

    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (storageError) {
      return [];
    }

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map(normalise).filter(Boolean);
    } catch (parseError) {
      return [];
    }
  }

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (storageError) {
      showError("El navegador ha bloqueado el almacenamiento: estas tareas no seguirán aquí al recargar.", false);
      return false;
    }
  }

  let tasks = readStorage();

  /* ---------------------------------------------------------------------
     Mensajes de validación
     --------------------------------------------------------------------- */

  function showError(message, markInput) {
    errorBox.textContent = message;
    errorBox.hidden = false;

    if (markInput !== false) {
      input.setAttribute("aria-invalid", "true");
    }
  }

  function clearError() {
    if (errorBox.hidden) {
      return;
    }

    errorBox.textContent = "";
    errorBox.hidden = true;
    input.removeAttribute("aria-invalid");
  }

  /* ---------------------------------------------------------------------
     Pintado
     --------------------------------------------------------------------- */

  function buildItem(task, index) {
    const item = document.createElement("li");
    item.className = task.done ? "task task--done" : "task";
    item.dataset.index = String(index);

    const toggle = document.createElement("label");
    toggle.className = "task__toggle";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task__checkbox";
    checkbox.checked = task.done;
    checkbox.dataset.action = "toggle";

    const text = document.createElement("span");
    text.className = "task__text";
    text.textContent = task.text;

    toggle.appendChild(checkbox);
    toggle.appendChild(text);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "task__delete";
    remove.dataset.action = "delete";
    remove.setAttribute("aria-label", "Borrar la tarea «" + task.text + "»");
    remove.innerHTML = TRASH_ICON;

    item.appendChild(toggle);
    item.appendChild(remove);

    return item;
  }

  function render() {
    const fragment = document.createDocumentFragment();
    let pending = 0;
    let done = 0;

    tasks.forEach(function (task, index) {
      if (task.done) {
        done += 1;
      } else {
        pending += 1;
      }

      fragment.appendChild(buildItem(task, index));
    });

    list.textContent = "";
    list.appendChild(fragment);

    emptyState.hidden = tasks.length > 0;
    counter.textContent = tasks.length === 0
      ? ""
      : pending + (pending === 1 ? " pendiente" : " pendientes") + " de " + tasks.length;

    clearDoneButton.hidden = tasks.length === 0;
    clearDoneButton.disabled = done === 0;
  }

  /* ---------------------------------------------------------------------
     Operaciones sobre la lista
     --------------------------------------------------------------------- */

  function addTask(text) {
    tasks.push({ text: text, done: false });
    persist();
    render();
  }

  function toggleTask(index) {
    const task = tasks[index];

    if (!task) {
      return;
    }

    task.done = !task.done;
    persist();
    render();

    // El nodo original se destruye al repintar: hay que devolver el foco.
    const checkbox = list.querySelectorAll(".task__checkbox")[index];

    if (checkbox) {
      checkbox.focus();
    }
  }

  function removeTask(index) {
    if (!tasks[index]) {
      return;
    }

    tasks.splice(index, 1);
    persist();
    render();

    // Foco al botón que ocupa ahora esa posición, o al último, o al campo.
    const buttons = list.querySelectorAll(".task__delete");
    const next = buttons[index] || buttons[buttons.length - 1];

    if (next) {
      next.focus();
    } else {
      input.focus();
    }
  }

  function clearDone() {
    tasks = tasks.filter(function (task) {
      return !task.done;
    });

    persist();
    render();
    input.focus();
  }

  /* ---------------------------------------------------------------------
     Eventos
     --------------------------------------------------------------------- */

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = input.value.trim();

    if (value === "") {
      showError("Escribe una tarea antes de agregarla.");
      input.focus();
      return;
    }

    clearError();
    addTask(value);
    input.value = "";
    input.focus();
  });

  input.addEventListener("input", clearError);

  list.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action='delete']");

    if (!button) {
      return;
    }

    const item = button.closest(".task");

    if (item) {
      removeTask(Number(item.dataset.index));
    }
  });

  list.addEventListener("change", function (event) {
    const checkbox = event.target.closest("[data-action='toggle']");

    if (!checkbox) {
      return;
    }

    const item = checkbox.closest(".task");

    if (item) {
      toggleTask(Number(item.dataset.index));
    }
  });

  clearDoneButton.addEventListener("click", clearDone);

  render();
})();
