# Tareas · Organizador de Tareas

Mini-aplicación web interactiva desarrollada con HTML, CSS y JavaScript puro
(sin frameworks) para la **Evaluación Final Unidad III — eProgramación Web**.

---

## 1. Objetivo y descripción funcional

**Tareas** permite registrar pendientes con un título, una categoría
(Estudio, Trabajo, Personal, Salud, Otro), una prioridad (Baja, Media, Alta)
y una fecha límite. Cada tarea se puede marcar como completada, editar o
eliminar, y un resumen superior muestra cuántas están pendientes, completadas
o son urgentes (prioridad Alta).

Elegí esta temática porque organizar tareas es algo que cualquiera necesita y
tiene una razón natural para pedir varios datos al usuario (qué, cuándo, con
qué urgencia y de qué área). Además, la relación entre **prioridad** y
**fecha límite** permite implementar de forma orgánica la validación cruzada
más exigente de la rúbrica: una tarea de prioridad Alta no puede tener una
fecha límite muy lejana.

---

## 2. Checklist de cumplimiento técnico

### Bloque 1 — Estructura y maqueta
- [x] Proyecto creado desde cero (sin reutilizar evaluaciones anteriores).
- [x] `index.html` con maqueta propia.
- [x] Separación estricta: `.html` (estructura), `.css` (presentación), `.js` (comportamiento).
- [x] Sin CSS inline ni JS en atributos HTML (no se usa `onclick="..."`).
- [x] Estructura de carpetas ordenada (`css/`, `js/`).
- [x] Diseño profesional: jerarquía visual, estados `:hover` y `:disabled`, espaciado y tipografía consistentes.

### Bloque 2 — DOM y eventos
- [x] Selección con `getElementById()` y `querySelector()` / `closest()`.
- [x] Modificación dinámica de texto, atributos y clases CSS.
- [x] **4 tipos de eventos** distintos con `addEventListener()`: `submit`, `input`, `change`, `click`.
- [x] Generación dinámica con `createElement()` + `append()`.
- [x] Eliminación individual con `remove()`.

### Bloque 3 — Formulario y validaciones
- [x] **4 campos** independientes: texto, selección, selección, fecha.
- [x] **5 reglas de validación**:
  1. Campo requerido (título, categoría y prioridad no vacíos).
  2. Formato con **regex** (título: letras, números, espacios y puntuación básica).
  3. Longitud mínima/máxima (3–60 caracteres en el título).
  4. **Validación cruzada**: si la prioridad es "Alta", la fecha límite debe estar dentro de los próximos 7 días.
  5. **Regla de negocio propia**: la fecha límite no puede ser anterior a hoy.
- [x] Mensaje de error específico **debajo** de cada campo (sin `alert()`).
- [x] Retroalimentación visual por clases CSS (`is-valid` / `is-invalid`).
- [x] `event.preventDefault()` en el `submit`.

### Bloque 4 — Datos y persistencia (Opción 1: LocalStorage)
- [x] Guardado con `localStorage.setItem()`.
- [x] Recuperación con `localStorage.getItem()` + `JSON.parse()` seguro.
- [x] CRUD: crear, **completar/editar/actualizar** y **eliminar** registros individuales.
- [x] Caso de borde de LocalStorage vacío manejado sin excepciones en consola.

### Bloque 5 — Usabilidad y calidad
- [x] Probado en 2 navegadores / modo responsive (DevTools).
- [x] Cero errores críticos en consola.
- [x] Código legible: nombres descriptivos, funciones pequeñas, comentarios de contexto.

### Bloque 6 — Versionamiento y entrega
- [x] Repositorio Git en GitHub desde cero.
- [x] Mínimo 4 commits con progresión histórica.
- [x] README con objetivo, checklist, instrucciones, capturas y autoevaluación.

---

## 3. Cómo ejecutar la aplicación

No requiere servidor ni instalación. La persistencia con `localStorage`
funciona directamente desde el sistema de archivos.

**Opción A — abrir el archivo:**
1. Descarga o clona el repositorio.
2. Abre `index.html` con doble clic en Chrome, Edge o Firefox.

**Opción B — servidor local (recomendado para desarrollo):**
```bash
# Con Python instalado:
python -m http.server 8000
# Luego abre http://localhost:8000
```

**Uso:**
- Completa el formulario y presiona **Guardar tarea**.
- Cada tarea aparece como tarjeta con su categoría y prioridad.
- Casilla de la izquierda: marca la tarea como **completada**.
- Botón **Editar**: carga la tarea en el formulario para actualizarla.
- Botón **Eliminar**: borra la tarea individualmente.
- Recarga la página: los datos siguen ahí.

---

## 4. Estructura del proyecto

```
mi-proyecto/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md
```

---

## 5. Capturas de pantalla

> Reemplaza estas líneas por tus capturas reales (arrastra la imagen al editor de
> GitHub o usa `![alt](ruta)`).

- `![Estado inicial vacío](docs/captura-vacio.png)`
- `![Validación de campos](docs/captura-validacion.png)`
- `![Tareas guardadas y persistencia](docs/captura-persistencia.png)`

---

## 6. Autoevaluación contra los 6 criterios institucionales

| Criterio de la rúbrica | Cómo lo cumplo |
|---|---|
| Integración con maqueta y estructura | Maqueta propia, separación HTML/CSS/JS, carpetas ordenadas, sin estilos ni JS inline. |
| DOM y eventos | `createElement`/`append`/`remove`, 4 tipos de eventos con `addEventListener`. |
| Formulario y validaciones | 4 campos, 5 reglas (requerido, regex, longitud, cruzada, negocio propia), errores por campo, `preventDefault`. |
| Datos y persistencia | LocalStorage con CRUD completo y manejo seguro de estado vacío. |
| Usabilidad, compatibilidad y depuración | Responsive, foco visible, sin errores en consola, código modular y comentado. |
| Documentación, Git y comunicación técnica | README completo, commits progresivos, listo para defensa técnica. |

---

## 7. Preguntas de cierre (reflexión)

**1. ¿Por qué esta temática y cómo influyó en el formulario y las validaciones?**
Organizar tareas es algo cotidiano y fácil de explicar: cualquier persona
entiende de inmediato qué es un título, una categoría, una prioridad y una
fecha límite. Esa simpleza es justo lo que permitió implementar con
naturalidad la validación cruzada entre prioridad y fecha límite.

**2. ¿Qué validación fue la más compleja y cómo la resolví?**
La validación cruzada entre prioridad y fecha límite. La resolví pasando el
valor de la prioridad como segundo argumento al validador de la fecha
(`validateDeadline(value, priorityValue)`), y revalidando la fecha cada vez
que el usuario cambia la prioridad (evento `change`), para que el mensaje de
error aparezca de inmediato si la combinación deja de ser válida.

**3. ¿Qué parte de la manipulación del DOM mejoró más la experiencia?**
El checkbox de "completada" que actualiza la tarjeta (tachado del título) y
el resumen superior en tiempo real, junto con el contador de caracteres en
vivo del título (evento `input`), que evita que el usuario escriba de más
antes de enviar.

**4. ¿Por qué LocalStorage y qué limitación tiene?**
Elegí LocalStorage porque funciona sin servidor, ideal para una demo
inmediata. Su limitación intrínseca es que los datos viven solo en ese
navegador y equipo: no se comparten entre dispositivos ni sobreviven si el
usuario limpia los datos del navegador, y solo almacena texto (de ahí el uso
de `JSON.stringify`/`parse`).

**5. Con 2 horas más, ¿qué mejora implementaría?**
Agregaría filtros por categoría, prioridad o estado (pendiente/completada),
orden por fecha límite más próxima, y notificaciones visuales para las
tareas vencidas que aún no se han marcado como completadas.
