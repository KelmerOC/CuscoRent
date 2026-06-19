// ============================================================
// MÓDULO: GESTIÓN DE CARPETAS EN GOOGLE DRIVE
// ============================================================
/**
 * Obtiene la carpeta raíz de la plataforma.
 */
function getCarpetaRaiz() {
    return DriveApp.getFolderById(CONFIG.CARPETA_RAIZ_ID);
}
/**
 * Obtiene o crea una subcarpeta dentro de una carpeta padre.
 * @param {Folder} carpetaPadre — Carpeta padre de Drive
 * @param {string} nombre — Nombre de la subcarpeta
 * @returns {Folder}
 */
function obtenerOCrearSubcarpeta(carpetaPadre, nombre) {
    const carpetas = carpetaPadre.getFoldersByName(nombre);
    if (carpetas.hasNext()) {
        return carpetas.next();
    }
    return carpetaPadre.createFolder(nombre);
}
/**
 * Crea o recupera la estructura de carpetas completa para un usuario.
 * @param {string} tipoUsuario — 'estudiante' o 'arrendador'
 * @param {string} emailUsuario — Email del usuario (identificador)
 * @returns {Object} — { carpetaUsuario, subcarpetas: { nombre: Folder } }
 */
function obtenerOCrearEstructuraUsuario(tipoUsuario, emailUsuario) {
    const raiz = getCarpetaRaiz();
    // Carpeta de tipo (ESTUDIANTES o ARRENDADORES)
    const nombreTipo = tipoUsuario === 'estudiante' ? 'ESTUDIANTES' : 'ARRENDADORES';
    const carpetaTipo = obtenerOCrearSubcarpeta(raiz, nombreTipo);
    // Carpeta individual del usuario (por email)
    const emailSanitizado = emailUsuario.trim().toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    const carpetaUsuario = obtenerOCrearSubcarpeta(carpetaTipo, emailSanitizado);
    // Crear subcarpetas según el tipo de usuario
    const listaCarpetas = tipoUsuario === 'estudiante'
        ? CONFIG.CARPETAS_ESTUDIANTE
        : CONFIG.CARPETAS_ARRENDADOR;
    const subcarpetas = {};
    listaCarpetas.forEach(nombre => {
        subcarpetas[nombre] = obtenerOCrearSubcarpeta(carpetaUsuario, nombre);
    });
    // Para arrendadores, crear Sheet placeholder vacío si no existe
    if (tipoUsuario === 'arrendador') {
        crearSheetPlaceholderSiNoExiste(subcarpetas['sheets_placeholder'], emailSanitizado);
    }
    return {
        carpetaUsuario: carpetaUsuario,
        subcarpetas: subcarpetas
    };
}
/**
 * Inicializa la estructura de carpetas al registrar un usuario.
 * Llamar después de un registro exitoso.
 */
function inicializarCarpetasUsuario(tipoUsuario, emailUsuario) {
    try {
        const estructura = obtenerOCrearEstructuraUsuario(tipoUsuario, emailUsuario);
        return {
            success: true,
            message: 'Estructura de carpetas creada correctamente.',
            carpetaId: estructura.carpetaUsuario.getId()
        };
    } catch (e) {
        Logger.log('Error inicializarCarpetasUsuario: ' + e.message);
        return { success: false, message: 'Error al crear carpetas: ' + e.message };
    }
}
// ============================================================
// MÓDULO: SHEETS PLACEHOLDER
// ============================================================
/**
 * Crea un Google Sheet vacío en la carpeta placeholder si no existe.
 */
function crearSheetPlaceholderSiNoExiste(carpeta, identificador) {
    const archivos = carpeta.getFilesByType(MimeType.GOOGLE_SHEETS);
    if (archivos.hasNext()) return; // Ya existe al menos uno
    const sheet = SpreadsheetApp.create('Placeholder_' + identificador);
    const archivo = DriveApp.getFileById(sheet.getId());
    carpeta.addFile(archivo);
    // Remover de la raíz del Drive del propietario
    const rootFolder = DriveApp.getRootFolder();
    rootFolder.removeFile(archivo);
}
/**
 * Lista los Sheets placeholder de un arrendador.
 */
function listarSheetsPlaceholder(emailUsuario) {
    try {
        const estructura = obtenerOCrearEstructuraUsuario('arrendador', emailUsuario);
        const carpeta = estructura.subcarpetas['sheets_placeholder'];
        const archivos = carpeta.getFilesByType(MimeType.GOOGLE_SHEETS);
        const lista = [];
        while (archivos.hasNext()) {
            const archivo = archivos.next();
            lista.push({
                id: archivo.getId(),
                nombre: archivo.getName(),
                url: archivo.getUrl(),
                fechaCreacion: archivo.getDateCreated().toISOString()
            });
        }
        return { success: true, sheets: lista };
    } catch (e) {
        Logger.log('Error listarSheetsPlaceholder: ' + e.message);
        return { success: false, message: 'Error al listar sheets: ' + e.message };
    }
}
// ============================================================
// MÓDULO: VALIDACIÓN DE IMÁGENES
// ============================================================
/**
 * Valida el formato MIME de la imagen.
 */
function validarFormato(mimeType) {
    return CONFIG.FORMATOS_PERMITIDOS.includes(mimeType.toLowerCase());
}
/**
 * Valida que la extensión del archivo sea permitida.
 */
function validarExtension(nombreArchivo) {
    const ext = nombreArchivo.split('.').pop().toLowerCase();
    return CONFIG.EXTENSIONES_PERMITIDAS.includes(ext);
}
/**
 * Valida el tamaño del archivo en bytes.
 */
function validarTamano(bytesSize) {
    return bytesSize <= CONFIG.TAMANO_MAXIMO_BYTES;
}
/**
 * Valida la cantidad de archivos en una carpeta.
 */
function contarArchivosEnCarpeta(carpeta) {
    const archivos = carpeta.getFiles();
    let count = 0;
    while (archivos.hasNext()) {
        archivos.next();
        count++;
    }
    return count;
}
// ============================================================
// MÓDULO: CRUD DE IMÁGENES
// ============================================================
/**
 * Sube una imagen a la carpeta correspondiente del usuario.
 * @param {Object} datos — { base64, nombreArchivo, mimeType, tipoUsuario, emailUsuario, categoria }
 *   categoria: 'foto_perfil', 'carne_verificacion', 'dni', 'habitaciones', 'datos_personales'
 * @returns {Object} — { success, message, fileId?, url? }
 */
function subirImagen(datos) {
    try {
        // Validar formato
        if (!validarFormato(datos.mimeType)) {
            return { success: false, message: 'Formato no permitido. Solo se aceptan JPG, JPEG y PNG.' };
        }
        // Decodificar Base64
        const base64Data = datos.base64.indexOf(',') > -1
            ? datos.base64.split(',')[1]
            : datos.base64;
        const decodedBytes = Utilities.base64Decode(base64Data);
        // Validar tamaño post-decodificación
        if (!validarTamano(decodedBytes.length)) {
            return { success: false, message: 'La imagen excede el tamaño máximo de 5MB. Intenta comprimir más.' };
        }
        // Obtener estructura de carpetas
        const estructura = obtenerOCrearEstructuraUsuario(datos.tipoUsuario, datos.emailUsuario);
        const carpetaDestino = estructura.subcarpetas[datos.categoria];
        if (!carpetaDestino) {
            return { success: false, message: 'Categoría de carpeta no válida: ' + datos.categoria };
        }
        // Para habitaciones, verificar límite de 10 fotos
        if (datos.categoria === 'habitaciones') {
            const cantidadActual = contarArchivosEnCarpeta(carpetaDestino);
            if (cantidadActual >= CONFIG.MAX_FOTOS_HABITACIONES) {
                return {
                    success: false,
                    message: 'Has alcanzado el límite de ' + CONFIG.MAX_FOTOS_HABITACIONES + ' fotos de habitaciones.'
                };
            }
        }
        // Para categorías de archivo único (perfil, carné, DNI), eliminar el anterior
        const categoriasUnicas = ['foto_perfil', 'carne_verificacion', 'dni'];
        if (categoriasUnicas.includes(datos.categoria)) {
            eliminarTodosEnCarpeta(carpetaDestino);
        }
        // Si es datos_personales de arrendador y se especifica subcategoría
        if (datos.categoria === 'datos_personales' && datos.subcategoria) {
            // Manejar foto_perfil y dni dentro de datos_personales
            const prefijo = datos.subcategoria === 'foto_perfil' ? 'perfil_' : 'dni_';
            // Eliminar archivo previo con el mismo prefijo
            eliminarArchivosPorPrefijo(carpetaDestino, prefijo);
            datos.nombreArchivo = prefijo + datos.nombreArchivo;
        }

        if (datos.categoria === 'habitaciones' && datos.subcategoria) {
            datos.nombreArchivo = datos.subcategoria + '_' + datos.nombreArchivo;
        }
        // Crear el blob y guardarlo
        const blob = Utilities.newBlob(decodedBytes, datos.mimeType, datos.nombreArchivo);
        const archivo = carpetaDestino.createFile(blob);
        // Hacer el archivo accesible con link
        archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        return {
            success: true,
            message: 'Imagen subida correctamente.',
            fileId: archivo.getId(),
            url: 'https://drive.google.com/uc?id=' + archivo.getId(),
            nombre: archivo.getName()
        };
    } catch (e) {
        Logger.log('Error subirImagen: ' + e.message);
        return { success: false, message: 'Error al subir imagen: ' + e.message };
    }
}
/**
 * Actualiza (reemplaza) una imagen existente.
 * Elimina la anterior y sube la nueva.
 */
function actualizarImagen(datos) {
    // Para categorías únicas, subirImagen ya maneja la eliminación del anterior
    return subirImagen(datos);
}
/**
 * Elimina una imagen por su ID de archivo.
 */
function eliminarImagen(fileId) {
    try {
        const archivo = DriveApp.getFileById(fileId);
        archivo.setTrashed(true);
        return { success: true, message: 'Imagen eliminada correctamente.' };
    } catch (e) {
        Logger.log('Error eliminarImagen: ' + e.message);
        return { success: false, message: 'Error al eliminar imagen: ' + e.message };
    }
}
/**
 * Lista todas las imágenes de una categoría para un usuario.
 */
function listarImagenes(tipoUsuario, emailUsuario, categoria) {
    try {
        const estructura = obtenerOCrearEstructuraUsuario(tipoUsuario, emailUsuario);
        const carpeta = estructura.subcarpetas[categoria];
        if (!carpeta) {
            return { success: false, message: 'Categoría no válida.' };
        }
        const archivos = carpeta.getFiles();
        const lista = [];
        while (archivos.hasNext()) {
            const archivo = archivos.next();
            const mimeType = archivo.getMimeType();
            // Solo listar imágenes (no sheets u otros)
            if (mimeType.startsWith('image/')) {
                lista.push({
                    id: archivo.getId(),
                    nombre: archivo.getName(),
                    url: 'https://drive.google.com/uc?id=' + archivo.getId(),
                    thumbnailUrl: 'https://drive.google.com/thumbnail?id=' + archivo.getId() + '&sz=w400',
                    mimeType: mimeType,
                    tamano: archivo.getSize(),
                    fechaCreacion: archivo.getDateCreated().toISOString()
                });
            }
        }
        return { success: true, imagenes: lista };
    } catch (e) {
        Logger.log('Error listarImagenes: ' + e.message);
        return { success: false, message: 'Error al listar imágenes: ' + e.message };
    }
}
/**
 * Obtiene todas las imágenes de todas las categorías de un usuario.
 */
function obtenerTodasLasImagenes(tipoUsuario, emailUsuario) {
    try {
        const categorias = tipoUsuario === 'estudiante'
            ? CONFIG.CARPETAS_ESTUDIANTE
            : CONFIG.CARPETAS_ARRENDADOR.filter(c => c !== 'sheets_placeholder');
        const resultado = {};
        categorias.forEach(cat => {
            const res = listarImagenes(tipoUsuario, emailUsuario, cat);
            resultado[cat] = res.success ? res.imagenes : [];
        });
        return { success: true, imagenes: resultado };
    } catch (e) {
        Logger.log('Error obtenerTodasLasImagenes: ' + e.message);
        return { success: false, message: 'Error: ' + e.message };
    }
}
// ============================================================
// FUNCIONES AUXILIARES DE DRIVE
// ============================================================
/**
 * Elimina todos los archivos dentro de una carpeta (mover a papelera).
 */
function eliminarTodosEnCarpeta(carpeta) {
    const archivos = carpeta.getFiles();
    while (archivos.hasNext()) {
        archivos.next().setTrashed(true);
    }
}
/**
 * Elimina archivos que empiezan con un prefijo específico.
 */
function eliminarArchivosPorPrefijo(carpeta, prefijo) {
    const archivos = carpeta.getFiles();
    while (archivos.hasNext()) {
        const archivo = archivos.next();
        if (archivo.getName().startsWith(prefijo)) {
            archivo.setTrashed(true);
        }
    }
}
