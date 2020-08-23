//  function suma(a, b) {
//      return a + b;
//    }
//    module.exports = suma;
//PASO 5. 1. Esfuerzo Nominarl Requerido para desarrollar todo el el sistema (PM_nominal)
const A=2.94;
factorEscala_B=1.20;

function esfuerzoNominalPm_nominal(sloc){

    if(sloc!='' && sloc!=null ){
        var  KSLOCK=Number(sloc)/1000;
 
        PMnominal=(A*(Math.pow(KSLOCK,factorEscala_B))).toFixed(2);
        //5.1 escribiendo en la tabla resumen el Esfuerzo Nominal Estimado PM_nominal
       // $('.esfuerzoNominal').html(PMnominal);
    
        // PASO 5.2 como siguiente paso se calcula la productividad nominal (PRODUCTIVIDAD DEL PROYECTO)
        ProductividadNominal =(Number(sloc)/Number(PMnominal)).toFixed(2);
    
        return Number(PMnominal);
    }else{
        return 0;
    }
  
}

module.exports = esfuerzoNominalPm_nominal;
