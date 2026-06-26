# CuscoRent — Interface Design System

## Direction & Feel
Paleta tricromática estricta inspirada en la **Montaña de los 7 Colores (Vinicunca)**. Contraste dramático entre el Verde de la estructura y el Ámbar de la interacción, con un potente Rojo Arcilla para elementos de valor del usuario.

## Color Palette — Vinicunca 3 Colores

| Token CSS | Valor | Rol |
|-----------|-------|-----|
| `--primary` | `#D98A2C` | **Ámbar Andino (Predominante Interacción)** — Botones principales, estados activos, anillos de foco. |
| `--primary-dark` | `#895100` | Ámbar oscuro — Hover en botones, sombras base de tarjetas. |
| `--secondary` | `#2D6A4F` | **Verde Andino (Predominante Estructural)** — Gradientes base, textos principales. |
| `--secondary-dark`| `#1B4332` | Verde profundo — Sidebar, cabeceras, fondos inactivos. |
| `--terracotta` | `#B85151` | **Rojo Arcilla (Acento Visible al Usuario)** — Precios, insignias premium/destacado, barra superior de tarjetas. |
| `--charcoal` | `#1a2420` | Texto primario (verde casi negro). |
| `--bglite` | `#F5F9F6` | Fondo crema (tinte verde). |

> Nota: Los colores de semantic tailwind (success, warning, error, info) están mapeados internamente a estos 3 colores. Se han eliminado sage, skyblue, y otros.

## Depth Strategy (Layered Shadows)
- Sombras con tinte Ámbar cálido: `rgba(137, 81, 0, 0.12)`
- Focus ring: Ámbar `rgba(137, 81, 0, 0.28)`

## Key Component Patterns

### Button Primary (Ámbar)
- gradient: `linear-gradient(135deg, #D98A2C, #895100)`

### Sidebar (Verde)
- background: `#1B4332`
- Nav Item Active: border Ámbar `#D98A2C`, glow Ámbar interior.

### Cards (Tríada)
- Card Accent Bar: Gradiente Verde -> Ámbar -> Terracota.
- Insignia Premium: Solid Terracota `#B85151`.
- Precio: Text Terracota `#B85151`.

## Signature Elements
1. **Co-predominancia (Verde + Ámbar)**: La barra lateral es Verde Profundo, pero los enlaces activos y botones son Ámbar brillante.
2. **Precios en Rojo Arcilla**: Atraen instantáneamente la mirada hacia la información transaccional.
3. **Hero Gradient Dual**: Flujo desde Verde Profundo (0%) a Ámbar (65%) a Rojo Arcilla (100%).
