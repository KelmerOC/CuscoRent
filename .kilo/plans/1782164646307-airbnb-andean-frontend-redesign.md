# Plan: Rediseño visual estilo Airbnb + identidad andina (CuscoRent)

## Contexto y objetivo

Rediseñar la **apariencia visual** de los 8 archivos de `Frontend/` adoptando los **patrones de UX de Airbnb** (barra de búsqueda hero, chips de filtros, grid de tarjetas con foto grande, página de detalle con galería + panel de reserva fijo), pero con una **paleta andina distintiva** que conserve la identidad de CuscoRent (no clon literal de Airbnb).

Tarea estrictamente **visual**: no se agregan features, no se modifican funciones del backend, no se inventan requisitos. El HTML nuevo de cada `Frontend/` debe contener **únicamente los requerimientos del `Documento`**.

Referencia estructural: `texto plano HTML de pagina de inici.txt` (homepage de Airbnb, minificado → se usa como musa de **estructura/UX**, no se copia su CSS). Calidad guiada por la skill `frontend-design`.

## Decisiones resueltas

1. **Identidad visual**: Patrones Airbnb + paleta andina (terracota, ocre/oro, sage, skyblue, carbón, vino). No clon literal (no rojo Rausch).
2. **Layout/navegación**: Conservar la **barra lateral de rol** existente (convención documentada en `AGENTS.md`) para Estudiante/Arrendador/Admin; aplicar el estilo Airbnb pleno **solo al catálogo "Explorar" y a la página de detalle de habitación**.
3. **Funciones sin backend**: **Omitir** Premium (Fase 3 §Proyecto 8) y verificación RENIEC/SUNAT. Conservar solo lo que ya funciona.

## Decisiones estéticas (skill frontend-design)

- **Tipografía**: `Playfair Display` (display/editorial, continuidad de marca) + `Hanken Grotesk` (body, no genérica). Iconos: Material Symbols (ya en uso).
- **Paleta**: mantener tokens andinos (`--primary #c28e46`, `--secondary/#terracotta #b85151`, `--sage #8fa08e`, `--skyblue #3a82c4`, `--charcoal #211f1d`, `--sidebar #45121a`, `--bglite #faf8f5`, `--border-color #e6dec9`) + añadir escala neutra cálida (superficies `#ffffff`/`#f7f7f7`, muted `#6a6a6a`, líneas `#ebebeb` con tinte cálido).
- **Motion**: un reveal escalonado (`fadeInUp` con `animation-delay` por índice) en el catálogo + hover-lift en tarjetas; mantener `prefers-reduced-motion`.
- **Imágenes**: reemplazar `via.placeholder.com` (caído) por **placeholder de gradiente andino + icono Material** (clase reutilizable `.listing-ph`), cero dependencia externa / CSP-safe. Donde ya fluyen imágenes reales de Drive (perfil, documentos) se conservan los thumbnails. Fotos reales del catálogo = mejora futura (requiere backend, fuera de alcance).
- **Atmósfera**: hero con gradiente mesh andino (amanecer) en vez de color plano; texturas sutiles en cabeceras.

## Restricciones duras (preservar exactamente)

- Sintaxis GAS: `<?!= include('Estilos'); ?>`, `<?!= include('Scripts'); ?>`, `<?= getScriptUrl() ?>`.
- Tailwind CDN (`https://cdn.tailwindcss.com`) + su `tailwind.config` en `Estilos.html` (AGENTS.md advierte posible CSP; mantener tal cual).
- **Toda llamada `google.script.run`**: nombre, argumentos y handlers sin alterar.
- **Todo id de DOM y `onclick`** que el JS dependa: sin renombrar.
- `localStorage` con clave `user`; `APP.currentUser` con IDs de rol (`EstudianteID`/`ArrendadorID`).
- Nombres de columnas de Sheets (dependencias del backend).
- Mock de dev local en `Estudiante.html` (`typeof google === 'undefined'`).
- Sin build/test/lint (runtime GAS). Despliegue manual a GAS.

## Contrato backend a respetar (no modificar)

- **Auth**: `loginUser(email,password,role)`, `registerUser(role,userData)`, `recuperarCuenta(email)`, `actualizarPerfilEstudiante(datos)`, `actualizarPerfilArrendador(datos)`.
- **Hospedajes**: `getHospedajes(filters)`, `getHospedajesPorArrendador(id)`, `getAllHospedajes()`, `crearHabitacion(datos)`, `editarHabitacion(datos)`, `eliminarHabitacion(id)`.
- **Reservas** (ya cableado en `Estudiante.html`): `crearReserva(est,hosp,arr,monto)`, `getReservasPorEstudiante(id)`, `getReservasPorArrendador(id)`, `verificarReservaPrevia(est,hosp)`, `confirmarReserva(id)`.
- **Chat/Reseñas**: `sendMessage(rem,rec,hosp,msg)`, `getMensajesPorArrendador(id)`, `getMensajesPorUsuario(id)`, `getRoommates()`, `addResena(...)` (valida reserva previa), `getResenasPorArrendador(id)`.
- **Admin**: `verificarAdmin(email)`, `getEstadisticasAdmin()`, `getTodosEstudiantes()`, `getTodosArrendadores()`, `eliminarEstudiante(id)`, `eliminarArrendador(id)`.
- **Drive**: `subirImagen(datos)`, `eliminarImagen(fileId)`, `obtenerTodasLasImagenes(role,email)`, `inicializarCarpetasUsuario(role,email)`.

## Orden de implementación (dependencias)

### 1. `Estilos.html` — Sistema de diseño (PRIMERO)
- Revamp de design tokens: paleta andina + escala neutra cálida, tipografía (Playfair + Hanken Grotesk), radius, sombras, tokens de motion.
- Reescribir `tailwind.config` para que las utilidades (`bg-primary`, `text-charcoal`, etc.) coincidan con los tokens.
- Componentes clase-Airbnb: `.card` (image-forward, hover-lift), `.btn`/variantes (pill), inputs, tabs, modal, toast, loader, sidebar-nav, upload-zone, dual-slider, chips.
- Nuevos helpers: `.hero-search`, `.category-chip`, `.listing-card`, `.listing-ph` (placeholder gradiente), `.gallery`, `.booking-panel`, reveal escalonado.
- Preservar accesibilidad: `skip-link`, `:focus-visible`, `prefers-reduced-motion`, `.visually-hidden`.

### 2. `Scripts.html` — Pase visual ligero
- Preservar **toda** la lógica y firmas (APP, toast, loader, modales, tabs, auth, compresión de imagen, file handling, navegación).
- Restylear toast/modal/loader para que usen los nuevos tokens/clases (sin cambiar ids ni handlers).
- **Flag**: tras `mostrarModal(...)` parece haber una `}` suelta (posible error de sintaxis). Verificar que el archivo parsea; conservar comportamiento correcto. No refactorizar `switchMainTab`/`switchAdminTab` duplicados (dejar las versiones por página).

### 3. `Login.html` (§3.2 CU1 login/registro, CU2 recuperación)
- Tarjeta de auth centrada sobre hero andino atmosférico (overlay de gradiente).
- Selector de rol como control segmentado estilo Airbnb; inputs con icono líder y toggle de contraseña; botón pill "Continuar".
- Modales de registro y recuperación restyleados.
- Preservar handlers: `handleLogin`, `handleRegister`, `handleForgot`, `seleccionarRolUI_Login/Reg`, `togglePasswordVisibility`, `iniciarDashboard`, `SCRIPT_URL`, GAS tags.

### 4. `Estudiante.html` — Escaparate Airbnb (§3.2 CU3 búsqueda/filtros+mapa, CU4 detalle/contacto/reseña, CU5 roommates, CU6 pago Yape)
- Sidebar de rol conservado.
- Tab **Explorar**: hero search pill (distrito + precio + tipo replicando los filtros actuales), fila de chips de categoría/filtros, grid de tarjetas image-forward.
- Drawer de filtros restyleado (mapa, slider de precio, chips de tipo/servicios). Preservar ids/lógica: `toggleFiltros`, `updatePriceLabel`, `resetFiltros`, `updateFilterMap`, `aplicarFiltros`, `filtroDistrito`, `filtroPrecio`, `sliderTrack`, `precioMaxLabel`, `filtroTipo`.
- Tarjetas: `.listing-card` con `.listing-ph` (gradiente) en vez de placeholder. Preservar `renderCatalogo`, `cargarCatalogo`, `abrirDetalles`, `hospedajesGlobal`, onclick por `HospedajeID`.
- Modal detalle: layout Airbnb (galería grid + título/ubicación/rating + amenities + descripción + **panel de reserva sticky**). Preservar `currentHospedaje`, `abrirDetalles`, `det*` ids, y los modales/handlers: `openYapeModal`/`handleYapePayment`/`simulateYapeSuccess` (→ `crearReserva`), `openMessageModal`/`handleSendMessage` (→ `sendMessage`), `openReviewModal`/`handleAddReview` (→ `verificarReservaPrevia` + `addResena`), `cerrarDetalles`, `switchYapeTab`.
- Tabs Reservas/Mensajes/Roommates/Documentos: tarjetas restyleadas preservando `cargarMisReservas`, `cargarMensajesEstudiante`, `cargarRoommates`, `cargarImagenesExistentes`/`handleFileSelect`/`switchDocTab` y sus contenedores.
- Conservar el mock dev local de `google.script.run` y el auto-open por `?id=`.

### 5. `Arrendador.html` (§3.2 CU5 gestión de hospedaje CRUD; peticiones de contacto; reseñas)
- Sidebar conservado.
- Tab **Mis Habitaciones**: tarjetas host estilo Airbnb (imagen `.listing-ph`, badge de estado, precio, editar/eliminar). Preservar `cargarMisHabitaciones`, `prepararEdicion`, `cancelarEdicion`, `guardarHabitacion` (→ `crearHabitacion`/`editarHabitacion` + loop `subirImagen` + `compressImage`), `borrarHabitacion`, y todos los ids del formulario (`hTitulo`, `hDistrito`, `hDireccion`, `hTipo`, `hPrecio`, `hServiciosContainer`, `hLatitud`, `hLongitud`, `hDescripcion`, `hFotos`, `hFotosPreview`, `mapPreview`, `updateMapPreview`, `formCrearHabitacion`, `formTitulo`, `btnGuardarHabitacion`).
- Tabs Reservas/Mensajes/Reseñas/Perfil/Verificación: restylear preservando `cargarReservasArrendador`, `cargarMensajes`, `abrirModalRespuesta`/`enviarRespuesta`, `cargarResenas`, `cargarPerfilArrendador`/`guardarPerfilArrendador`, `cargarImagenesExistentes`/`handleFileSelect`/`switchDocTab`.

### 6. `Administrador.html` (§3.1 Actor 3; §1.4 dashboard; moderación)
- Sidebar conservado.
- Dashboard: stat cards limpias estilo Airbnb (icono + número). Preservar `cargarEstadisticas` e ids `stat-*`.
- Tabs Habitaciones/Estudiantes/Arrendadores: tarjetas de moderación restyleadas preservando `renderHabitacionesAdmin`/`renderEstudiantesAdmin`/`renderArrendadoresAdmin`, `eliminarModeracion`, `eliminarEstudianteMod`, `eliminarArrendadorMod`, `switchAdminTab` (versión local).

### 7. `ChatWEB.html` (§2.4 Proyecto 6 chat; §2.4 Proyecto 1 verificación)
- Restyle a mensajería refinada tipo Airbnb (lista de conversaciones + canvas de chat + wizard de verificación).
- Preservar `switchMainTab` (local), `enviarVerificacion`, auto-scroll y auto-resize del textarea.
- **Flag preexistente (no arreglar, fuera de alcance)**: `enviarVerificacion` referencia `verificationEmail` (id inexistente en el markup) y llama `solicitarVerificacion` (sin backend). Mantener tal cual; solo restylear.

### 8. `PerfilEstudiante.html` (gestión de perfil; historial; reseñas propias)
- Restyle tipo perfil Airbnb (tarjeta avatar + stats + tabs Mis Datos/Historial/Reseñas).
- Consolidar el `<style>` inline duplicado de tabs dentro de `Estilos.html` y quitar el inline.
- Preservar `switchTab`, `guardarPerfil` (→ `actualizarPerfilEstudiante`), carga de `localStorage('user')` en `DOMContentLoaded` y todos los ids de input.
- Mantener el contenido demo de Historial/Reseñas (ilustrativo) restyleado.

## Riesgos y mitigaciones

- **Romper el cableado JS**: mitigación = no renombrar ids/handlers/funciones; checklist de preservación por página.
- **Tailwind bloqueado por CSP en GAS**: preexistente y documentado; fuera de alcance (no se cambia el enfoque CDN).
- **`via.placeholder.com` caído**: reemplazado por `.listing-ph` gradiente.
- **`Scripts.html` `}` suelta**: verificar parseo; no tocar lógica.
- **Duplicación `switchMainTab`/`switchAdminTab`** (página vs `Scripts.html`): conservar las versiones por página; no consolidar.
- **Llamadas colgantes** (`solicitarVerificacion`, id `verificationEmail`): preexistentes, fuera de alcance.

## Validación (manual — sin tests/lint)

Por cada página:
- [ ] Patrones Airbnb presentes y coherentes; paleta andina consistente.
- [ ] Responsivo móvil/desktop (sidebar → off-canvas, grids colapsan).
- [ ] WCAG 2.2 AA: skip-link visible al focus, `:focus-visible`, `prefers-reduced-motion`, contraste de texto, roles ARIA en tabs.
- [ ] Tags GAS intactos; `SCRIPT_URL` y `<?= getScriptUrl() ?>` presentes.
- [ ] Todos los ids/handlers/`google.script.run` preservados (diff de nombres).
- [ ] Placeholders `.listing-ph` renderizan sin carga externa.
- [ ] Flujos clave intactos: login→dashboard, búsqueda/filtros, detalle→Yape→`crearReserva`, calificar (valida reserva), CRUD habitación con fotos, moderación admin.

## Fuera de alcance / futuro

- Modelo Premium para arrendadores (requiere backend: upgrade + priorización en `getHospedajes`).
- Verificación RENIEC/SUNAT (requiere APIs gubernamentales).
- Fotos reales del catálogo (requiere backend que retorne thumbnail por `HospedajeID`).
- Cablear historial/reseñas reales en `PerfilEstudiante.html` con `getReservasPorEstudiante`.
- Cualquier cambio en archivos `Backend/`.
