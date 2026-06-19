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
    return { success: success, message: success ? 'Arrendador eliminado correctamente.' : 'Arrendador no encontrado.' };
}
