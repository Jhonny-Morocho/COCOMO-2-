//PASO 4. Calcular el factor exponencial de Escala B  wj
function factorExponencialDeEscala_B(auxB){

    //factor de escala a nivel nominal

    if(auxB!=null && auxB !=''){
        var B=0;
        B=(1.01+0.01*auxB).toFixed(2);
        //$('.classB').html(B);
        return Number(B);
    }else{
        return 0;
    }
   
}

module.exports = factorExponencialDeEscala_B;
