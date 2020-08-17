



// ==========================================VARIABLES======================
// obtener todos los array de nombe del modulo del formuario
var arrayNombreModulo=[];
var arraynumeroSlocModulo=[];
var sueldoMesPersona=[];
var emMultiplicadorEsfuerzoPostProduccion=[];
var factorEscala_B=0;
var dataFormulario={};
var esfuerzoNominalPM_porModulo=[];
var PMnominal=0;
var ProductividadNominal=0;
var factorAjusteEsfuerzoEAF=[];
const A=2.94;//es una constante que captura los efectos lineales sobre el esfuerzo de acuerdo a la variación del tamaño
//===============================Obtener datos del formulario=============================//

//1. Obtener los datos del forumuario
$('#idformCocommo').on('submit',function(e){
    e.preventDefault();
    var datos=$(this).serializeArray();
    console.log(datos);
    //guardo dato nombre del modulo
    arrayNombreModulo.push(datos[0].value);
    //guardo dato sloc del modulo
    arraynumeroSlocModulo.push(datos[1].value);
    //guardo dato sueldoMesPersona del modulo
    sueldoMesPersona.push(datos[2].value);
    //guardo dato multiplicadores de ajuste EAF (factos de costo post produccion)
    var auxEAF=1;// lo inicalizo en 1 , por q si le pongo cero todo se hace cero
    var dataAux=[0.87,0.87 ,0.85,1.15, 0.81 ,1.09 ,1.09 , 0.90];
    for (let index = 3; index < 20; index++) {
         auxEAF=Number(datos[index].value)*auxEAF;
     }
    factorAjusteEsfuerzoEAF.push((auxEAF).toFixed(2));
    //almaceno los datos en un objeto
    dataFormulario={nombreModulo:arrayNombreModulo,
                        sloc:arraynumeroSlocModulo,
                    EAF:factorAjusteEsfuerzoEAF};

    console.log(dataFormulario);

    //imprimirTabla y enviao los datos del formulario
    imprimirTabla(dataFormulario,esfuerzoNominalPM_porModulo);
    //alert("Imprme tabla");
    //$('.nodosData').remove();
});


$('#idFormCalcularEstimacion').on('submit',function(e){
    e.preventDefault();
    var datos=$(this).serializeArray();
    console.log(datos);

    //obtener todos los nodos soloc
    var nodosSoloc=$('.soloc');

    //determinar el tamaño en SLOC del sistema
    tamañoSlocSistema(nodosSoloc);
     //obtener el factor de escala es global
     var auxfactorEscala_B=0;
     for (let index = 0; index < 5; index++) {
         auxfactorEscala_B = Number(datos[index].value)+auxfactorEscala_B;
     }
     // asigno el facto de escala
     factorEscala_B=factorExponencialDeEscala_B(auxfactorEscala_B);

    //Esfuerzo nominal para desarrollar el sistema envio el numero de lineas de codigo toal del sistema, B
    esfuerzoNominalPm_nominal(tamañoSlocSistema(nodosSoloc));
    // Calcular Esfuerzo Nominal por Módulo
    PM_porModulo();

    //Calcular Factor de Ajuste del Esfuerzo 
});





//PASO 3. Contar total de lineas de codigo
function tamañoSlocSistema(nodosSoloc){
    var tamañaSistema=0;
    for (let index = 0; index < nodosSoloc.length; index++) {
        tamañaSistema=Number(nodosSoloc[index].innerText)+tamañaSistema;
    }
    //
    $('.totalSlock').html(tamañaSistema);
    return tamañaSistema;
}
//PASO 4. Calcular el factor exponencial de Escala B  wj
function factorExponencialDeEscala_B(auxB){

    //factor de escala a nivel nominal
    var B=0;
    B=(1.01+0.01*auxB).toFixed(2);
    return B;
}


//PASO 5. 1. Esfuerzo Nominarl Requerido para desarrollar todo el el sistema (PM_nominal)
function esfuerzoNominalPm_nominal(sloc){
    var  KSLOCK=Number(sloc)/1000;
    PMnominal=(A*(Math.pow(KSLOCK,factorEscala_B))).toFixed(2);
    //5.1 escribiendo en la tabla resumen el Esfuerzo Nominal Estimado PM_nominal
    $('.esfuerzoNominal').html(PMnominal);

    // PASO 5.2 como siguiente paso se calcula la productividad nominal (PRODUCTIVIDAD DEL PROYECTO)
    ProductividadNominal =(Number(sloc)/Number(PMnominal)).toFixed(2);
    $('.productividadNominal').html(ProductividadNominal);
}


// PASO 6. Esfuerzo Nominal Por modulo 
 function PM_porModulo(){
    for (let index = 0; index < arraynumeroSlocModulo.length; index++) {
        // Pm_proModulo= Sloc_porModulo/ProductividadNominal
        esfuerzoNominalPM_porModulo[index]=(arraynumeroSlocModulo[index]/ProductividadNominal).toFixed(2);
    }
    // actulizar la tabla con los nuevos datos
    try {
        imprimirTabla(dataFormulario,esfuerzoNominalPM_porModulo);
    } catch (error) {
        //console.log("No existen datos en la tabla"); 
        alert("No existen Datos en la tabla ");
    }
    //return   esfuerzoNominalPM_porModulo;
 }

 // PASO 8. Factor de Ajuste del Esfuerzo 
 function calcularEAF(dataFormulario){
    return proRELY*proData*proCPLX*proTIME*proSTOR*proVIRT*proTURN*proACAP*proAEXP*proPCAP*proVEXP*proMODP*proTOOL*proSCED;
  }