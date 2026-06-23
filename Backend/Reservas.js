// ============================================================
// MÓDULO: RESERVAS (Fase 3 — Documento §2.4 Proyecto 7 / §3.2 CU4 y CU6)
// ============================================================

/**
 * Crea una reserva y marca la habitación como "Ocupado".
 * Notifica automáticamente al arrendador por correo.
 */
function crearReserva(estudianteId, hospedajeId, arrendadorId, monto) {
    try {
        // Verificar que la habitación esté disponible
        const hospedajes = getSheetData('Hospedajes');
        const habitacion = hospedajes.find(h => String(h.HospedajeID) === String(hospedajeId));
        if (!habitacion) return { success: false, message: 'Habitación no encontrada.' };
        if (habitacion.Estado === 'Ocupado') return { success: false, message: 'Esta habitación ya está ocupada.' };

        const reservaId = 'RES-' + Math.floor(Math.random() * 900000 + 100000);
        const rowData = {
            'ReservaID': reservaId,
            'EstudianteID': estudianteId,
            'HospedajeID': hospedajeId,
            'ArrendadorID': arrendadorId,
            'Monto': monto,
            'Estado': 'Confirmada',
            'FechaReserva': new Date().toLocaleString()
        };
        const success = appendRowData('Reservas', rowData);
        if (!success) return { success: false, message: 'Error al registrar la reserva.' };

        // Actualizar estado de la habitación a "Ocupado"
        const sheet = getSpreadsheet().getSheetByName('Hospedajes');
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const idIdx = headers.indexOf('HospedajeID');
        const estadoIdx = headers.indexOf('Estado');
        for (let i = 1; i < data.length; i++) {
            if (String(data[i][idIdx]) === String(hospedajeId)) {
                sheet.getRange(i + 1, estadoIdx + 1).setValue('Ocupado');
                break;
            }
        }

        // Notificar al arrendador por correo
        notificarArrendadorReserva(arrendadorId, estudianteId, habitacion.Titulo, monto, reservaId);

         return { success: true, message: 'Reserva confirmada. El arrendador ha sido notificado.', reservaId: reservaId, redirectUrl: '?page=Estudiante&tab=reservas' };
    } catch (e) {
        Logger.log('Error crearReserva: ' + e.message);
        return { success: false, message: 'Error del servidor: ' + e.message };
    }
}

/**
 * Obtiene todas las reservas activas de un estudiante.
 */
function getReservasPorEstudiante(estudianteId) {
    const reservas = getSheetData('Reservas');
    const hospedajes = getSheetData('Hospedajes');
    const filtradas = reservas.filter(r => String(r.EstudianteID) === String(estudianteId));
    // Enriquecer con datos de la habitación
    return filtradas.map(r => {
        const h = hospedajes.find(h => String(h.HospedajeID) === String(r.HospedajeID));
        return Object.assign({}, r, {
            Titulo: h ? h.Titulo : 'Habitación no encontrada',
            Distrito: h ? h.Distrito : '',
            Direccion: h ? h.Direccion : '',
            PrecioMensual: h ? h.PrecioMensual : r.Monto
        });
    });
}

/**
 * Obtiene las reservas recibidas por un arrendador.
 */
function getReservasPorArrendador(arrendadorId) {
    const reservas = getSheetData('Reservas');
    const estudiantes = getSheetData('Estudiantes');
    const hospedajes = getSheetData('Hospedajes');
    const filtradas = reservas.filter(r => String(r.ArrendadorID) === String(arrendadorId));
    return filtradas.map(r => {
        const est = estudiantes.find(e => String(e.EstudianteID) === String(r.EstudianteID));
        const h = hospedajes.find(h => String(h.HospedajeID) === String(r.HospedajeID));
        return Object.assign({}, r, {
            NombreEstudiante: est ? est.NombreCompleto : r.EstudianteID,
            EmailEstudiante: est ? est.CorreoInstitucional : '',
            TituloHabitacion: h ? h.Titulo : r.HospedajeID
        });
    });
}

/**
 * Verifica si un estudiante tiene reserva confirmada para un hospedaje.
 * Usado para validar el permiso de calificar.
 */
function verificarReservaPrevia(estudianteId, hospedajeId) {
    const reservas = getSheetData('Reservas');
    const tiene = reservas.some(r =>
        String(r.EstudianteID) === String(estudianteId) &&
        String(r.HospedajeID) === String(hospedajeId) &&
        String(r.Estado) === 'Confirmada'
    );
    return { tieneReserva: tiene };
}



/**
 * Envía correo de notificación al arrendador cuando se confirma una reserva.
 * (Documento §3.2 CU6 — Fase 3 Proyecto 7)
 */
function notificarArrendadorReserva(arrendadorId, estudianteId, tituloHabitacion, monto, reservaId) {
    try {
        const arrendadores = getSheetData('Arrendadores');
        const estudiantes = getSheetData('Estudiantes');
        const arrendador = arrendadores.find(a => String(a.ArrendadorID) === String(arrendadorId));
        const estudiante = estudiantes.find(e => String(e.EstudianteID) === String(estudianteId));
        if (!arrendador || !arrendador.Email) return;
        const nombreArrendador = arrendador.NombreCompleto || 'Arrendador';
        const nombreEstudiante = estudiante ? estudiante.NombreCompleto : estudianteId;
        const correoEstudiante = estudiante ? estudiante.CorreoInstitucional : '';
        MailApp.sendEmail({
            to: arrendador.Email,
            subject: '🏠 Nueva Reserva Confirmada — CuscoRent',
            htmlBody: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #c28e46; text-align: center;">CuscoRent — Nueva Reserva</h2>
                    <p>Hola <strong>${nombreArrendador}</strong>,</p>
                    <p>¡Tu habitación ha sido reservada! Aquí tienes los detalles:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>🏠 Habitación:</strong> ${tituloHabitacion}</p>
                        <p><strong>👤 Estudiante:</strong> ${nombreEstudiante}</p>
                        <p><strong>📧 Correo:</strong> ${correoEstudiante}</p>
                        <p><strong>💰 Monto pagado:</strong> S/ ${monto}</p>
                        <p><strong>🔖 ID de Reserva:</strong> ${reservaId}</p>
                        <p><strong>📅 Fecha:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <p>Por favor, coordina con el estudiante para la entrega de llaves.</p>
                    <p>Atentamente,<br>El equipo de CuscoRent</p>
                </div>
            `
        });
    } catch (e) {
        Logger.log('Error notificarArrendadorReserva: ' + e.message);
    }
}
