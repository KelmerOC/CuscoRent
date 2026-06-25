# Frontend Refactor Plan — CuscoRent (v2 con Reglas de Negocio Completas)

## Overview

Refactorización integral de todos los archivos HTML de CuscoRent adoptando el sistema de diseño premium de `Cambios_front/`, implementando la paleta andina con Tailwind CSS y Plus Jakarta Sans. Se actualiza el plan anterior para incluir **todas las reglas de negocio omitidas**.

## Regla de Oro (Inquebrantable)
- ✅ Preservar todas las llamadas `google.script.run` con sus parámetros exactos
- ✅ Preservar todas las etiquetas GAS: `<?!= include('...') ?>`, `<?= getScriptUrl() ?>`
- ✅ Preservar todos los `id` de elementos DOM usados por JavaScript
- ✅ Mantener toda la funcionalidad existente

---

## Sistema de Diseño (Basado en `Cambios_front/`)

### Paleta de Colores (Tokens Tailwind)
| Token | Valor | Uso |
|---|---|---|
| `primary` | `#895100` | Acentos principales, botones CTA |
| `primary-container` | `#ff9f1c` | Fondos de acción |
| `secondary` | `#00668a` | Badges, iconos secundarios |
| `outline-variant` | `#dac2ae` | Bordes sutiles |
| `surface` | `#f9f9f9` | Fondo de página |
| `on-surface` | `#1a1c1c` | Texto principal |
| `on-surface-variant` | `#544434` | Texto secundario |

### Tipografía
- **Fuente**: Plus Jakarta Sans (CDN Google Fonts)
- **Iconos**: Material Symbols Outlined

### Componentes Base
- Botones: Pill-shaped (`rounded-full`), con `active:scale-95` y `transition-all`
- Cards: `rounded-[1rem]` con `border border-outline-variant` y `shadow-sm`
- Inputs: Fondo `bg-surface-container-low`, `border-none`, `rounded-full`
- Scrollbar: Personalizado (4-6px, color `#dac2ae`)

---

## Reglas de Negocio por Sección (OBLIGATORIAS)

### 1. Flujo del Estudiante (`Estudiante.html`)
- **Header**: Top Header pegajoso (`sticky top-0`) con buscador central y avatar de usuario a la derecha
- **Vista Catálogo**: Layout split con lista a la izquierda y mapa a la derecha (lg+)
- **Botones de reserva**: Visibles y activos para el Estudiante
- **Acceso al Perfil**: Haciendo clic en su **avatar en el Top Header** → navega a `PerfilEstudiante.html`
- **Detalles de habitación**: Vista premium con galería full-width y sticky sidebar derecho para reserva/contacto (ya NO es modal simple)

### 2. Flujo del Arrendador (`Arrendador.html`) — **MODO COMPETENCIA + DASHBOARD**

> [!IMPORTANT]
> Este es el flujo más complejo y el que más reglas tenía pendientes.

**Vista Inicial (Modo Competencia)**:
- El arrendador ve el **mismo catálogo** que el estudiante, pero con un **Top Header diferente**
- El Top Header del arrendador NO muestra botones de "Reservar/Alquilar"
- El Top Header del arrendador muestra un botón clave: **"Ir a mi Dashboard →"**
- Al hacer clic en "Ir a mi Dashboard", la interfaz cambia completamente a:

**Vista Dashboard (Sidebar Layout)**:
- Reemplaza el header top por una **barra lateral** (`aside` fijo a la izquierda)
- Layout de dos columnas: Sidebar 256px + contenido principal
- La sidebar contiene: logo, navegación por secciones (habitaciones, reservas, mensajes, documentos), info del usuario, botón cerrar sesión
- El contenido principal muestra el panel del arrendador con las secciones ya existentes

### 3. Detalles de Habitación (Modal → Vista Premium)

> [!IMPORTANT]
> La vista de detalles ya NO debe ser el modal antiguo.

**Nuevo diseño para el modal/panel de detalles**:
- **Galería**: Grid de 5 imágenes (1 grande + 4 pequeñas), ocupa todo el ancho
- **Layout**: Dos columnas en desktop (8/12 contenido + 4/12 sidebar sticky)
- **Sidebar derecho sticky**: Muestra precio, calificación, campos de fecha/estadía, botón "Pagar Mensualidad" y botón "Contactar Propietario"
- **Columna izquierda**: Título, descripción del arrendador, descripción del lugar, servicios/amenidades
- El modal existente se adapta para contener este layout sin romper los IDs: `detTitulo`, `detUbicacion`, `detDescripcion`, `detPrecio`, `detCalificacion`, `detServiciosGrid`, `detFotosContainer`

### 4. Chat Unificado (`ChatWEB.html`)

> [!IMPORTANT]
> El chat debe servir para AMBAS comunicaciones.

**Interfaz unificada**:
- **Lista lateral de contactos**: Muestra arrendadores Y roommates en la misma lista
- **Diferenciación visual por rol**: 
  - Badge naranja/amber "Propietario" para conversaciones con arrendadores
  - Badge azul/teal "Roommate" para conversaciones con otros estudiantes
- **Canvas de chat**: Limpio, burbujas diferenciadas por remitente
- **Filtros**: Chips "Todos", "Propietarios", "Roommates"

### 5. Perfiles de Usuario (`PerfilEstudiante.html`)

**Puntos de acceso**:
- **Estudiante**: Clic en su avatar en el Top Header del catálogo → `PerfilEstudiante.html`
- **Arrendador**: A través de las opciones de su sidebar en el Dashboard

**Insignias de verificación**:
- Estudiante: Badge "Estudiante Verificado" (color `secondary-container`)
- Arrendador: Badge "Propietario Verificado" (color `primary-container`)
- Ambos comparten la misma estructura de tarjeta de perfil

---

## Plan de Ejecución por Archivo

### Fase 1: `Estilos.html` — Sistema de Diseño Base
**[MODIFY]** [Estilos.html](file:///d:/Proyecto%20Analisis/Frontend/Estilos.html)
- Añadir configuración de Tailwind con la paleta completa del `Cambios_front/`
- Mantener todas las clases CSS custom existentes (spinner, toast, modal, cards, etc.)
- Añadir scrollbar personalizado y micro-interacciones

### Fase 2: `Estudiante.html` — Vista de Estudiante
**[MODIFY]** [Estudiante.html](file:///d:/Proyecto%20Analisis/Frontend/Estudiante.html)
- Reemplazar sidebar lateral por **Top Header** sticky
- Añadir avatar de usuario (clic → perfil) en el header
- Implementar layout split: lista catálogo (40%) + mapa placeholder (60%) en lg+
- Actualizar modal de detalles a **vista premium** con galería y sticky sidebar
- Preservar TODOS los IDs y llamadas `google.script.run`

### Fase 3: `Arrendador.html` — Modo Competencia + Dashboard
**[MODIFY]** [Arrendador.html](file:///d:/Proyecto%20Analisis/Frontend/Arrendador.html)
- Implementar **dos layouts** en el mismo archivo:
  - `#modo-catalogo`: Top Header con botón "Ir a mi Dashboard"
  - `#modo-dashboard`: Aside sidebar + main content
- Transición entre modos controlada por JS (sin google.script.run)
- Preservar todas las secciones: habitaciones, reservas, mensajes, documentos

### Fase 4: `ChatWEB.html` — Chat Unificado
**[MODIFY]** [ChatWEB.html](file:///d:/Proyecto%20Analisis/Frontend/ChatWEB.html)
- Implementar layout: aside de contactos + canvas principal
- Diferenciar visualmente arrendadores vs roommates con badges

### Fase 5: `PerfilEstudiante.html` — Perfil Premium
**[MODIFY]** [PerfilEstudiante.html](file:///d:/Proyecto%20Analisis/Frontend/PerfilEstudiante.html)
- Adaptar a diseño de `perfil_estudiante_Arrendador` de referencia
- Añadir badge de verificación por rol

### Fase 6: `Login.html` y `Administrador.html`
- Ajuste de clases al nuevo sistema de diseño manteniendo la estructura actual

---

## Validación por Archivo
- [ ] Todos los `google.script.run` preservados con parámetros correctos
- [ ] Tags GAS `<?!= include() ?>` y `<?= getScriptUrl() ?>` preservados
- [ ] Todos los IDs del DOM preservados
- [ ] Diseño responsive (móvil → desktop)
- [ ] Micro-interacciones y transiciones aplicadas