// ============================================================
// MÓDULO: ADMINISTRADOR (Documento §3.1 Actor 3 — Dashboard y Control)
// ============================================================

/**
 * Verifica si un email pertenece a un administrador registrado.
 * @param {string} email - Correo del administrador a verificar.
 * @returns {boolean} true si el email existe en la hoja Administradores.
 */
function verificarAdmin(email) {
    if (!email) return false;
    const admins = getSheetData('Administradores');
    return admins.some(a => a.Correo && a.Correo.toLowerCase() === email.toLowerCase());
}

/**
 * Retorna estadísticas globales del sistema para el panel de Administrador.
 * (Documento §1.4 "Dashboard: Panel administrativo con estadísticas y control")
 */
function getEstadisticasAdmin() {
    try {
        const estudiantes = getSheetData('Estudiantes');
        const arrendadores = getSheetData('Arrendadores');
        const hospedajes = getSheetData('Hospedajes');
        const reservas = getSheetData('Reservas');
        const mensajes = getSheetData('MensajesChat');
        const hospedajesDisponibles = hospedajes.filter(h => h.Estado === 'Disponible').length;
        const hospedajesOcupados = hospedajes.filter(h => h.Estado === 'Ocupado').length;
        return {
            success: true,
            totalEstudiantes: estudiantes.length,
            totalArrendadores: arrendadores.length,
            totalHospedajes: hospedajes.length,
            hospedajesDisponibles: hospedajesDisponibles,
            hospedajesOcupados: hospedajesOcupados,
            totalReservas: reservas.length,
            reservasConfirmadas: reservas.filter(r => r.Estado === 'Confirmada').length,
            totalMensajes: mensajes.length
        };
    } catch (e) {
        Logger.log('Error getEstadisticasAdmin: ' + e.message);
        return { success: false, message: 'Error al obtener estadísticas: ' + e.message };
    }
}

/**
 * Retorna todos los estudiantes registrados.
 */
function getTodosEstudiantes() {
    return getSheetData('Estudiantes').map(e => ({
        EstudianteID: e.EstudianteID,
        NombreCompleto: e.NombreCompleto,
        CorreoInstitucional: e.CorreoInstitucional,
        Telefono: e.Telefono,
        BuscaRoommate: e.BuscaRoommate
    }));
}

/**
 * Retorna todos los arrendadores registrados.
 */
function getTodosArrendadores() {
    return getSheetData('Arrendadores').map(a => ({
        ArrendadorID: a.ArrendadorID,
        NombreCompleto: a.NombreCompleto,
        Email: a.Email,
        Telefono: a.Telefono,
        EstadoVerificacion: a.EstadoVerificacion
    }));
}

/**
 * Elimina un estudiante del sistema (moderación).
 * Solo ejecutable desde el panel de Administrador.
 */
function eliminarEstudiante(estudianteId) {
    const success = eliminarFilaPorId('Estudiantes', 'EstudianteID', estudianteId);
    return { success: success, message: success ? 'Estudiante eliminado correctamente.' : 'Estudiante no encontrado.' };
}

/**
 * Elimina un arrendador del sistema (moderación).
 * Solo ejecutable desde el panel de Administrador.
 */
function eliminarArrendador(arrendadorId) {
    const success = eliminarFilaPorId('Arrendadores', 'ArrendadorID', arrendadorId);

    if (success) {
        try {
            const sheet = getSpreadsheet().getSheetByName('Hospedajes');
            if (sheet) {
                const data = sheet.getDataRange().getValues();
                const headers = data[0];
                const arrIndex = headers.indexOf('ArrendadorID');

                if (arrIndex !== -1) {
                    for (let i = data.length - 1; i >= 1; i--) {
                        if (String(data[i][arrIndex]) === String(arrendadorId)) {
                            sheet.deleteRow(i + 1);
                        }
                    }
                }
            }
        } catch (e) {
            Logger.log("Error al eliminar habitaciones del arrendador: " + e.message);
        }
    }

    return { success: success, message: success ? 'Arrendador y sus habitaciones eliminados correctamente.' : 'Arrendador no encontrado.' };
}

function actualizarPerfilArrendador(datos) {
    try {
        const sheet = getSpreadsheet().getSheetByName('Arrendadores');
        if (!sheet) return { success: false, message: 'Hoja Arrendadores no encontrada' };
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const idIdx = headers.indexOf('ArrendadorID');

        for (let i = 1; i < data.length; i++) {
            if (String(data[i][idIdx]) === String(datos.ArrendadorID)) {
                const row = i + 1;
                if (datos.Telefono !== undefined) {
                    const telIdx = headers.indexOf('Telefono');
                    if (telIdx !== -1) sheet.getRange(row, telIdx + 1).setValue(datos.Telefono);
                }
                if (datos.NombreCompleto !== undefined) {
                    const nomIdx = headers.indexOf('NombreCompleto');
                    if (nomIdx !== -1) sheet.getRange(row, nomIdx + 1).setValue(datos.NombreCompleto);
                }
                return { success: true, message: 'Perfil actualizado correctamente.' };
            }
        }
        return { success: false, message: 'Arrendador no encontrado.' };
    } catch (e) {
        Logger.log('Error actualizarPerfilArrendador: ' + e.message);
        return { success: false, message: 'Error del servidor: ' + e.message };
    }
}
