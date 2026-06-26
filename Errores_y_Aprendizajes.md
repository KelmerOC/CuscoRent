# Registro de Errores y Aprendizajes

Este documento sirve como bitácora para registrar los errores encontrados durante el desarrollo, los problemas de implementación y las lecciones aprendidas para evitar fallos futuros en el proyecto **Cusco Rent**.

---

## 1. Errores y Faltantes de Implementación (Trasladados del Documento Principal)

Los siguientes puntos representan brechas o faltantes entre el diseño teórico y la implementación actual, y deben ser tomados en cuenta para las siguientes fases de desarrollo:

### 1.1. Pasarela de Pagos (Fase 3 - Proyecto 7)
- **Problema/Faltante:** En `Estudiante.html` existe un botón visual que dice "Realizar Pago", pero no tiene funcionalidad asignada ni se comunica con una pasarela de pagos simulada o real (como Yape o Plin).
- **Lección/Próximo Paso:** Se debe implementar la lógica simulada de la pasarela empaquetando los datos mediante una petición HTTP POST.

### 1.2. Modelo Premium para Arrendadores (Fase 3 - Proyecto 8)
- **Problema/Faltante:** No existe una opción funcional en el panel del `Arrendador.html` para comprar una suscripción, ni lógica en el backend para priorizar o resaltar en el catálogo los cuartos de arrendadores premium.
- **Lección/Próximo Paso:** Diseñar la base de datos o lógica que clasifique a un arrendador como "Premium" e impacte el algoritmo de ordenamiento en el catálogo.

### 1.3. Sistema Formal de Reservas y Reseñas
- **Problema/Faltante Original:** Las habitaciones siempre aparecían "Disponibles" y cualquier estudiante podía calificar cualquier cuarto sin validar si lo había alquilado.
- **Estado Actual:** Ya se ha comenzado a implementar en `Backend/Reservas.js` y `Backend/ChatResenas.js` mediante validaciones para cambiar el estado a "Ocupado". 
- **Lección de Arquitectura:** Las reglas de negocio (como "solo un inquilino puede hacer una reseña") deben validarse estrictamente desde las consultas del Backend, no solo ocultando la opción en el Frontend.

### 1.4. Integraciones con RENIEC / SUNAT (Verificación de Identidad Legal)
- **Problema/Faltante:** La verificación se basa en que los usuarios suban fotos de su DNI o Carné, sin conectarse a ninguna API gubernamental real.
- **Lección/Próximo Paso:** Planificar la futura integración de APIs oficiales para formalizar a los arrendadores.

---

## 2. Errores de Interfaz y Lógica (Bugs Resueltos)

### 2.1. Pantalla Blanca en Panel de Arrendador (Junio 2026)
- **Descripción del Error:** Al rediseñar y unificar el panel del Arrendador (fusionando el Catálogo y el Dashboard en una sola vista), la pantalla se mostraba completamente en blanco, viéndose únicamente el pie de página (*footer*).
- **Causas Identificadas:**
  1. **Lógica de Navegación Rígida (`Scripts.html`):** La función `switchMainTab` usaba un arreglo estricto (`pageTabs`) para saber qué secciones debía gestionar. Al no haber registrado las nuevas pestañas (`catalogo` y `planes`), el script ocultaba el resto de pestañas pero jamás mostraba las nuevas, dejando la pantalla vacía.
  2. **CSS Obsoleto (`Estilos.html`):** Existía una regla residual `#modo-dashboard { display: none; }` diseñada para un diseño antiguo de dos vistas que forzaba a ocultar todo el contenedor.
  3. **Etiquetas HTML Abiertas:** Al reestructurar `Arrendador.html`, se perdieron etiquetas de cierre `</div>` importantes, lo que rompió el contenedor principal de la cuadrícula (`app-layout`).
- **Aprendizajes para el Futuro:**
  - **Revisar dependencias globales de JS al actualizar la UI:** Siempre que se añada una nueva sección o modal que interactúe con el menú lateral, se deben actualizar las variables JS (arrays o mapeos) que controlan esa lógica.
  - **Limpieza rigurosa de CSS:** Al rediseñar completamente una sección o eliminar un comportamiento, hay que rastrear con lupa y eliminar las reglas CSS antiguas vinculadas a los IDs antiguos para evitar herencias indeseadas.
  - **Cuidado con el Caché en Apps Script:** Es vital recordar que en el entorno de Google Apps Script (`/exec`), los cambios no son visibles hasta que se crea un **Nuevo Despliegue**. Durante el flujo de prueba o desarrollo de código activo, **siempre** se debe utilizar y probar sobre el enlace de desarrollo (`/dev`).
