// ============================================================
// MÓDULO: CHAT Y RESEÑAS
// ============================================================
function sendMessage(remitenteId, receptorId, hospedajeId, mensaje) {
    const rowData = {
        'MensajeID': 'MSG-' + Math.floor(Math.random() * 900000 + 100000),
        'RemitenteID': remitenteId,
        'ReceptorID': receptorId,
        'HospedajeID': hospedajeId,
        'Mensaje': mensaje,
        'FechaHora': new Date().toLocaleString(),
        'EstadoAtencion': 'No leído'
    };
    const success = appendRowData('MensajesChat', rowData);
    return { success: success, message: success ? 'Mensaje enviado.' : 'Error al enviar el mensaje.' };
}

function getMensajesPorArrendador(arrendadorId) {
    const mensajes = getSheetData('MensajesChat');
    const estudiantes = getSheetData('Estudiantes');
    const resultado = mensajes.filter(m => String(m.ReceptorID) === String(arrendadorId));
    // Enriquecer con nombre del remitente
    return resultado.map(m => {
        const est = estudiantes.find(e => String(e.EstudianteID) === String(m.RemitenteID));
        return Object.assign({}, m, { NombreRemitente: est ? est.NombreCompleto : m.RemitenteID });
    });
}

function getRoommates() {
    const data = getSheetData('Estudiantes');
    return data.filter(e => e.BuscaRoommate && e.BuscaRoommate.toLowerCase() === 'sí');
}

/**
 * Agrega una reseña. Valida que el estudiante tenga una reserva confirmada
 * para el hospedaje (Documento §3.2 Caso de Uso 4).
 */
function addResena(estudianteId, hospedajeId, arrendadorId, puntuacion, comentario) {
    // Validar reserva previa — requerimiento del Documento oficial
    const reservas = getSheetData('Reservas');
    const tieneReserva = reservas.some(r =>
        String(r.EstudianteID) === String(estudianteId) &&
        String(r.HospedajeID) === String(hospedajeId) &&
        String(r.Estado) === 'Confirmada'
    );
    if (!tieneReserva) {
        return { success: false, message: 'Solo puedes calificar habitaciones que has reservado.' };
    }
    const rowData = {
        'ResenaID': 'RES-' + Math.floor(Math.random() * 900000 + 100000),
        'EstudianteID': estudianteId,
        'HospedajeID': hospedajeId,
        'ArrendadorID': arrendadorId,
        'Puntuacion': puntuacion,
        'Comentario': comentario,
        'Fecha': new Date().toLocaleString()
    };
    const success = appendRowData('Resenas', rowData);

    // Recalcular promedio de calificación del hospedaje
    if (success) {
        try {
            // Forzar actualización de Sheets antes de leer los datos de nuevo
            SpreadsheetApp.flush();
            
            const todasResenas = getSheetData('Resenas').filter(r => String(r.HospedajeID) === String(hospedajeId));
            const promedio = todasResenas.reduce((sum, r) => sum + Number(r.Puntuacion), 0) / todasResenas.length;
            const sheet = getSpreadsheet().getSheetByName('Hospedajes');
            const data = sheet.getDataRange().getValues();
            const headers = data[0];
            const idIdx = headers.indexOf('HospedajeID');
            const calIdx = headers.indexOf('CalificacionPromedio');
            for (let i = 1; i < data.length; i++) {
                if (String(data[i][idIdx]) === String(hospedajeId)) {
                    sheet.getRange(i + 1, calIdx + 1).setValue(promedio.toFixed(1));
                    break;
                }
            }
        } catch (e) {
            Logger.log('Error recalculando promedio: ' + e.message);
        }
    }
    return { success: success, message: success ? 'Reseña publicada correctamente.' : 'Error al guardar la reseña.' };
}
