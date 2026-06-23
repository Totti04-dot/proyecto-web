/* ============================================================
   Tareas · Organizador de Tareas — Lógica de la aplicación
   Solo comportamiento. DOM + eventos + validación.
   ============================================================ */

(() => {
  "use strict";

  /* ---------- Constantes ---------- */
  const URGENT_WINDOW_DAYS = 7; // Ventana máxima para tareas de prioridad Alta.
  // Permite letras (con tildes y ñ), números, espacios y signos básicos, entre 3 y 60 caracteres.
  const TITLE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,\s]{3,60}$/;

  /* ---------- Referencias al DOM ---------- */
  const form = document.getElementById("taskForm");
  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const listEl = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const titleCounter = document.getElementById("counter-title");
  const deadlineHint = document.getElementById("hint-deadline");

  // Campos del formulario y sus contenedores de error asociados.
  const fields = {
    title: document.getElementById("title"),
    category: document.getElementById("category"),
    priority: document.getElementById("priority"),
    deadline: document.getElementById("deadline"),
  };
  const errors = {
    title: document.getElementById("error-title"),
    category: document.getElementById("error-category"),
    priority: document.getElementById("error-priority"),
    deadline: document.getElementById("error-deadline"),
  };

  // Resumen superior.
  const summaryPending = document.getElementById("summaryPending");
  const summaryDone = document.getElementById("summaryDone");
  const summaryUrgent = document.getElementById("summaryUrgent");

  /* ---------- Estado en memoria (persistencia se agrega en un paso posterior) ---------- */
  let tasks = [];         // Lista de tareas, vive solo en memoria por ahora.
  let editingId = null;   // ID de la tarea en edición (null = creando una nueva).

  /* ============================================================
     UTILIDADES
     ============================================================ */

  // Fecha de hoy en formato YYYY-MM-DD para comparar con el input date.
  function today() {
    return new Date().toISOString().split("T")[0];
  }

  // Suma días a una fecha YYYY-MM-DD y devuelve YYYY-MM-DD.
  function addDays(dateStr, days) {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  function formatDate(value) {
    const [y, m, d] = value.split("-");
    return `${d}-${m}-${y}`;
  }

  /* ============================================================
     VALIDACIÓN
     Cada validador devuelve "" si es válido, o el mensaje de error.
     ============================================================ */

  // Regla 1 (requerido) + Regla 2 (formato/regex) + Regla 3 (longitud).
  function validateTitle(value) {
    const v = value.trim();
    if (!v) return "El título es obligatorio.";
    if (v.length < 3) return "Usa al menos 3 caracteres.";
    if (v.length > 60) return "Máximo 60 caracteres.";
    if (!TITLE_REGEX.test(v)) return "Solo letras, números, espacios y puntuación básica.";
    return "";
  }

  function validateCategory(value) {
    if (!value) return "Elige una categoría.";
    return "";
  }

  function validatePriority(value) {
    if (!value) return "Elige una prioridad.";
    return "";
  }

  // Regla 5 (regla de negocio propia): la fecha límite no puede ser anterior a hoy.
  // Regla 4 (validación cruzada): las tareas de prioridad Alta deben vencer pronto.
  function validateDeadline(value, priorityValue) {
    if (!value) return "Define una fecha límite.";
    if (value < today()) return "La fecha no puede ser anterior a hoy.";
    if (priorityValue === "Alta" && value > addDays(today(), URGENT_WINDOW_DAYS)) {
      return `Las tareas de prioridad Alta deben vencer en máximo ${URGENT_WINDOW_DAYS} días.`;
    }
    return "";
  }

  // Pinta el resultado de un campo: clase válida/ inválida + mensaje debajo.
  function paintField(key, message) {
    const input = fields[key];
    const errorEl = errors[key];
    errorEl.textContent = message;
    input.classList.toggle("is-invalid", Boolean(message));
    input.classList.toggle("is-valid", !message && input.value !== "");
    return !message;
  }

  // Valida todo el formulario y devuelve true solo si cada campo pasa.
  function validateForm() {
    const results = [
      paintField("title", validateTitle(fields.title.value)),
      paintField("category", validateCategory(fields.category.value)),
      paintField("priority", validatePriority(fields.priority.value)),
      paintField(
        "deadline",
        validateDeadline(fields.deadline.value, fields.priority.value)
      ),
    ];
    return results.every(Boolean);
  }

  // Actualiza el texto de ayuda bajo la fecha según la prioridad elegida.
  function updateDeadlineHint() {
    deadlineHint.textContent =
      fields.priority.value === "Alta"
        ? `Prioridad Alta: la fecha límite debe estar dentro de los próximos ${URGENT_WINDOW_DAYS} días.`
        : "";
  }

  /* ============================================================
     RENDERIZADO (manipulación dinámica del DOM)
     ============================================================ */

  // Construye una tarjeta de tarea con createElement y la devuelve.
  function createTaskCard(task) {
    const overdue = !task.done && task.deadline < today();

    const li = document.createElement("li");
    li.className = "task" + (task.done ? " task--done" : "");
    li.dataset.id = task.id;

    // Bloque principal: checkbox + título + etiquetas.
    const head = document.createElement("div");
    head.className = "task__head";

    const main = document.createElement("div");
    main.className = "task__main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task__checkbox";
    checkbox.checked = task.done;
    checkbox.dataset.action = "toggle";
    checkbox.setAttribute("aria-label", "Marcar tarea como completada");

    const info = document.createElement("div");
    info.innerHTML = `
      <p class="task__title">${task.title}</p>
      <div class="task__tags">
        <span class="task__tag">${task.category}</span>
        <span class="task__priority task__priority--${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
    `;

    main.append(checkbox, info);

    const deadline = document.createElement("span");
    deadline.className = "task__deadline" + (overdue ? " task__deadline--overdue" : "");
    deadline.textContent = (overdue ? "Vencida: " : "Vence: ") + formatDate(task.deadline);

    head.append(main, deadline);

    // Acciones: editar y eliminar.
    const actions = document.createElement("div");
    actions.className = "task__actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "icon-btn";
    editBtn.dataset.action = "edit";
    editBtn.textContent = "Editar";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "icon-btn icon-btn--danger";
    deleteBtn.dataset.action = "delete";
    deleteBtn.textContent = "Eliminar";

    actions.append(editBtn, deleteBtn);

    // Inserta las piezas en la tarjeta.
    li.append(head, actions);
    return li;
  }

  // Vuelve a dibujar la lista completa y actualiza el resumen.
  function render() {
    listEl.innerHTML = "";

    if (tasks.length === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      tasks.forEach((task) => listEl.append(createTaskCard(task)));
    }
    updateSummary();
  }

  function updateSummary() {
    const pending = tasks.filter((t) => !t.done).length;
    const done = tasks.filter((t) => t.done).length;
    const urgent = tasks.filter((t) => !t.done && t.priority === "Alta").length;

    summaryPending.textContent = String(pending);
    summaryDone.textContent = String(done);
    summaryUrgent.textContent = String(urgent);
  }

  /* ============================================================
     MANEJADORES DE EVENTOS
     ============================================================ */

  // Evento 1: submit del formulario (con preventDefault).
  function handleSubmit(event) {
    event.preventDefault(); // Nunca recarga la página si hay datos inválidos.

    if (!validateForm()) return; // Si algo falla, no continúa.

    const data = {
      title: fields.title.value.trim(),
      category: fields.category.value,
      priority: fields.priority.value,
      deadline: fields.deadline.value,
    };

    if (editingId) {
      // CRUD: actualizar registro existente (conserva el estado "done").
      tasks = tasks.map((t) => (t.id === editingId ? { ...t, ...data } : t));
      exitEditMode();
    } else {
      // CRUD: crear registro nuevo.
      data.id = Date.now().toString();
      data.done = false;
      tasks.push(data);
    }

    render();
    form.reset();
    clearFieldStates();
    updateCounter();
    updateDeadlineHint();
  }

  // Evento 2: input en el título (validación en vivo + contador de caracteres).
  function handleTitleInput() {
    updateCounter();
    paintField("title", validateTitle(fields.title.value));
  }

  // Evento 3: change en la prioridad (actualiza la ayuda y revalida la fecha cruzada).
  function handlePriorityChange() {
    paintField("priority", validatePriority(fields.priority.value));
    updateDeadlineHint();
    if (fields.deadline.value) {
      paintField("deadline", validateDeadline(fields.deadline.value, fields.priority.value));
    }
  }

  // Evento 4: click delegado sobre la lista (completar / editar / eliminar).
  function handleListClick(event) {
    const target = event.target;
    const card = target.closest(".task");
    if (!card) return;
    const id = card.dataset.id;

    if (target.dataset.action === "toggle") {
      tasks = tasks.map((t) => (t.id === id ? { ...t, done: target.checked } : t));
      render();
      return;
    }

    const button = target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "delete") {
      tasks = tasks.filter((t) => t.id !== id);
      card.remove(); // Destruye el elemento del DOM individualmente.
      if (tasks.length === 0) emptyState.hidden = false;
      updateSummary();
      if (editingId === id) exitEditMode(); // Por si se borraba lo que se editaba.
    } else if (button.dataset.action === "edit") {
      enterEditMode(id);
    }
  }

  function handleCancel() {
    exitEditMode();
    form.reset();
    clearFieldStates();
    updateCounter();
    updateDeadlineHint();
  }

  /* ============================================================
     MODO EDICIÓN
     ============================================================ */

  function enterEditMode(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    editingId = id;
    fields.title.value = task.title;
    fields.category.value = task.category;
    fields.priority.value = task.priority;
    fields.deadline.value = task.deadline;

    submitBtn.textContent = "Actualizar tarea";
    cancelBtn.hidden = false;
    updateCounter();
    updateDeadlineHint();
    fields.title.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exitEditMode() {
    editingId = null;
    submitBtn.textContent = "Guardar tarea";
    cancelBtn.hidden = true;
  }

  /* ============================================================
     AYUDANTES DE INTERFAZ
     ============================================================ */

  function updateCounter() {
    titleCounter.textContent = `${fields.title.value.length}/60`;
  }

  function clearFieldStates() {
    Object.keys(fields).forEach((key) => {
      fields[key].classList.remove("is-invalid", "is-valid");
      errors[key].textContent = "";
    });
  }

  /* ============================================================
     INICIALIZACIÓN
     ============================================================ */

  function init() {
    render(); // Por ahora arranca siempre vacío (sin persistencia).
    updateCounter();

    // Registro de eventos con addEventListener (varios tipos distintos).
    form.addEventListener("submit", handleSubmit);
    fields.title.addEventListener("input", handleTitleInput);
    fields.priority.addEventListener("change", handlePriorityChange);
    listEl.addEventListener("click", handleListClick);
    cancelBtn.addEventListener("click", handleCancel);
  }

  // Arranca cuando el DOM está listo.
  document.addEventListener("DOMContentLoaded", init);
})();
