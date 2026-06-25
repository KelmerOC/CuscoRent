// ============================================================
// MÓDULO: HOSPEDAJES (CRUD)
// ============================================================
function getHospedajes(filters) {
    let list = getSheetData('Hospedajes');
    if (filters && typeof filters === 'object') {
        if (filters.distrito && filters.distrito !== 'Todos') {
            list = list.filter(h => h.Distrito === filters.distrito);
        }
        if (filters.precioMax) {
            list = list.filter(h => Number(h.PrecioMensual) <= Number(filters.precioMax));
        }
        if (filters.tipoHabitacion && filters.tipoHabitacion !== 'Todos') {
            list = list.filter(h => h.TipoHabitacion === filters.tipoHabitacion);
        }
    }
    return list;
}

function getHospedajesPorArrendador(arrendadorId) {
    const list = getSheetData('Hospedajes');
    return list.filter(h => h.ArrendadorID === arrendadorId);
}

function getAllHospedajes() {
    return getSheetData('Hospedajes');
}

function crearHabitacion(datos) {
    const id = 'HOSP-' + Math.floor(Math.random() * 90000 + 10000);
    const rowData = {
        'HospedajeID': id,
        'ArrendadorID': datos.ArrendadorID,
        'Titulo': datos.Titulo,
        'Descripcion': datos.Descripcion,
        'Distrito': datos.Distrito,
        'Direccion': datos.Direccion,
        'TipoHabitacion': datos.TipoHabitacion,
        'PrecioMensual': datos.PrecioMensual,
        'Servicios': datos.Servicios,
        'Estado': 'Disponible',
        'Latitud': datos.Latitud || '',
        'Longitud': datos.Longitud || '',
        'CalificacionPromedio': 0,
        'URLsImagenes': datos.URLsImagenes || ''
    };
    const success = appendRowData('Hospedajes', rowData);
    return { success: success, message: success ? 'Habitación creada con éxito.' : 'Error al guardar.', hospedajeId: id, redirectUrl: '?page=Arrendador&tab=habitaciones' };
}

function editarHabitacion(datos) {
    try {
        const sheet = getSpreadsheet().getSheetByName('Hospedajes');
        if (!sheet) return { success: false, message: "No existe la hoja Hospedajes" };
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const idIndex = headers.indexOf('HospedajeID');
        const arrIndex = headers.indexOf('ArrendadorID');
        
        if (idIndex === -1 || arrIndex === -1) return { success: false, message: "Estructura de hoja inválida" };
        
        for (let i = 1; i < data.length; i++) {
            if (String(data[i][idIndex]) === String(datos.HospedajeID)) {
                if (String(data[i][arrIndex]) !== String(datos.ArrendadorID)) {
                    return { success: false, message: "No tienes permiso para editar esta habitación" };
                }
                const row = i + 1;
                const updateField = (key, val) => {
                    const idx = headers.indexOf(key);
                    if (idx !== -1 && val !== undefined) sheet.getRange(row, idx + 1).setValue(val);
                };
                updateField('Titulo', datos.Titulo);
                updateField('Descripcion', datos.Descripcion);
                updateField('Distrito', datos.Distrito);
                updateField('Direccion', datos.Direccion);
                updateField('TipoHabitacion', datos.TipoHabitacion);
                updateField('PrecioMensual', datos.PrecioMensual);
                updateField('Servicios', datos.Servicios);
                updateField('Latitud', datos.Latitud);
                updateField('Longitud', datos.Longitud);
                if (datos.URLsImagenes !== undefined) updateField('URLsImagenes', datos.URLsImagenes);
                
                 return { success: true, message: 'Habitación actualizada.', hospedajeId: datos.HospedajeID, redirectUrl: '?page=Arrendador&tab=habitaciones' };
            }
        }
        return { success: false, message: "Habitación no encontrada" };
    } catch(e) {
        Logger.log("Error al editar habitación: " + e.message);
        return { success: false, message: "Error del servidor: " + e.message };
    }
}

function eliminarFilaPorId(sheetName, idKey, idValue) {
    try {
        const sheet = getSpreadsheet().getSheetByName(sheetName);
        if (!sheet) return false;
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const idIndex = headers.indexOf(idKey);
        
        if (idIndex === -1) return false;
        
        // Iteramos de abajo hacia arriba para no alterar los índices al borrar
        for (let i = data.length - 1; i >= 1; i--) {
            if (String(data[i][idIndex]) === String(idValue)) {
                sheet.deleteRow(i + 1); // deleteRow es 1-indexed
                return true;
            }
        }
        return false;
    } catch(e) {
        Logger.log("Error al eliminar fila: " + e.message);
        return false;
    }
}

function eliminarHabitacion(hospedajeId) {
    const success = eliminarFilaPorId('Hospedajes', 'HospedajeID', hospedajeId);
    return { success: success, message: success ? 'Habitación eliminada correctamente.' : 'Habitación no encontrada o error al eliminar.' };
}

function actualizarFotosHabitacion(hospedajeId, urlsStr) {
    try {
        const sheet = getSpreadsheet().getSheetByName('Hospedajes');
        if (!sheet) return { success: false, message: "No existe la hoja Hospedajes" };
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const idIndex = headers.indexOf('HospedajeID');
        const urlIndex = headers.indexOf('URLsImagenes');
        
        if (idIndex === -1) return { success: false, message: "Estructura de hoja inválida. Falta columna HospedajeID." };
        if (urlIndex === -1) return { success: false, message: "Falta columna URLsImagenes en Google Sheets." };
        
        for (let i = 1; i < data.length; i++) {
            if (String(data[i][idIndex]) === String(hospedajeId)) {
                const cell = sheet.getRange(i + 1, urlIndex + 1);
                const currentVal = cell.getValue() || '';
                const newVal = currentVal ? currentVal + ', ' + urlsStr : urlsStr;
                cell.setValue(newVal);
                return { success: true, message: 'URLs agregadas correctamente.' };
            }
        }
        return { success: false, message: "Habitación no encontrada" };
    } catch(e) {
        Logger.log("Error al actualizar fotos: " + e.message);
        return { success: false, message: "Error del servidor: " + e.message };
    }
}
