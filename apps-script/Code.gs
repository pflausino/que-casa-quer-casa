/**
 * @OnlyCurrentDoc
 *
 * A anotação @OnlyCurrentDoc acima é ESSENCIAL: ela limita a permissão do
 * script apenas a ESTA planilha (escopo não sensível). Sem ela, o Google pede
 * acesso a "todas as suas planilhas" — uma permissão sensível que dispara o
 * bloqueio "Este app foi bloqueado / app não verificado" na autorização.
 *
 * Apps Script — recebe as confirmações de presença (RSVP) do site
 * e grava cada uma como uma nova linha na planilha do Google.
 *
 * Como usar (passo a passo no README.md do projeto):
 *  1. Crie uma planilha nova no Google Sheets.
 *  2. Menu: Extensões > Apps Script.
 *  3. Apague o conteúdo padrão e cole TODO este arquivo.
 *  4. Implantar > Nova implantação > tipo "App da Web".
 *       - Executar como: Eu (seu e-mail)
 *       - Quem pode acessar: Qualquer pessoa
 *  5. Copie a URL (termina em /exec) e cole em config.js do site.
 */

// Cabeçalhos das colunas (a ordem define as colunas da planilha).
var HEADERS = [
  "Data/Hora",
  "Nome completo",
  "Vai comparecer?",
  "Acompanhantes adultos",
  "Crianças (<11)",
  "Total de pessoas",
  "Recado"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // evita gravações simultâneas sobrescrevendo

  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var attending = (data.attending === "sim") ? "Sim" : "Não";
    var adults = Number(data.adults) || 0;
    var children = Number(data.children) || 0;
    // +1 = a própria pessoa que confirmou (se vier).
    var total = (data.attending === "sim") ? (1 + adults + children) : 0;

    sheet.appendRow([
      data.timestamp ? new Date(data.timestamp) : new Date(),
      String(data.fullname || "").substring(0, 200),
      attending,
      adults,
      children,
      total,
      String(data.message || "").substring(0, 1000)
    ]);

    return json_({ result: "ok" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Permite testar a URL abrindo no navegador.
function doGet() {
  return json_({ result: "ok", message: "RSVP endpoint ativo." });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("RSVP") || ss.insertSheet("RSVP");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
         .setFontWeight("bold")
         .setBackground("#d4af37");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
