var util_test_              = lib.util_test;
var util_response_          = lib.util_response;
var util_responseArray_     = lib.util_responseArray;
var util_txtRamdom_         = lib.util_txtRamdom;
var util_codeVideo_         = lib.util_codeVideo;
var util_formatDateISO_     = lib.util_formatDateISO;
var util_unique_            = lib.util_unique;
var util_sumaID_            = lib.util_sumaID;
var util_onlyData_          = lib.util_onlyData;
var util_indexOf_           = lib.util_indexOf;
var util_restaHora_         = lib.util_restaHora;
var util_simplificarCadena_ = lib.util_simplificarCadena;
var util_incrementable_     = lib.util_incrementable;
var util_sort_              = lib.util_sort;
var util_parseUrl_          = lib.util_parseUrl;
var util_getWeek_           = lib.util_getWeek;
var util_getdata_           = lib.util_getdata;
var util_markTest_          = lib.util_markTest;
var util_testErrores_       = lib.util_testErrores;
var util_parseDate_         = lib.util_parseDate;
var util_appendRow_         = lib.util_appendRow;
var util_addContact_        = lib.util_addContact;
var patron_http_            = lib.patron_http;
var date_today_             = lib.date_today;
var date_weekno_            = lib.date_weekno;
var date_year_              = lib.date_year;
var date_beforeLastWeek_    = lib.date_beforeLastWeek;
var date_lastWeek_          = lib.date_lastWeek;
var date_yesterday_         = lib.date_yesterday;
var json_creaFile_          = lib.json_creaFile;
var mail_                   = Session.getActiveUser().getEmail();
var name_                   = "Nombre"; /*NOMBRE DEL SERVICIO*/
var msjSubject_             = "Inscripción en la newsletter de " + name_; /*SUBJECT DE LA INSCRIPCIÓN*/
var msjInscripcion          = 'Hemos recibido tú solicitud de inscripción de la newsletter de '+name_+'.<br/><br/>Muchas gracias por tú interes.'; /*MENSAJE DE LA INSCRIPCIÓN*/
var msjBaja_                = "La baja se ha realizado con exito";  /*MENSAJE AL PRODUCIRSE LA BAJA*/


var ss = SpreadsheetApp.getActiveSpreadsheet();
var ssMail = function(){return ss.getSheetByName("mails")};

function doGet(e) {
  if(e.parameter.baja){
    var ss = ssMail();
    var ldata = util_getdata_(ss);
    for(var i in ldata){
      if(Date.parse(ldata[i].date).toString() == e.parameter.id.toString()){
        var row = Number(i)+1;
        ss.deleteRow(row);
        return HtmlService.createHtmlOutput('<b>'+msjBaja_+'</b>');
      }
    }
  }
}

function recepcionDato(){
  var lock = LockService.getUserLock();
  lock.waitLock(5000);
  var ss = ssMail();
  var ldata = util_getdata_(ss);
  for (var i = 0; i < ldata.length; i++){
    if(!ldata[i].test){
      var mail = ldata[i].mail;
      var date = Date.parse(ldata[i].date).toString();
      var message = "<html><body><p>" + msjInscripcion + "</p></html></body>";
      var d = [];
      d.email = ldata[i].mail;
      MailApp.sendEmail(mail, msjSubject_,"", {htmlBody: message, name:name_, replyTo:mail_});
      util_markTest_(ldata[i].date.toString(),ldata,"x",'test',ss);
    }
  }
  lock.releaseLock();
}

function envia(){
    var subject = "Newsletter de "+ name_;
    var message = '<div>';
    message += '<br>';
    message += '<div>';
    message += '<h2><a href="'+ /*url*/ +'">'+ /*title*/ +'</a></h2>';
    message += '<p>'+ /*content*/ +' <a href="'+ /*url*/ +'">Ir a la noticia</a></p>';
    message += '</div>';
    message += '</div>';
    
    var ss = ssMail_();
    var data = util_onlyData_(util_getdata_(ss));
    for (var i = 0; i < data.length; i++){
       var htmlBody = bodyNewsletter_(message,data[i].date,url);
       MailApp.sendEmail(data[i].mail, subject,"", {htmlBody: htmlBody, name:name_, replyTo:mail_});
    } 
}

function bodyNewsletter_(message,id,url){
  var baja = ScriptApp.getService().getUrl()+'?id='+ Date.parse(id).toString() +'&baja=true';
  var body = "<html>";
  body +=     "<head>";
  body +=      "<title>Newsletter de "+ name_ +"</title>";
  body +=      '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">';
  body +=     "</head>";
  body +=     "<body>";
  body +=      '<div>';
  body +=       '<div>';
  body +=        '<p><a href="'+ url +'">Ver la noticia en tu navegador</a></p>';
  body +=         '<div>';
  body +=          '<h1>Newsletter de '+ name_ +'</h1>';
  body +=          '<p>'+ fecha_(new Date()) +'</p>';
  body +=           message
  body +=         '</div>';
  body +=         '<br>';
  body +=         '<p><a href="'+ baja +'">Darme de baja de la newsletter.</a></p>';
  body +=        '</div>';
  body +=       '</div>';
  body +=      '</html>';
  body +=     '</body>'; 
  return body
}

function fecha_(date){
  var week=["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sabado"];
  var month = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return week[date.getDay()]+" "+date.getDate()+" de "+month[date.getMonth()]+" del "+date.getFullYear();
}


var scriptProperties = PropertiesService.getScriptProperties();

function creaSpreadsheet(){

  var idss = SpreadsheetApp.create("Newsletter").getId();
  scriptProperties.setProperty('idss', idss);
  
  var idform = FormApp.create("Newsletter").getId();
  scriptProperties.setProperty('idform', idform);
  
  var form = FormApp.openById(idform);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, idss);
  
  SpreadsheetApp.openById(idss).getSheets()[0].setName('mails');
  
  form.addTextItem().setTitle('mail');
  form.addTextItem().setTitle('test');
}


