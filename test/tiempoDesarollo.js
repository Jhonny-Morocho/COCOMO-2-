
function tiempoDesarrolo(Pm_estimado_total,B){

    //TDEV=(3.0*Math.pow(1,(0.33+0.2*(B-1.01))));

    if(Pm_estimado_total!=null && Pm_estimado_total !='' && B!=null && B !=''){
        TDEV=(3*Math.pow(Pm_estimado_total,(0.33+0.2*(B-1.01)))).toFixed(2);
        //$('.timeDevEstimado').html(TDEV);
    
        TDEVExtras=Number(TDEV*0.25)+Number(TDEV);

        // timepo de holgura 25%
        //$('.tiempoDevEstimado25').html(TDEVExtras.toFixed(2));
    
        return Number(TDEV);
    }else{
        return 0;
    }

}

module.exports = tiempoDesarrolo;