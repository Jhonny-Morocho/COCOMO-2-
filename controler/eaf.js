
var proRELY = $('#proRELY').val();
var proData = $('#proData').val();
var proCPLX = $('#proCPLX').val();
var proTIME = $('#proTIME').val();
var proSTOR = $('#proSTOR').val();
var proVIRT = $('#proVIRT').val();
var proTURN = $('#proTURN').val();
var proACAP = $('#proACAP').val();
var proAEXP = $('#proAEXP').val();
var proPCAP = $('#proPCAP').val();
var proVEXP = $('#proVEXP').val();
var proMODP = $('#proMODP').val();
var proTOOL = $('#proTOOL').val();
var proSCED = $('#proSCED').val();

function calcularEAF(){
    
  return proRELY*proData*proCPLX*proTIME*proSTOR*proVIRT*proTURN*proACAP*proAEXP*proPCAP*proVEXP*proMODP*proTOOL*proSCED;

}

// function calculoDelEsfuerzoAplicado(){
//     return 
// }
// $('#formCocomo').on('submit',function(e){
//     e.preventDefault();
//     var datos=$(this).serializeArray();

//     console.log(datos);//imprimr los valores
// });
