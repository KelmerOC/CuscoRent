// ============================================================
// MÓDULO: ACCESO A GOOGLE SHEETS
// ============================================================
function getSpreadsheet() {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}
function getSheetData(sheetName) {
    const sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    const headers = data[0];
    return data.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
    });
}
function appendRowData(sheetName, rowData) {
    try {
        const sheet = getSpreadsheet().getSheetByName(sheetName);
        if (!sheet) return false;
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const newRow = headers.map(h => rowData[h] || '');
        sheet.appendRow(newRow);
        return true;
    } catch (e) {
        Logger.log('Error appendRowData: ' + e.message);
        return false;
    }
}
