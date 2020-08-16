// ======================Calculo del factor Exponencial ==================================
// ======================Calculo del factor Exponencial ==================================
// ======================Calculo del factor Exponencial ==================================
// ======================Calculo del factor Exponencial ==================================


function factorExponencialDeEscala_B(){
    var B=0,numB=0 ;
    for(var i = 0; i < arrayDatoStatico.factorEscala.length; i++){
        numB = (arrayDatoStatico.factorEscala[i]);
        B = numB + B;
    }
    B=(1.01+0.01*B).toFixed(2);
    return B;
}


