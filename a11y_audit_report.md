# Auditoría de Accesibilidad Web (WCAG 2.2 AA) — CuscoRent

Este documento presenta una auditoría técnica detallada sobre la accesibilidad a nivel de usuario en los archivos frontend (`Frontend/*.html`) del proyecto CuscoRent (UniStay). 

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility (A11y) | 1/4 | Navegación de pestañas, chips y filtros de búsqueda completamente inaccesibles por teclado (sin `tabindex`/`href`, u ocultos con `display:none`). |
| 2 | Performance | 3/4 | Excelente optimización en subida mediante compresión en canvas. Minimización de dependencias y carga fluida de CSS. |
| 3 | Responsive Design | 3/4 | Buen uso de grid flexible y layouts adaptativos, con algunos targets interactivos ligeramente pequeños en móvil (<44px). |
| 4 | Theming | 3/4 | Excelente centralización de variables y tokens andinos en `Estilos.html`. Pocos colores hardcodeados. |
| 5 | Anti-Patterns | 3/4 | Diseño identitario ("The Andean Hearth") alejado de plantillas cliché de IA, excepto por el uso de elementos de control ocultos. |
| **Total** | | **13/20** | **Acceptable (Se necesita trabajo significativo en Accesibilidad)** |

**Rango de Calificación**: 10-13 Aceptable (Se requiere trabajo correctivo significativo en la dimensión de accesibilidad para evitar barreras a usuarios con discapacidades).

---

## Anti-Patterns Verdict

**Aprobado.** El diseño visual del proyecto CuscoRent no se siente genérico ni como "slop" de IA. La paleta andina con marrón, terracota y piedra está bien integrada en `Estilos.html`. Sin embargo, el método de desarrollo web para ocultar selectores interactivos usando la clase `hidden` de Tailwind junto al selector `peer` introduce un antipatrón crítico de accesibilidad técnica, ya que elimina los elementos de entrada del árbol de accesibilidad (Accessibility Tree) y de la navegación por teclado.

---

## Resumen Ejecutivo

- **Puntaje de Salud de la Auditoría**: 13/20 (Aceptable)
- **Problemas Totales Encontrados**: 7
  - **P0 (Bloqueantes)**: 2 (Impiden completar flujos principales con teclado/lector)
  - **P1 (Mayores)**: 2 (Violación severa de WCAG 2.2 AA)
  - **P2 (Menores)**: 3 (Dificultades y anuncios confusos para lectores de pantalla)
- **Recomendación Principal**: Reemplazar los enlaces interactivos sin `href` por elementos `<button>` nativos o enlaces con `tabindex="0"`, y modificar la visibilidad de los inputs de filtrado para mantener la focusabilidad sin romper el estilo visual.

---

## Detalle de Hallazgos por Gravedad

### [P0] Navegación Inaccesible por Teclado en Menús y Pestañas
- **Ubicación**: 
  - [Estudiante.html:L34-41](file:///d:/Proyecto%20Analisis/Frontend/Estudiante.html#L34-L41) (Menú superior: Explorar, Reservas, Mensajes, Roommates)
  - [Arrendador.html:L41-71](file:///d:/Proyecto%20Analisis/Frontend/Arrendador.html#L41-L71) (Barra lateral de navegación)
  - [PerfilEstudiante.html:L23-31](file:///d:/Proyecto%20Analisis/Frontend/PerfilEstudiante.html#L23-L31) (Navegación de pestañas de perfil)
- **Categoría**: Accesibilidad / Keyboard Navigation
- **Impacto**: Los usuarios que navegan exclusivamente con el teclado (usando la tecla `Tab`) o lectores de pantalla no pueden acceder a ninguna otra pestaña o sección. Los elementos `<a>` sin atributo `href` no se añaden al orden de tabulación nativo del navegador, por lo que quedan invisibilizados para el teclado.
- **Norma WCAG**: 2.1.1 Keyboard (Level A)
- **Recomendación**: 
  - Cambiar las etiquetas `<a>` por `<button type="button">` si la navegación es puramente a través de eventos JavaScript en la misma página (Single Page style).
  - De no ser posible, añadir `href="#"` (previniendo el evento nativo en JS) o agregar `tabindex="0"` junto con un manejador del evento `keydown` para capturar la tecla `Enter` y `Space`.
- **Comando sugerido**: `$impeccable polish`

---

### [P0] Checkboxes de Filtros Completamente Ocultos (Invisibles al Teclado)
- **Ubicación**:
  - [Estudiante.html:L379-416](file:///d:/Proyecto%20Analisis/Frontend/Estudiante.html#L379-L416) (Filtros de servicios: Wi-Fi, Baño Privado, etc.)
  - [Arrendador.html:L341-362](file:///d:/Proyecto%20Analisis/Frontend/Arrendador.html#L341-L362) (Selector de servicios en formulario de creación)
- **Categoría**: Accesibilidad / Forms
- **Impacto**: Las opciones de filtro y servicios usan inputs estructurados como `<input type="checkbox" class="hidden peer">`. En CSS/Tailwind, `hidden` aplica `display: none !important`. Esto remueve completamente el control interactivo de la navegación por teclado y de las APIs de accesibilidad. Un usuario con discapacidad motriz o visual no podrá filtrar propiedades ni asignar servicios a sus anuncios.
- **Norma WCAG**: 1.3.1 Info and Relationships (Level A), 2.1.1 Keyboard (Level A)
- **Recomendación**:
  - En lugar de `hidden`, usar una clase utilitaria de ocultación visual (`sr-only` o `visually-hidden` definida en `Estilos.html`) que deje el input visible para el navegador y el teclado (con tamaño 1px, opacity 0, absolute position), pero invisible visualmente.
  - Asegurar que al recibir foco el input, el contenedor visual `<label>` o chip refleje un estado `:focus-within` claro.
- **Comando sugerido**: `$impeccable layout`

---

### [P1] Falta de Confinamiento de Foco (Focus Trap) en Ventanas Modales
- **Ubicación**:
  - [Login.html:L151](file:///d:/Proyecto%20Analisis/Frontend/Login.html#L151) (`#registerModal`), [Login.html:L221](file:///d:/Proyecto%20Analisis/Frontend/Login.html#L221) (`#forgotModal`)
  - [Estudiante.html:L331](file:///d:/Proyecto%20Analisis/Frontend/Estudiante.html#L331) (`#filtros-drawer`), [Estudiante.html:L451](file:///d:/Proyecto%20Analisis/Frontend/Estudiante.html#L451) (`#modal-detalles`), [Estudiante.html:L541](file:///d:/Proyecto%20Analisis/Frontend/Estudiante.html#L541) (`#yapeModal`)
- **Categoría**: Accesibilidad / Keyboard Navigation
- **Impacto**: Cuando un modal o drawer de filtros se abre visualmente en pantalla, el teclado no queda confinado dentro de él. Al pulsar `Tab`, el foco continúa navegando en segundo plano por el contenido principal invisible de la página. Esto confunde gravemente a usuarios invidentes o con visión parcial, perdiendo el rastro de la interacción.
- **Norma WCAG**: 2.4.3 Focus Order (Level A)
- **Recomendación**:
  - Implementar la función `trapFocus(modal)` de [Scripts.html:L323](file:///d:/Proyecto%20Analisis/Frontend/Scripts.html#L323) en todos los modales cuando se quite la clase `hidden`.
  - Asegurar que al presionar `Escape`, se cierre el modal activo y se devuelva el foco al elemento que lo abrió inicialmente.
- **Comando sugerido**: `$impeccable harden`

---

### [P1] Modales sin Atributos Semánticos de Diálogo
- **Ubicación**: Todos los contenedores de modales nativos en la interfaz (`#registerModal`, `#forgotModal`, `#filtros-drawer`, `#modal-detalles`, `#yapeModal`, `#messageModal`, `#reviewModal`).
- **Categoría**: Accesibilidad / Semantic HTML
- **Impacto**: Los lectores de pantalla interpretan estos modales como simples divisiones de texto (`<div>`) genéricas integradas en el flujo del documento, en lugar de diálogos emergentes separados. El usuario de lector de pantalla no es consciente del contexto emergente del modal.
- **Norma WCAG**: 4.1.2 Name, Role, Value (Level A)
- **Recomendación**:
  - Agregar `role="dialog"` y `aria-modal="true"` a cada contenedor de modal principal.
  - Vincularlos a sus respectivos títulos mediante el atributo `aria-labelledby="[id-del-titulo]"`.
- **Comando sugerido**: `$impeccable clarify`

---

### [P2] Botones de Icono Único sin Nombre Accesible (Etiqueta ARIA)
- **Ubicación**:
  - [Arrendador.html:L103-106](file:///d:/Proyecto%20Analisis/Frontend/Arrendador.html#L103-L106) (Botón de campana de notificaciones)
  - [Estudiante.html:L174-178](file:///d:/Proyecto%20Analisis/Frontend/Estudiante.html#L174-L178) (Botón de refrescar catálogo)
  - Diversos botones con clases de icono SVG o Google Fonts en la app.
- **Categoría**: Accesibilidad / Screen Reader Support
- **Impacto**: Los lectores de pantalla leen textualmente el nombre del icono ("notifications", "refresh") o el texto crudo del elemento, en lugar del propósito real del botón ("Ver notificaciones", "Recargar propiedades").
- **Norma WCAG**: 4.1.2 Name, Role, Value (Level A)
- **Recomendación**:
  - Agregar `aria-label="Ver notificaciones"` o `aria-label="Recargar catálogo"` a los elementos interactivos `<button>`.
- **Comando sugerido**: `$impeccable clarify`

---

### [P2] Falta de Indicación de Estado ARIA en Selectores Segmentados de Rol
- **Ubicación**:
  - [Login.html:L66-82](file:///d:/Proyecto%20Analisis/Frontend/Login.html#L66-L82) (Selector de rol Estudiante/Arrendador/Admin en Login)
  - [Login.html:L165-174](file:///d:/Proyecto%20Analisis/Frontend/Login.html#L165-L174) (Selector de rol en Registro)
- **Categoría**: Accesibilidad / Screen Reader Support
- **Impacto**: Al pulsar los botones para alternar el rol de acceso, la interfaz cambia visualmente agregando la clase `.active`, pero un usuario ciego no sabrá qué rol está seleccionado actualmente, ya que no se expone semánticamente el estado del control.
- **Norma WCAG**: 4.1.2 Name, Role, Value (Level A)
- **Recomendación**:
  - Modificar las funciones de alternancia de rol en JS para actualizar dinámicamente el atributo `aria-pressed="true"` o `aria-selected="true"` en los botones correspondientes.
- **Comando sugerido**: `$impeccable polish`

---

### [P2] Imágenes Dinámicas sin Atributo Alt Explicito
- **Ubicación**:
  - Renderizado dinámico de tarjetas de propiedad (`listing-card` en [Scripts.html:L624](file:///d:/Proyecto%20Analisis/Frontend/Scripts.html#L624) y [Scripts.html:L597](file:///d:/Proyecto%20Analisis/Frontend/Scripts.html#L597))
- **Categoría**: Accesibilidad / Alt Text
- **Impacto**: Las imágenes de las habitaciones cargadas dinámicamente omiten el atributo `alt` o este es vacío. Los lectores de pantalla leerán el nombre del archivo o la URL larga de Google Drive, resultando en una pésima experiencia de usuario.
- **Norma WCAG**: 1.1.1 Non-text Content (Level A)
- **Recomendación**:
  - Agregar el atributo `alt="${h.Titulo || 'Habitación'}"` en las plantillas HTML concatenadas mediante Javascript.
- **Comando sugerido**: `$impeccable clarify`

---

## Aspectos Positivos Destacados

1. **Enlace de salto al contenido principal**: La inclusión de `<a href="#main-content" class="skip-link">` al inicio de las páginas principales demuestra buenas prácticas de accesibilidad para la navegación por teclado.
2. **Utilidades de foco en Estilos**: Se define `:focus-visible` globalmente con una silueta de gran visibilidad (`outline-offset` y sombra), permitiendo una rápida identificación visual del cursor de teclado.
3. **Optimización de animaciones**: El soporte de `@media (prefers-reduced-motion: reduce)` está correctamente declarado en el sistema de diseño (`Estilos.html:L193-203`), lo cual previene desorientaciones o mareos en usuarios sensibles a los movimientos bruscos.

---

## Próximos Pasos Recomendados

Para remediar las barreras de accesibilidad anteriores, sugerimos ejecutar las correcciones de forma progresiva:

1. **[P0] `$impeccable polish`**: Convertir las pestañas de navegación (menús superior y lateral) de elementos `<a>` vacíos a elementos accesibles (modificando la estructura o agregando `tabindex="0"` y eventos de teclado).
2. **[P0] `$impeccable layout`**: Corregir los checkboxes ocultos bajo Tailwind `hidden peer` para que utilicen la clase `sr-only`, permitiendo que el foco del teclado ingrese correctamente al chip/tarjeta sin romper el aspecto estético.
3. **[P1] `$impeccable harden`**: Ajustar el código JavaScript de apertura y cierre de ventanas modales en `Scripts.html` para incorporar de forma automática el `trapFocus(modal)` y la gestión de la tecla `Escape`.
4. **[P1/P2] `$impeccable clarify`**: Enriquecer los elementos HTML interactivos con etiquetas descriptivas (`aria-label`, `aria-modal="true"`, `role="dialog"` y nombres en imágenes dinámicas).

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `$impeccable audit` after fixes to see your score improve.
