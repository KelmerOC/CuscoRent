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
        return { success: true, role: role, user: user };
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
    return { success: success, message: success ? 'Registro completado con éxito.' : 'Error al guardar.' };
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
            subject: 'Recuperación de Contraseña - UniStay',
            htmlBody: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #FF9800; text-align: center;">UniStay</h2>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Has solicitado recuperar tu contraseña. Aquí tienes tus datos de acceso:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; margin: 20px 0;">
                        <strong>Contraseña:</strong> ${password}
                    </div>
                    <p>Si no fuiste tú quien solicitó esto, por favor ignora este correo.</p>
                    <p>Atentamente,<br>El equipo de UniStay</p>
                </div>
            `
        });
        return { success: true, message: 'Se ha enviado un correo con tu contraseña. Por favor, revisa tu bandeja de entrada o spam.' };
    } catch(e) {
        Logger.log('Error al enviar correo de recuperación: ' + e.message);
        return { success: false, message: 'Hubo un error al enviar el correo. Por favor, intenta de nuevo más tarde.' };
    }
}
