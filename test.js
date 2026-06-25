
        const SCRIPT_URL = "<?= getScriptUrl() ?>";
        let habitacionEditandoId = null;

        function irAlDashboard() {
            document.getElementById('modo-catalogo').style.display = 'none';
            document.getElementById('modo-dashboard').classList.remove('hidden');
            document.getElementById('modo-dashboard').style.display = 'grid';
            cargarMisHabitaciones();
        }

        function irAlCatalogo() {
            document.getElementById('modo-catalogo').style.display = '';
            document.getElementById('modo-dashboard').style.display = 'none';
            document.getElementById('modo-dashboard').classList.add('hidden');
            cargarCatalogoCompetencia();
        }

        window.addEventListener('DOMContentLoaded', () => {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) { redirectTop(SCRIPT_URL + '?page=Login'); return; }
            APP.currentUser = JSON.parse(savedUser);
            APP.currentRole = 'arrendador';
            APP.currentEmail = APP.currentUser.Email || APP.currentUser.Correo;
            if (document.getElementById('userEmailDisplay')) document.getElementById('userEmailDisplay').textContent = APP.currentEmail;

            const tab = new URLSearchParams(window.location.search).get('tab');
            if (tab) { irAlDashboard(); switchMainTab(tab); } else { cargarCatalogoCompetencia(); }

            renderSkeletons('catalogoHabitacionesArr', 4);
            renderSkeletons('listaMisHabitaciones', 4);
        });

        let hospedajesCompetenciaGlobal = [];

        function cargarCatalogoCompetencia() {
            const container = document.getElementById('catalogoHabitacionesArr');
            renderSkeletons('catalogoHabitacionesArr', 4);
            google.script.run.withSuccessHandler(result => {
                hospedajesCompetenciaGlobal = result || [];
                renderCatalogoCompetencia(hospedajesCompetenciaGlobal);
            }).getHospedajes();
        }

        window.aplicarFiltrosCompetencia = function () {
            if (!hospedajesCompetenciaGlobal) return;

            const dist = document.getElementById('filtroDistritoArr').value.trim().toLowerCase();
            const maxP = document.getElementById('filtroPrecioArr').value;
            const serviciosSeleccionados = Array.from(document.querySelectorAll('#main-content-catalogo input[type="checkbox"]:checked')).map(cb => cb.value);

            const filtrados = hospedajesCompetenciaGlobal.filter(h => {
                const hPrecio = parseFloat(h.PrecioMensual) || 0;
                if (hPrecio > maxP) return false;

                if (dist && (h.Distrito || '').toLowerCase() !== dist) return false;

                if (serviciosSeleccionados.length > 0) {
                    const serv = (h.Servicios || '').toLowerCase();
                    const tieneTodos = serviciosSeleccionados.every(s => serv.includes(s.toLowerCase()));
                    if (!tieneTodos) return false;
                }

                return true;
            });

            renderCatalogoCompetencia(filtrados);
        };

        function renderCatalogoCompetencia(data) {
            const container = document.getElementById('catalogoHabitacionesArr');
            document.getElementById('catalogoCountArr').textContent = data ? data.length : 0;
            if (!data || data.length === 0) {
                container.innerHTML = '<p class="col-span-full py-12 text-center text-gray-400">Sin coincidencias.</p>';
                return;
            }
            container.innerHTML = data.map(h => {
                const imgHtml = h.URLsImagenes ? `<img src="${h.URLsImagenes.split(',')[0].trim()}" class="w-full h-full object-cover">` : `<div class="listing-ph h-full"><span class="material-symbols-outlined text-4xl">home</span></div>`;
                return `
                  <div class="listing-card pointer-events-none opacity-80">
                      <div class="listing-card-image">${imgHtml}</div>
                      <div class="listing-card-content">
                          <h4 class="font-bold text-charcoal truncate mb-1">${h.Titulo || h.Distrito}</h4>
                          <p class="text-sm text-gray-500 flex items-center gap-1 mb-4"><span class="material-symbols-outlined text-xs">location_on</span> ${h.Distrito}</p>
                          <div class="flex justify-between items-center pt-3 border-t border-gray-50">
                              <span class="text-lg font-bold text-primary">S/ ${h.PrecioMensual}</span>
                              <span class="badge badge-primary text-[10px] uppercase">${h.TipoHabitacion}</span>
                          </div>
                      </div>
                  </div>
              `;
            }).join('');
        }

        function cargarMisHabitaciones() {
            const container = document.getElementById('listaMisHabitaciones');
            renderSkeletons('listaMisHabitaciones', 4);
            google.script.run.withSuccessHandler(result => {
                if (!result || result.length === 0) { container.innerHTML = '<div class="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">No tienes publicaciones.</div>'; return; }
                container.innerHTML = result.map(h => {
                    const esOcupado = h.Estado === 'Ocupado';
                    const imgHtml = h.URLsImagenes ? `<img src="${h.URLsImagenes.split(',')[0].trim()}" class="w-full h-full object-cover">` : `<div class="listing-ph h-full"><span class="material-symbols-outlined text-5xl">home</span></div>`;
                    return `
                      <div class="listing-card group animate-fade-in" onclick="prepararEdicion('${encodeURIComponent(JSON.stringify(h))}')">
                          <div class="listing-card-image aspect-square">
                              ${imgHtml}
                              <div class="absolute top-3 right-3 z-10"><span class="badge ${esOcupado ? 'badge-secondary' : 'badge-sage'} py-1.5 px-3 uppercase tracking-tighter">${h.Estado}</span></div>
                          </div>
                          <div class="listing-card-content">
                              <h4 class="font-bold text-charcoal text-lg truncate mb-1">${h.Titulo || h.Distrito}</h4>
                              <p class="text-sm text-gray-400 mb-6">${h.Distrito}</p>
                              <div class="flex justify-between items-end mb-6">
                                  <p class="text-2xl font-black text-primary leading-none">S/ ${h.PrecioMensual}</p>
                                  <div class="flex items-center gap-1 font-bold text-charcoal bg-gray-50 px-2 py-1 rounded-lg border border-gray-100"><span class="material-symbols-outlined text-primary text-sm filled-icon">star</span> ${h.CalificacionPromedio || '0'}</div>
                              </div>
                              <div class="flex gap-2 pt-4 border-t border-gray-100">
                                  <button class="btn btn-ghost btn-sm flex-1" onclick="event.stopPropagation(); prepararEdicion('${encodeURIComponent(JSON.stringify(h))}')"><span class="material-symbols-outlined text-lg">edit</span></button>
                                  <button class="btn btn-danger btn-sm flex-1" onclick="event.stopPropagation(); borrarHabitacion('${h.HospedajeID}')"><span class="material-symbols-outlined text-lg">delete</span></button>
                              </div>
                          </div>
                      </div>
                  `;
                }).join('');
            }).getHospedajesPorArrendador(APP.currentUser.ArrendadorID);
        }

        async function guardarHabitacion() {
            const hTitulo = document.getElementById('hTitulo').value.trim();
            const hPrecio = document.getElementById('hPrecio').value.trim();

            if (!hTitulo || !hPrecio) return showToast('Título y Precio son obligatorios', 'error');

            const files = Array.from(document.getElementById('hFotos') ? document.getElementById('hFotos').files : []);
            if (files.length > 5) return showToast('Máximo 5 fotos permitidas.', 'error');

            const datos = {
                HospedajeID: habitacionEditandoId,
                ArrendadorID: APP.currentUser.ArrendadorID,
                Titulo: hTitulo,
                Distrito: document.getElementById('hDistrito').value,
                Direccion: document.getElementById('hDireccion').value,
                TipoHabitacion: document.getElementById('hTipo').value,
                PrecioMensual: hPrecio,
                Latitud: document.getElementById('hLatitud') ? document.getElementById('hLatitud').value : '',
                Longitud: document.getElementById('hLongitud') ? document.getElementById('hLongitud').value : '',
                Servicios: Array.from(document.querySelectorAll('#hServiciosContainer input[type="checkbox"]:checked')).map(cb => cb.value).join(', '),
                Descripcion: document.getElementById('hDescripcion') ? document.getElementById('hDescripcion').value : '',
                Estado: 'Disponible'
            };

            showLoader('Publicando anuncio...');

            try {
                const res = await new Promise((resolve, reject) => {
                    if (habitacionEditandoId) {
                        google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).editarHabitacion(datos);
                    } else {
                        google.script.run.withSuccessHandler(resolve).withFailureHandler(reject).crearHabitacion(datos);
                    }
                });

                if (!res.success) {
                    hideLoader();
                    showToast(res.message, 'error');
                    return;
                }

                const hospedajeId = res.hospedajeId || habitacionEditandoId;

                if (files.length > 0) {
                    document.getElementById('loaderText').textContent = 'Subiendo fotos de la propiedad...';
                    let nuevasUrls = [];
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const comp = await compressImage(file);
                        const uploadData = {
                            base64: comp.base64,
                            nombreArchivo: comp.fileName,
                            mimeType: comp.mimeType,
                            tipoUsuario: APP.currentRole,
                            emailUsuario: APP.currentEmail,
                            categoria: 'habitaciones',
                            subcategoria: hospedajeId
                        };
                        const upRes = await new Promise((resolveUp, rejectUp) => {
                            google.script.run.withSuccessHandler(resolveUp).withFailureHandler(rejectUp).subirImagen(uploadData);
                        });

                        if (upRes && upRes.success && upRes.url) {
                            nuevasUrls.push(upRes.url);
                        }
                    }

                    if (nuevasUrls.length > 0) {
                        const urlsStr = nuevasUrls.join(', ');
                        await new Promise((resolveAct) => {
                            google.script.run.withSuccessHandler(resolveAct).withFailureHandler(resolveAct).actualizarFotosHabitacion(hospedajeId, urlsStr);
                        });
                    }
                }

                hideLoader();
                showToast(res.message || 'Habitación guardada', 'success');
                cancelarEdicion();
                cargarMisHabitaciones();

            } catch (e) {
                hideLoader();
                showToast('Error del servidor: ' + e.message, 'error');
            }
        }

        function prepararEdicion(hStr) {
            const h = JSON.parse(decodeURIComponent(hStr));
            document.getElementById('formCrearHabitacion').classList.remove('hidden');
            document.getElementById('formTitulo').textContent = 'Editar Publicación';
            document.getElementById('btnGuardarHabitacion').innerHTML = '<span class="material-symbols-outlined">save</span> Guardar Cambios';

            document.getElementById('hTitulo').value = h.Titulo || '';
            document.getElementById('hDistrito').value = h.Distrito || '';
            document.getElementById('hDireccion').value = h.Direccion || '';
            document.getElementById('hTipo').value = h.TipoHabitacion || 'Individual';
            document.getElementById('hPrecio').value = h.PrecioMensual || '';

            if (document.getElementById('hLatitud')) document.getElementById('hLatitud').value = h.Latitud || '';
            if (document.getElementById('hLongitud')) document.getElementById('hLongitud').value = h.Longitud || '';
            if (document.getElementById('hDescripcion')) document.getElementById('hDescripcion').value = h.Descripcion || '';

            document.querySelectorAll('#hServiciosContainer input[type="checkbox"]').forEach(cb => {
                cb.checked = h.Servicios && h.Servicios.split(',').map(s => s.trim()).includes(cb.value);
            });

            habitacionEditandoId = h.HospedajeID;
            updateMapPreview();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function updateMapPreview() {
            const dir = document.getElementById('hDireccion').value.trim();
            const dist = document.getElementById('hDistrito').value;
            const preview = document.getElementById('mapPreview');
            if (!preview) return;
            let query = 'Cusco,Peru';
            if (dir || dist) {
                query = `${dir || ''} ${dist || ''} Cusco Peru`.trim().replace(/\s+/g, '+');
            }
            preview.src = `https://maps.google.com/maps?q=${query}&output=embed&z=15`;
        }

        function cancelarEdicion() {
            document.getElementById('formCrearHabitacion').classList.add('hidden');
            habitacionEditandoId = null;
        }

        function borrarHabitacion(id) {
            showConfirmModal('Eliminar', '¿Confirmas eliminar este anuncio?', () => {
                showLoader('Eliminando...');
                google.script.run.withSuccessHandler(() => { hideLoader(); cargarMisHabitaciones(); }).eliminarHabitacion(id);
            }, { danger: true });
        }

        function cargarPerfilArrendador() {
            document.getElementById('perfilNombre').value = APP.currentUser.NombreCompleto || '';
            document.getElementById('perfilEmail').value = APP.currentUser.Email || '';
            document.getElementById('perfilTelefono').value = APP.currentUser.Telefono || '';
        }

        function guardarPerfilArrendador() {
            showLoader('Guardando...');
            google.script.run.withSuccessHandler(() => { hideLoader(); showToast('Perfil guardado', 'success'); }).actualizarPerfilArrendador({ ArrendadorID: APP.currentUser.ArrendadorID, NombreCompleto: document.getElementById('perfilNombre').value, Telefono: document.getElementById('perfilTelefono').value });
        }
    