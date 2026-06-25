// ============================================================
// MÓDULO: AUTENTICACIÓN
// ============================================================
function loginUser(email, password, role) {
    let sheetName;
    let emailKey;

    if (role === 'estudiante') {
        sheetName = 'Estudiantes';
        emailKey = 'CorreoInstitucional';
    } else if (role === 'arrendador') {
        sheetName = 'Arrendadores';
        emailKey = 'Email';
    } else if (role === 'administrador') {
        sheetName = 'Administradores';
        emailKey = 'Correo';
    } else {
        return { success: false, message: 'Rol no válido.' };
    }

    const data = getSheetData(sheetName);
    const user = data.find(u =>
        String(u[emailKey]).trim().toLowerCase() === email.trim().toLowerCase() &&
        String(u.Contrasena) === String(password)
    );
    if (user) {
        let redirectUrl = role === 'estudiante' ? '?page=Estudiante' : role === 'arrendador' ? '?page=Arrendador' : '?page=Administrador';
        return { success: true, role: role, user: user, redirectUrl: redirectUrl };
    }
    return { success: false, message: 'Credenciales incorrectas o usuario no registrado.' };
}

function registerUser(role, userData) {
    const sheetName = role === 'estudiante' ? 'Estudiantes' : 'Arrendadores';
    const emailKey = role === 'estudiante' ? 'CorreoInstitucional' : 'Email';
    const idKey = role === 'estudiante' ? 'EstudianteID' : 'ArrendadorID';
    const data = getSheetData(sheetName);
    const exists = data.some(u =>
        String(u[emailKey]).trim().toLowerCase() === userData[emailKey].trim().toLowerCase()
    );
    if (exists) return { success: false, message: 'El correo ya se encuentra registrado.' };
    userData[idKey] = 'ID-' + Math.floor(Math.random() * 900000 + 100000);
    
    if (role === 'arrendador') {
        userData['EstadoVerificacion'] = 'Verificado';
        userData['SuscripcionPremium'] = userData['SuscripcionPremium'] || 'No';
        userData['CalificacionPromedio'] = userData['CalificacionPromedio'] || '0';
    }
    if (role === 'estudiante') {
        userData['BuscaRoommate'] = userData['BuscaRoommate'] || 'No';
        userData['Intereses'] = userData['Intereses'] || '';
    }

    const success = appendRowData(sheetName, userData);
    return { success: success, message: success ? 'Registro completado con éxito.' : 'Error al guardar.', redirectUrl: '?page=Login' };
}

function recuperarCuenta(email) {
    let sheetName = null;
    let emailKey = null;
    let foundUser = null;
    
    // Buscar en estudiantes
    const dataEst = getSheetData('Estudiantes');
    foundUser = dataEst.find(u => String(u['CorreoInstitucional']).trim().toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
        sheetName = 'Estudiantes';
        emailKey = 'CorreoInstitucional';
    } else {
        // Buscar en arrendadores
        const dataArr = getSheetData('Arrendadores');
        foundUser = dataArr.find(u => String(u['Email']).trim().toLowerCase() === email.trim().toLowerCase());
        if (foundUser) {
            sheetName = 'Arrendadores';
            emailKey = 'Email';
        }
    }

    if (!foundUser) {
        return { success: false, message: 'El correo no se encuentra registrado en el sistema.' };
    }

    const password = foundUser['Contrasena'];
    const nombre = foundUser['NombreCompleto'];

     try {
         MailApp.sendEmail({
             to: email,
             subject: 'Recuperación de Contraseña - CuscoRent',
             htmlBody: `
                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                     <h2 style="color: #c28e46; text-align: center;">CuscoRent</h2>
                     <p>Hola <strong>${nombre}</strong>,</p>
                     <p>Has solicitado recuperar tu contraseña. Aquí tienes tus datos de acceso:</p>
                     <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; margin: 20px 0;">
                         <strong>Contraseña:</strong> ${password}
                     </div>
                     <p>Si no fuiste tú quien solicitó esto, por favor ignora este correo.</p>
                     <p>Atentamente,<br>El equipo de CuscoRent</p>
                 </div>
             `
         });
         return { success: true, message: 'Se ha enviado un correo con tu contraseña. Por favor, revisa tu bandeja de entrada o spam.', redirectUrl: '?page=Login' };
     } catch(e) {
         Logger.log('Error al enviar correo de recuperación: ' + e.message);
         return { success: false, message: 'Hubo un error al enviar el correo. Por favor, intenta de nuevo más tarde.', redirectUrl: '?page=Login' };
     }
}

function actualizarPerfilEstudiante(datos) {
    const id = datos && datos.EstudianteID;
    if (!id) return { success: false, message: 'Falta EstudianteID.' };

    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName('Estudiantes');
    if (!sheet) return { success: false, message: 'Hoja Estudiantes no encontrada.' };

    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const colEstudianteID = headers.indexOf('EstudianteID');
    if (colEstudianteID === -1) return { success: false, message: 'Columna EstudianteID no encontrada.' };

    for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][colEstudianteID]) === String(id)) {
            const editableFields = ['NombreCompleto', 'Telefono', 'BuscaRoommate', 'Intereses'];
            editableFields.forEach(function(field) {
                const col = headers.indexOf(field);
                if (col !== -1 && datos[field] !== undefined) {
                    sheet.getRange(i + 1, col + 1).setValue(datos[field]);
                }
            });
            return { success: true, message: 'Perfil actualizado correctamente.' };
        }
    }
    return { success: false, message: 'Estudiante no encontrado.' };
}

function actualizarPerfilArrendador(datos) {
    const id = datos && datos.ArrendadorID;
    if (!id) return { success: false, message: 'Falta ArrendadorID.' };

    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName('Arrendadores');
    if (!sheet) return { success: false, message: 'Hoja Arrendadores no encontrada.' };

    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const colArrendadorID = headers.indexOf('ArrendadorID');
    if (colArrendadorID === -1) return { success: false, message: 'Columna ArrendadorID no encontrada.' };

    for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][colArrendadorID]) === String(id)) {
            const editableFields = ['NombreCompleto', 'Telefono'];
            editableFields.forEach(function(field) {
                const col = headers.indexOf(field);
                if (col !== -1 && datos[field] !== undefined) {
                    sheet.getRange(i + 1, col + 1).setValue(datos[field]);
                }
            });
            return { success: true, message: 'Perfil actualizado correctamente.' };
        }
    }
    return { success: false, message: 'Arrendador no encontrado.' };
}

function actualizarCampoUsuario(tipoUsuario, emailUsuario, campo, valor) {
    const sheetName = tipoUsuario === 'estudiante' ? 'Estudiantes' : 'Arrendadores';
    const emailKey = tipoUsuario === 'estudiante' ? 'CorreoInstitucional' : 'Email';

    try {
        const sheet = getSpreadsheet().getSheetByName(sheetName);
        if (!sheet) return { success: false, message: 'Hoja ' + sheetName + ' no encontrada.' };

        const rows = sheet.getDataRange().getValues();
        const headers = rows[0];
        const colEmail = headers.indexOf(emailKey);
        const colCampo = headers.indexOf(campo);

        if (colEmail === -1) return { success: false, message: 'Columna ' + emailKey + ' no encontrada.' };
        if (colCampo === -1) return { success: false, message: 'Columna ' + campo + ' no encontrada.' };

        for (let i = 1; i < rows.length; i++) {
            if (String(rows[i][colEmail]).trim().toLowerCase() === String(emailUsuario).trim().toLowerCase()) {
                sheet.getRange(i + 1, colCampo + 1).setValue(valor);
                return { success: true, message: 'Campo ' + campo + ' actualizado correctamente.' };
            }
        }
        return { success: false, message: 'Usuario no encontrado.' };
    } catch(e) {
        Logger.log('Error en actualizarCampoUsuario: ' + e.message);
        return { success: false, message: 'Error del servidor: ' + e.message };
    }
}
