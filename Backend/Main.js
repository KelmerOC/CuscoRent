// ============================================================
// FUNCIÓN PRINCIPAL — SERVIR WEB APP
// ============================================================
function doGet(e) {
    let page = 'Login';
    if (e && e.parameter && e.parameter.page) {
        page = e.parameter.page;
    }
    
    const validPages = ['Login', 'Estudiante', 'Arrendador', 'Administrador'];
    if (!validPages.includes(page)) {
        page = 'Login';
    }

    return HtmlService.createTemplateFromFile(page)
        .evaluate()
        .setTitle('CuscoRent — ' + page)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getScriptUrl() {
    return ScriptApp.getService().getUrl();
}
