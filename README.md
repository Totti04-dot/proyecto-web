# Tareas

Mini app web hecha con HTML, CSS y JavaScript puro (sin frameworks) para la
Evaluación Final Unidad III de eProgramación Web.

## ¿Qué hace?

Es un organizador de tareas. Agregas una tarea con título, categoría
(Estudio, Trabajo, Personal, Salud, Otro), prioridad (Baja, Media, Alta) y
fecha límite. Después puedes marcarla como completada, editarla o
eliminarla. Arriba se ve un resumen con cuántas tareas tienes pendientes,
completadas y urgentes.


## Cómo probarla

1. Clona o descarga el repositorio.
2. Abre `index.html` en el navegador (doble clic, o "Abrir con" Chrome/Edge/Firefox).
3. Listo, ya puedes agregar tareas.

**Cómo se usa:**
- Llenas el formulario y le das a "Guardar tarea".
- Cada tarea aparece abajo como una tarjeta.
- El checkbox de la izquierda marca la tarea como completada.
- "Editar" carga la tarea en el formulario para modificarla.
- "Eliminar" la borra.
- Si recargas la página, las tareas siguen ahí (se guardan en localStorage).

## Estructura de carpetas

mi-proyecto/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md


## Checklist de lo pedido en la rúbrica

**Estructura y maqueta**
- [x] Proyecto hecho desde cero.
- [x] HTML, CSS y JS en archivos separados (nada de inline ni onclick).
- [x] Carpetas ordenadas (`css/`, `js/`).
- [x] Botones con hover/disabled, espaciado y tipografía consistente.

**DOM y eventos**
- [x] Selecciono elementos con `getElementById` y `querySelector`.
- [x] 4 eventos distintos con `addEventListener`: `submit`, `input`, `change` y `click`.
- [x] Las tarjetas de tareas se crean con `createElement` + `append`, y se borran con `remove()`.

**Formulario y validaciones**
- [x] 4 campos: título, categoría, prioridad y fecha límite.
- [x] 5 validaciones:
  1. Campos requeridos (que no estén vacíos).
  2. El título solo acepta letras, números y signos básicos.
  3. El título debe tener entre 3 y 60 caracteres.
  4. Validación cruzada: si la prioridad es Alta, la fecha límite tiene que ser dentro de los próximos 7 días.
  5. La fecha límite no puede ser anterior a hoy.
- [x] Cada error se muestra debajo de su campo.
- [x] Los campos cambian de color según estén bien o mal.
- [x] Uso `preventDefault()` para que el formulario no se envíe si hay errores.

**Persistencia**
- [x] Uso `localStorage` para guardar las tareas.
- [x] Se recuperan con `getItem()` + `JSON.parse()`.
- [x] Puedo crear, editar, completar y eliminar tareas (CRUD).
- [x] Si no hay nada guardado todavía, no tira error, simplemente muestra la lista vacía.

**Usabilidad**
- [x] Probada en Chrome y Edge, y en modo responsive (DevTools).
- [x] Sin errores en la consola.
- [x] Código separado en funciones chicas con nombres que dicen lo que hacen.

**Git y entrega**
- [x] Repo en GitHub creado para este proyecto.
- [x] Más de 4 commits, cada uno con un avance distinto.
- [x] El README con todo lo pedido.

## Capturas


![Estado vacío](./Capturas/Estado%20vacio.png)


![Validación de errores](./Capturas/Validacion%20de%20errores.png)


![Tarea guardada](./Capturas/Tarrea%20guardada.png)


![Tarea completada](./Capturas/Tarrea%20completada.png)

## Preguntas de cierre

**¿Por qué este tema y cómo influyó en el formulario?**
Porque una lista de tareas es algo simple de entender y de explicar, pero
igual tiene varios datos que pedir con sentido (qué, cuándo, qué tan urgente
y de qué área). La relación entre prioridad y fecha fue la que me dio la
idea para la validación cruzada.

**¿Qué validación fue la más difícil?**
La cruzada entre prioridad y fecha. Tuve que mandarle la prioridad como
parámetro extra a la función que valida la fecha, y revalidar la fecha cada
vez que cambia la prioridad, para que el error se actualice al tiro.

**¿Qué parte del DOM mejoró más la experiencia?**
El checkbox para marcar completada, que tacha el título y actualiza el
resumen de arriba en el momento, sin tener que recargar nada.

**¿Por qué localStorage y qué limitación tiene?**
Porque no necesito servidor ni base de datos, abro el archivo y ya funciona.
La limitación es que los datos quedan guardados solo en ese navegador y ese
computador; si los abro desde otro dispositivo, no van a estar ahí.

**Con 2 horas más, ¿qué le agregarías?**
Filtros por categoría o por estado (pendiente/completada), y ordenar la
lista por la fecha límite más próxima.
