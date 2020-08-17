
var arrayDatoStatico={nombre:['Qedit','Search','Output','UpEdit','Modify','Utils'],
slock:[1800,700,1200,1700,900,1731],
factorEscala:[3.72 , 3.04],
EAF:[0.54,0.39],
Sueldo:[5370,5370]
}


function calcularEAF(){

return proRELY*proData*proCPLX*proTIME*proSTOR*proVIRT*proTURN*proACAP*proAEXP*proPCAP*proVEXP*proMODP*proTOOL*proSCED;

}







//3 Calcular el Esfuerzo Nominal requerido para desarrollar el sistema, PMNominal, en la celda 29 y la
//Productividad del Proyecto en la celda 30
var PMnominal=0, KSLOCK=sloc/1000;


//Formula=> PMnominal=A*(KSLOCK)^B;// KSLOCL=> es una medidad, donde 1 KSLOCK equivale a mil lineas de codigo fuente

 //==============TOTAL================//

   PMnominal=(A*(Math.pow(KSLOCK,B))).toFixed(2);
   $('.esfuerzoNominal').html(PMnominal);
	

// factor de productividad 
var ProductividadNominal=0;

 ProductividadNominal=(sloc/PMnominal).toFixed(2);
 $('.productividadNominal').html(ProductividadNominal);

//=======================================Variables globales===============================//
//=======================================Variables globales===============================//
//=======================================Variables globales===============================//
var esfuerzoEstimadoDelSistemTotal=0;
var TDEV=0;
//Multiplicadores de esfuerzo EAF_(modulo)=proRELY*proData*proCPLX*proTIME*proSTOR*proVIRT*proTURN*proACAP*proAEXP*proPCAP*proVEXP*proMODP*proTOOL*proSCED;

//Esfuerzo Estimado por Módulo =PM_(nominal-modulo)*EAF_(modulo)
var Pm_estimado_modulo=0;

//=======================================IMPRIMIR TABLA===============================//


function imprimirTabla(dataFormulario,dataPm_porModulo){
	//borra nodoAnterior para seguir imprimiento
	$('.dataTablaEstimaciones').remove();
	//imprimir los datos del objeto dataFormulario 
	for(var i = 0; i < dataFormulario.sloc.length; i++){

		Pm_estimado_modulo=(arrayDatoStatico.EAF[i]*(arrayDatoStatico.slock[i]/ProductividadNominal)).toFixed(2);
		TD='<tr class="dataTablaEstimaciones">'+
			
				'<td>'+(i+1)+'</td>'+
				'<td>'+dataFormulario.nombreModulo[i]+'</td>'+
				'<td class="soloc">'+dataFormulario.sloc[i]+'</td>'+
				'<td>'+dataFormulario.EAF[i]+'</td>'+
				'<td>'+dataPm_porModulo[i]+'</td>'+
				'<td>'+Pm_estimado_modulo+'</td>'+
				'<td>'+arrayDatoStatico.Sueldo[i]+'</td>'+
				'<td>'+(arrayDatoStatico.Sueldo[i]*Pm_estimado_modulo).toFixed(2)+'</td>'+

			
			'/<tr>';
			//añadir nodos a la tabla  Formulario para la estimación de esfuerzo y tiempo de desarrollo utilizando 
		$('.dataAfter').after(TD);
		esfuerzoEstimadoDelSistemTotal+=arrayDatoStatico.EAF[i]*(arrayDatoStatico.slock[i]/ProductividadNominal);
	}
}


//Tiempo de dasarrolo estimado del proyecto 
$('.esfuerzoEstimadoDelSistemTotal').html(esfuerzoEstimadoDelSistemTotal.toFixed(2));
TDEV=[3.0*Math.pow(esfuerzoEstimadoDelSistemTotal,(0.33+0.2*(B-1.01)))];
$('.timeDevEstimado').html(TDEV);



