import re

with open('d:/Proyecto Analisis/Frontend/Arrendador.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the entire modo-catalogo block and the modo-dashboard wrapper up to <main
pattern1 = re.compile(r'<!-- ============================================================\s*MODO CATÁLOGO.*?<!-- MAIN CONTENT \(Dashboard\) -->\s*<main id=\"main-content\" class=\"app-main relative\">', re.DOTALL)

replacement1 = '''<!-- ============================================================
     DASHBOARD UNIFICADO
============================================================ -->
<div id=\"modo-dashboard\" class=\"app-layout h-screen overflow-hidden bg-surface\">
    
    <!-- SIDEBAR PREMIUM -->
    <aside class=\"app-sidebar w-[280px] bg-charcoal flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0 -translate-x-full fixed md:relative z-50 h-full\" id=\"sidebar\">
        <div class=\"p-8 border-b border-gray-800 shrink-0\">
            <div class=\"flex items-center gap-3 mb-2\">
                <div class=\"w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30\">
                    <span class=\"material-symbols-outlined text-[24px] icon-filled text-primary\">home_work</span>
                </div>
                <h1 class=\"text-2xl font-extrabold font-serif tracking-tighter\"><span class=\"text-white\">Cusco</span><span class=\"text-primary\">Rent</span></h1>
            </div>
            <p class=\"text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 ml-1\">Panel Arrendador</p>
        </div>

        <nav class=\"flex-1 overflow-y-auto px-4 py-6 space-y-2 sidebar-nav\" role=\"navigation\">
            <a onclick=\"switchMainTab('habitaciones'); toggleMobileSidebar()\" id=\"tabBtn-habitaciones\" class=\"nav-item active\">
                <span class=\"material-symbols-outlined\">home</span> Mis Propiedades
            </a>
            <a onclick=\"switchMainTab('reservas'); toggleMobileSidebar()\" id=\"tabBtn-reservas\" class=\"nav-item\">
                <span class=\"material-symbols-outlined\">book_online</span> Reservas Recibidas
            </a>
            <a onclick=\"switchMainTab('mensajes'); toggleMobileSidebar()\" id=\"tabBtn-mensajes\" class=\"nav-item\">
                <span class=\"material-symbols-outlined\">mail</span> Bandeja Entrada
            </a>
            <a onclick=\"switchMainTab('resenas'); toggleMobileSidebar()\" id=\"tabBtn-resenas\" class=\"nav-item\">
                <span class=\"material-symbols-outlined\">rate_review</span> Reseñas Recibidas
            </a>
            
            <div class=\"my-4 border-t border-gray-800/50 pt-4\"></div>
            
            <a onclick=\"switchMainTab('catalogo'); toggleMobileSidebar(); cargarCatalogoCompetencia();\" id=\"tabBtn-catalogo\" class=\"nav-item\">
                <span class=\"material-symbols-outlined\">travel_explore</span> Catálogo Referencia
            </a>
            
            <div class=\"my-4 border-t border-gray-800/50 pt-4\"></div>
            
            <a onclick=\"switchMainTab('perfil'); toggleMobileSidebar()\" id=\"tabBtn-perfil\" class=\"nav-item\">
                <span class=\"material-symbols-outlined\">person</span> Mi Perfil
            </a>
            <a onclick=\"switchMainTab('documentos'); toggleMobileSidebar()\" id=\"tabBtn-documentos\" class=\"nav-item\">
                <span class=\"material-symbols-outlined\">verified_user</span> Verificación
            </a>
            <a onclick=\"switchMainTab('planes'); toggleMobileSidebar()\" id=\"tabBtn-planes\" class=\"nav-item !text-primary hover:!bg-primary/10\">
                <span class=\"material-symbols-outlined\">workspace_premium</span> Mi Plan
            </a>
        </nav>

        <div class=\"p-4 shrink-0 border-t border-gray-800\">
            <div class=\"bg-white/5 rounded-xl p-4 mb-4 flex items-center gap-3 border border-white/10\">
                <div class=\"w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0\">
                    <span class=\"material-symbols-outlined\">person</span>
                </div>
                <div class=\"overflow-hidden\">
                    <p class=\"text-xs text-white/50 mb-0.5\">Conectado como</p>
                    <p class=\"font-bold text-sm text-white truncate\" id=\"userEmailDisplay\">Cargando...</p>
                </div>
            </div>
            <button onclick=\"cerrarSesion()\" class=\"w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-bold\">
                <span class=\"material-symbols-outlined text-[18px]\">logout</span> Cerrar Sesión
            </button>
        </div>
    </aside>

    <!-- BACKDROP MOBILE SIDEBAR -->
    <div id=\"mobile-overlay\" class=\"fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-40 hidden md:hidden\" onclick=\"toggleMobileSidebar()\"></div>

    <!-- MAIN CONTENT AREA -->
    <main id=\"main-content\" class=\"flex-1 flex flex-col h-screen overflow-hidden bg-bglite relative\">
        <!-- TOP HEADER -->
        <header class=\"h-[80px] shrink-0 bg-white border-b border-gray-100 px-4 sm:px-8 flex items-center justify-between z-10 shadow-sm relative\">
            <div class=\"flex items-center gap-4\">
                <button onclick=\"toggleMobileSidebar()\" class=\"md:hidden text-charcoal p-2 hover:bg-gray-100 rounded-lg\">
                    <span class=\"material-symbols-outlined\">menu</span>
                </button>
                <h2 class=\"text-xl font-bold font-serif text-charcoal hidden sm:block\">Panel de Gestión</h2>
            </div>
            <div class=\"flex items-center gap-4\">
                <button class=\"w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 relative transition-colors\">
                    <span class=\"material-symbols-outlined\">notifications</span>
                    <span class=\"absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full\"></span>
                </button>
            </div>
        </header>

        <!-- SCROLLABLE CONTENT -->
        <div class=\"flex-1 overflow-y-auto\" id=\"scrollable-content\">'''
content = re.sub(pattern1, replacement1, content)

# 2. Find <div class=\"max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10\"> and inject seccion-catalogo and seccion-planes
pattern2 = re.compile(r'(<div class=\"max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10\">)')

replacement2 = r'''\1
            <!-- ======================= SECCIÓN: CATÁLOGO DE REFERENCIA ======================= -->
            <div id="seccion-catalogo" class="hidden space-y-8">
                <div class="flex justify-between items-end flex-wrap gap-4 border-b border-gray-200 pb-6">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-extrabold text-charcoal font-serif">Analiza el Mercado local</h1>
                        <p class="text-gray-500 text-lg mt-2">Compara tus precios y servicios con otros arrendadores en Cusco.</p>
                    </div>
                </div>

                <!-- Filtros de Competencia -->
                <div class="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex flex-col lg:flex-row gap-6 items-center">
                    <div class="flex-1 w-full relative">
                        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">location_on</span>
                        <select id="filtroDistritoArr" class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                            <option value="">Todos los distritos</option>
                            <option value="Wanchaq">Wanchaq</option>
                            <option value="San Jerónimo">San Jerónimo</option>
                            <option value="San Sebastián">San Sebastián</option>
                            <option value="Cusco Cercado">Cusco Cercado</option>
                            <option value="Santiago">Santiago</option>
                        </select>
                    </div>
                    <div class="flex-1 w-full relative px-4 py-2 flex flex-col justify-center bg-gray-50 rounded-xl border border-gray-200">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-xs font-bold text-gray-500 flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">payments</span> Precio Máx</span>
                            <span id="precioMaxLabelArr" class="text-sm font-black text-primary tabular-nums">S/ 2000</span>
                        </div>
                        <input type="range" id="filtroPrecioArr" min="100" max="2000" step="50" value="2000" class="w-full accent-primary cursor-pointer" oninput="document.getElementById('precioMaxLabelArr').textContent = 'S/ ' + this.value">
                    </div>
                    <button onclick="aplicarFiltrosCompetencia()" class="w-full lg:w-auto bg-primary text-white font-bold px-10 py-3.5 rounded-xl hover:bg-primary-dark transition-colors shadow-[0_4px_14px_rgba(137,81,0,0.3)]">
                        Filtrar Mercado
                    </button>
                </div>
                
                <div>
                    <p class="text-sm text-gray-500 mb-6">Viendo <span id="catalogoCountArr" class="font-bold text-primary">0</span> habitaciones de referencia</p>
                    <div id="catalogoHabitacionesArr" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        <!-- Skeletons via JS -->
                    </div>
                </div>
            </div>

            <!-- ======================= SECCIÓN: PLANES PREMIUM ======================= -->
            <div id="seccion-planes" class="hidden space-y-8">
                <div class="text-center max-w-2xl mx-auto mb-12">
                    <h1 class="text-4xl font-black text-charcoal font-serif mb-4">Impulsa tus Alquileres</h1>
                    <p class="text-lg text-gray-500">Destaca tus habitaciones por encima de la competencia y consigue inquilinos más rápido con nuestros planes exclusivos.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <!-- Plan Gratuito -->
                    <div class="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
                        <h3 class="text-2xl font-bold text-charcoal mb-2">Plan Básico</h3>
                        <div class="flex items-baseline gap-1 mb-6">
                            <span class="text-4xl font-black text-charcoal">S/ 0</span>
                            <span class="text-gray-500 font-medium">/mes</span>
                        </div>
                        <p class="text-gray-500 mb-8">Ideal para empezar en la plataforma.</p>
                        
                        <ul class="space-y-4 mb-8 flex-1">
                            <li class="flex items-start gap-4">
                                <div class="mt-0.5 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <span class="material-symbols-outlined text-green-600 text-sm font-bold">check</span>
                                </div>
                                <span class="text-gray-600 font-medium">Publicaciones ilimitadas</span>
                            </li>
                            <li class="flex items-start gap-4">
                                <div class="mt-0.5 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <span class="material-symbols-outlined text-green-600 text-sm font-bold">check</span>
                                </div>
                                <span class="text-gray-600 font-medium">Recibir reservas y mensajes</span>
                            </li>
                        </ul>
                        
                        <button class="w-full py-4 px-6 rounded-xl bg-gray-100 text-gray-500 font-bold text-center cursor-default">
                            Tu plan actual
                        </button>
                    </div>
                    
                    <!-- Plan Premium -->
                    <div class="bg-charcoal rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                            Recomendado
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-2">Plan Premium</h3>
                        <div class="flex items-baseline gap-1 mb-6">
                            <span class="text-4xl font-black text-white">S/ 29.90</span>
                            <span class="text-white/60 font-medium">/mes</span>
                        </div>
                        <p class="text-white/70 mb-8">Maximiza tu visibilidad y cierra tratos rápido.</p>
                        
                        <ul class="space-y-4 mb-8 flex-1">
                            <li class="flex items-start gap-4">
                                <div class="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <span class="material-symbols-outlined text-primary text-sm font-bold">check</span>
                                </div>
                                <span class="text-gray-200 font-medium">Posicionamiento destacado en búsquedas</span>
                            </li>
                            <li class="flex items-start gap-4">
                                <div class="mt-0.5 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <span class="material-symbols-outlined text-primary text-sm font-bold">check</span>
                                </div>
                                <span class="text-gray-200 font-medium">Insignia de "Arrendador Premium"</span>
                            </li>
                        </ul>
                        
                        <button onclick="if(typeof showToast==='function') showToast('Funcionalidad de pasarela de pagos en desarrollo.', 'info')" class="w-full py-4 px-6 rounded-xl bg-primary text-white font-bold text-center hover:bg-primary-dark transition-all shadow-[0_4px_14px_rgba(137,81,0,0.3)] relative z-10">
                            Cambiar a Premium
                        </button>
                    </div>
                </div>
            </div>
'''
content = re.sub(pattern2, replacement2, content)

# 3. Modify the ending closing tags. Instead of replacing `</main> </div>` which could be risky, I will replace the footer area.
pattern3 = re.compile(r'    <footer\s+class="text-center.*?</main>', re.DOTALL)
replacement3 = r'''            </div> <!-- closes max-w-7xl mx-auto -->
        </div> <!-- closes scrollable-content -->
    </main>
</div>
'''
# Actually wait, `</main>` is in the original html, but the `footer` was outside of it or inside? Let's check:
# In the original, the `<main id="main-content">` encloses the footer?
# No, let's just make sure we close the tags properly.
# The `seccion-documentos` ends around line 683, and then `</div>` closes `max-w-7xl`, then `</main>`, then `</div>` closes `modo-dashboard`?
# I will just write a regex that finds `</main>\s*</div>` and ensures it closes correctly.
pattern3_alt = re.compile(r'(</main>\s*</div>)', re.DOTALL)
replacement3_alt = r'''            </div> <!-- closes max-w-7xl mx-auto -->
        </div> <!-- closes scrollable-content -->
\1'''
content = re.sub(pattern3_alt, replacement3_alt, content)

# 4. Modify Scripts to adapt navigation logic
pattern4 = re.compile(r'if \(tab\) \{ irAlDashboard\(\); switchMainTab\(tab\); \} else \{ cargarCatalogoCompetencia\(\); \}')
replacement4 = r'if (tab) { switchMainTab(tab); if(tab === \'catalogo\') cargarCatalogoCompetencia(); } else { switchMainTab(\'habitaciones\'); cargarMisHabitaciones(); }'
content = re.sub(pattern4, replacement4, content)

# Also remove irAlDashboard and update irAlCatalogo
pattern5 = re.compile(r'function irAlDashboard\(\) \{.*?\}', re.DOTALL)
content = re.sub(pattern5, 'function irAlDashboard() { switchMainTab(\'habitaciones\'); cargarMisHabitaciones(); }', content)

pattern6 = re.compile(r'function irAlCatalogo\(\) \{.*?\}', re.DOTALL)
content = re.sub(pattern6, 'function irAlCatalogo() { switchMainTab(\'catalogo\'); cargarCatalogoCompetencia(); }', content)


with open('d:/Proyecto Analisis/Frontend/Arrendador.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('HTML updated successfully.')
