# AGENTS.md

## Project: UniStay (Cusco Rent)

Google Apps Script web app for student housing in Cusco, Peru. NOT a Node.js/browser project.

## Architecture

- **Frontend:** HTML files served via `HtmlService`. Styling via Tailwind CDN + custom CSS.
- **Backend:** Server-side `.js` files (Apps Script runtime). All data ops go through `google.script.run`.
- **Data:** Google Sheets (main DB) + Google Drive (file storage).
- **Navigation:** `doGet()` in `Backend/Main.js` routes `?page=X` to `HtmlService.createTemplateFromFile(X)`.

### File structure

```
Backend/
  Main.js          — doGet(), include(), getScriptUrl()
  Config.js        — Spreadsheet ID, Drive folder ID, limits
  Auth.js          — login, register, password recovery
  Hospedajes.js    — CRUD for listings (getHospedajes, crearHabitacion, etc.)
  Reservas.js      — Reservations + email notifications
  ChatResenas.js   — Messaging + reviews
  Admin.js         — Dashboard stats, user moderation
  GoogleSheets.js  — getSheetData(), appendRowData() helpers
  DriveArchivos.js — Image upload/delete/listing to Drive
Frontend/
  Estilos.html     — <style> + Tailwind CDN config + Google Fonts
  Scripts.html     — Shared JS: APP state, toast, loader, auth handlers, image utils
  Login.html       — Login + register + password recovery modals
  Estudiante.html  — Student panel (browse, reserve, roommates, docs)
  Arrendador.html  — Landlord panel (listings CRUD, messages, reservations, docs)
  Administrador.html — Admin panel (dashboard stats, moderation)
```

## Critical conventions

### HTML template syntax

All HTML files use GAS server-side template tags:
- `<?!= include('Scripts'); ?>` — includes another file's content
- `<?= getScriptUrl() ?>` — outputs the deployed web app URL
- These only work when deployed to GAS, never locally.

### Frontend-Backend communication

ALL backend calls use `google.script.run` with callback chaining:
```js
google.script.run
    .withSuccessHandler(res => { /* handle */ })
    .withFailureHandler(err => { /* handle */ })
    .backendFunction(args);
```

`google.script.run` does NOT exist outside GAS runtime. The mock in `Estudiante.html` (lines 434-463) only activates for local dev (`typeof google === 'undefined'`).

### Data flow

- `localStorage` stores the user object on login (key: `user`).
- Each page reads `localStorage.getItem('user')` on `DOMContentLoaded` to restore session.
- User objects come directly from the spreadsheet row. Column names must match exactly (e.g., `EstudianteID`, `ArrendadorID`, `CorreoInstitucional`).

### Google Sheets column requirements

**Estudiantes sheet:** must have columns `EstudianteID`, `CorreoInstitucional`, `Contrasena`, `NombreCompleto`, `Telefono`, `BuscaRoommate`, `Intereses`.

**Arrendadores sheet:** must have columns `ArrendadorID`, `Email`, `Contrasena`, `NombreCompleto`, `Telefono`, `EstadoVerificacion`.

**Hospedajes sheet:** must have columns `HospedajeID`, `ArrendadorID`, `Titulo`, `Descripcion`, `Distrito`, `Direccion`, `TipoHabitacion`, `PrecioMensual`, `Servicios`, `Estado`, `Latitud`, `Longitud`, `CalificacionPromedio`.

**Reservas sheet:** `ReservaID`, `EstudianteID`, `HospedajeID`, `ArrendadorID`, `Monto`, `Estado`, `FechaReserva`.

**MensajesChat sheet:** `MensajeID`, `RemitenteID`, `ReceptorID`, `HospedajeID`, `Mensaje`, `FechaHora`, `EstadoAtencion`.

**Resenas sheet:** `ResenaID`, `EstudianteID`, `HospedajeID`, `ArrendadorID`, `Puntuacion`, `Comentario`, `Fecha`.

**Administradores sheet:** `Correo`, `Contrasena`.

### Known pitfalls

- Tailwind CSS loads from CDN (`cdn.tailwindcss.com`). If GAS CSP blocks it, all styling breaks. Verify by checking browser console for `Refused to load` errors.
- `APP.currentUser` must have the role-specific ID (`EstudianteID` or `ArrendadorID`) or backend calls fail silently.
- `switchAdminTab()` in Administrador.html uses `classList.add/remove('active')` — never reassign `className` directly (destroys other classes).
- Image uploads go through `compressImage()` in Scripts.html before `google.script.run.subirImagen()`.
- Reviews (`addResena`) require a prior confirmed reservation for the same hospedaje.

## Deployment

1. Open the project in Google Apps Script editor (script.google.com).
2. All `.js` files in `Backend/` are automatically included as server-side code.
3. All `.html` files in `Frontend/` are served as pages.
4. Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
5. Update `CONFIG.SPREADSHEET_ID` and `CONFIG.CARPETA_RAIZ_ID` in `Config.js` if switching accounts.

## No build/test/lint

There are no npm scripts, no tests, no linter. The project runs entirely in the GAS runtime. Deploy and test manually.
