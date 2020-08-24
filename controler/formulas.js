



// ==========================================VARIABLES======================
// obtener todos los array de nombe del modulo del formuario
var arrayNombreModulo=[];
var arraynumeroSlocModulo=[];
var sueldoMesPersona=[];
var emMultiplicadorEsfuerzoPostProduccion=[];
var factorEscala_B=0;
var dataFormulario={};
var esfuerzoNominalPM_porModulo=[];
var esfuerzoPm_estimado_modulo=[];
var PMnominal=0;
var ProductividadNominal=0;
var factorAjusteEsfuerzoEAF=[];
var TDEV=0;
var sumaNodoPm_estimadoTotal=0;
var costoTotalProyecto=0;
const A=2.94;//es una constante que captura los efectos lineales sobre el esfuerzo de acuerdo a la variación del tamaño
//===============================Obtener datos del formulario=============================//

//1. Obtener los datos del forumuario
$('#idformCocommo').on('submit',function (e){
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
    //PASO 8. Factor de Ajuste del Esfuerzo DE LA TABLA Costo Post PRODUCCION
    var auxEAF=1;// lo inicalizo en 1 , por q si le pongo cero todo se hace cero
    for (let index = 3; index < 20; index++) {
         auxEAF=Number(datos[index].value)*auxEAF;
     }
    factorAjusteEsfuerzoEAF.push((auxEAF).toFixed(2));
    //almaceno los datos en un objeto
    dataFormulario={nombreModulo:arrayNombreModulo,
                        sloc:arraynumeroSlocModulo,
                        sueldo:sueldoMesPersona,
                    EAF:factorAjusteEsfuerzoEAF};

    console.log(dataFormulario);

    //imprimirTabla y enviao los datos del formulario
    imprimirTabla(dataFormulario,esfuerzoNominalPM_porModulo);
    //alert("Imprme tabla");
    //$('.nodosData').remove();
    toastr.success('Se añadio '+datos[0].value);
});


$('#idFormCalcularEstimacion').on('submit',function (e){
    e.preventDefault();
    var datos2=$(this).serializeArray();
    console.log(datos2);

    //obtener todos los nodos soloc
    var nodosSoloc=$('.soloc');


    //determinar el tamaño en SLOC del sistema
    tamañoSlocSistema(nodosSoloc);
     //obtener el factor de escala es global
     var auxfactorEscala_B=0;
     for (let index = 0; index < 5; index++) {
         auxfactorEscala_B = Number(datos2[index].value)+auxfactorEscala_B;
     }
     // asigno el facto de escala
     factorEscala_B=factorExponencialDeEscala_B(auxfactorEscala_B);

    //Esfuerzo nominal para desarrollar el sistema envio el numero de lineas de codigo toal del sistema, B
    esfuerzoNominalPm_nominal(tamañoSlocSistema(nodosSoloc));
    // Calcular Esfuerzo Nominal por Módulo
    PM_porModulo();

   
      // actulizar la tabla con los nuevos datos
    try {
        imprimirTabla(dataFormulario,PM_porModulo());
        // una vez que tenga la tabla impresa ya se puede tomar los nodos para hacer los calculos del PM_estimado total
         //Suma los PM_estimado de cada fila y realizar el total 
        var nodoPmEstimado=$('.classPM_estimado');
        PM_estimadoTotal(nodoPmEstimado);
        //se impre en la tabla de resumene
        $('.esfuerzoEstimadoDelSistemTotal').html(PM_estimadoTotal(nodoPmEstimado));


        //tiempo de dasarrollo
        tiempoDesarrolo(PM_estimadoTotal(nodoPmEstimado),factorEscala_B);

        // numero de personas para desarrollar el proyecto
        numeroPersonas(esfuerzoNominalPm_nominal(tamañoSlocSistema(nodosSoloc)),tiempoDesarrolo(PM_estimadoTotal(nodoPmEstimado),factorEscala_B));
        //costo total del proyecto 
        costoTotalSistema();
        toastr.success('Calculo efectuado exitosamente');
        //imprimirTabla(dataFormulario,PM_porModulo());
    } catch (error) {
        //console.log("No existen datos en la tabla"); 

        toastr.error('No existen Datos en la tabla ');
    }
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
    $('.classB').html(B);
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
    return PMnominal;
}


// PASO 6. Esfuerzo Nominal Por modulo 
 function PM_porModulo(){
    for (let index = 0; index < arraynumeroSlocModulo.length; index++) {
        // Pm_proModulo= Sloc_porModulo/ProductividadNominal
        esfuerzoNominalPM_porModulo[index]=(arraynumeroSlocModulo[index]/ProductividadNominal).toFixed(2);
    }
    return   esfuerzoNominalPM_porModulo;
 }

// PASO 7 . ANALIZAR LOS AJUSTES DESDE LAS TABLAS PARA CALIBRAR
//=============SOLO ANALISIS=================
//=============SOLO ANALISIS=================

//PASO 8. CALCULAR EL FACTOR DE AJUSTE EN EL SUBMIT DEL POST
//========EN EL POST DEL FORMULARIO ==========
//========EN EL POST DEL FORMULARIO ==========

//PASO 9. Esfuerzo estimado por modulo(Pm_estimado_modulo = Pm_nominal_modulo*EAF)
// Se realizo la operacio en el mismo lugar donde se impre los datos con objetivo de optimizar codigo


//PASO 10. Esfuerzo Estimado del Sistema Total PM_estimado de todo el sistema
function PM_estimadoTotal(nodosPm_estimado){
    sumaNodoPm_estimadoTotal=0;
    for (let index = 0; index < nodosPm_estimado.length; index++) {
        sumaNodoPm_estimadoTotal=Number(nodosPm_estimado[index].innerText)+Number(sumaNodoPm_estimadoTotal);
    }
  
    return sumaNodoPm_estimadoTotal;
}

//PASO 11. Determinar el Tiempo de desarrollo  estimado del proyecto TDEV
function tiempoDesarrolo(Pm_estimado_total,B){

    //TDEV=(3.0*Math.pow(1,(0.33+0.2*(B-1.01))));
    TDEV=(3*Math.pow(Pm_estimado_total,(0.33+0.2*(B-1.01)))).toFixed(2);
    console.log(TDEV);
    $('.timeDevEstimado').html(TDEV);

    TDEVExtras=Number(TDEV*0.25)+Number(TDEV);
    console.log(TDEVExtras);
    // timepo de holgura 25%
    $('.tiempoDevEstimado25').html(TDEVExtras.toFixed(2));

    return TDEV;
}

// PASO 13. Costo Total del Sistema sumando los valores obtenidos de costo del PASO 12

function costoTotalSistema(){
    costoTotalProyecto=0;

    var nodosCosto=$('.classCosto');
    for (let index = 0; index < nodosCosto.length; index++) {
        costoTotalProyecto=Number(nodosCosto[index].innerText)+Number(costoTotalProyecto);
    }
    // costo del proyecto real
    $('.costoTotalSistema').html(costoTotalProyecto.toFixed(2));

    //agregar al costo el 10% extra
    $('.costoTotalSistema10').html((costoTotalProyecto+(costoTotalProyecto*0.10)).toFixed(2));

   

    console.log(costoTotalProyecto);
    return costoTotalProyecto;
}

//PASO 14 . NO SE LO TOMO EN CUENTA YA QUE ES UN VALOR Q NO SE LO NECESITA

//PASO 15. PARA CADA MODULO DETERMINAR LA PRODUCTIVDAD(SLOCK/ESFUERZO ESTIMADO)


//PASO 16. NUMERO DE PERSONAS REQUERIDAS
function numeroPersonas(esfuerzo,tiempoDesarrollo){
    console.log(esfuerzo);
    console.log(tiempoDesarrollo);

    $('.personasRequerido').html((esfuerzo/tiempoDesarrollo).toFixed(2));
} 


$('.limpiarDatos').on('click',function (e){
    //&toastr.success('Datos Limpiados');
    location.reload();

});