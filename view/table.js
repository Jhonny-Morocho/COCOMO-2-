
var arrayDatoStatico={nombre:['Qedit','Search','Output','UpEdit','Modify','Utils'],
	slock:[1800,700,1200,1700,900,1731],
	factorEscala:[3.72 , 3.04],
	EAF:[0.54,0.39],
	Sueldo:[5370,5370]
}


function calcularEAF(){
    
	return proRELY*proData*proCPLX*proTIME*proSTOR*proVIRT*proTURN*proACAP*proAEXP*proPCAP*proVEXP*proMODP*proTOOL*proSCED;
  
  }

  //=====================

//1. Sumar el total de lienas de codigo de todo el proyecto
var numero=0,sloc=0, TD="";

for(var i = 0; i < arrayDatoStatico.slock.length; i++){
	numero = (arrayDatoStatico.slock[i]);
	sloc = numero + sloc;
}
$('.totalSlock').html(sloc);
//function tablaEstimacion(){
	

	
//}
// ============Visualizar en el formulario EAF=============

//2. Calcular el Factor Exponencial de Escala (B), considerando los 5 factores Wj (PREC, FLEX,
//RESL, TEAM y MAT) en un nivel nominal
 var B=0,numB=0 ;

     for(var i = 0; i < arrayDatoStatico.factorEscala.length; i++){
         numB = (arrayDatoStatico.factorEscala[i]);
         B = numB + B;
	 }
	 B=(1.01+0.01*B).toFixed(2);


 

//3 Calcular el Esfuerzo Nominal requerido para desarrollar el sistema, PMNominal, en la celda 29 y la
//Productividad del Proyecto en la celda 30
var PMnominal=0, KSLOCK=sloc/1000;

const A=2.94;//es una constante que captura los efectos lineales sobre el esfuerzo de acuerdo a la variación del tamaño
//Formula=> PMnominal=A*(KSLOCK)^B;// KSLOCL=> es una medidad, donde 1 KSLOCK equivale a mil lineas de codigo fuente

	 //==============TOTAL================//

	   PMnominal=(A*(Math.pow(KSLOCK,B))).toFixed(2);
	   $('.esfuerzoNominal').html(PMnominal);
		
 
// factor de productividad 
 var ProductividadNominal=0;

	 ProductividadNominal=(sloc/PMnominal).toFixed(2);
	 $('.productividadNominal').html(ProductividadNominal);

	 
//===========IMPRIMIR ============
var esfuerzoEstimadoDelSistemTotal=0;
var TDEV=0,Pm_estimado_modulo=0;
for(var i = 0; i < arrayDatoStatico.slock.length; i++){
	
	// imprimir data
	Pm_estimado_modulo=(arrayDatoStatico.EAF[i]*(arrayDatoStatico.slock[i]/ProductividadNominal)).toFixed(2);
	TD='<tr class="nodosData">'+
		  
			'<td>'+(i+1)+'</td>'+
			'<td>'+arrayDatoStatico.nombre[i]+'</td>'+
			'<td>'+arrayDatoStatico.slock[i]+'</td>'+
			'<td>'+arrayDatoStatico.EAF[i]+'</td>'+
			'<td>'+(arrayDatoStatico.slock[i]/ProductividadNominal).toFixed(2)+'</td>'+
			'<td>'+Pm_estimado_modulo+'</td>'+
			'<td>'+arrayDatoStatico.Sueldo[i]+'</td>'+
			'<td>'+(arrayDatoStatico.Sueldo[i]*Pm_estimado_modulo).toFixed(2)+'</td>'+

		
		'/<tr>';
	$('.dataAfter').after(TD);
	esfuerzoEstimadoDelSistemTotal+=arrayDatoStatico.EAF[i]*(arrayDatoStatico.slock[i]/ProductividadNominal);
}
//Tiempo de dasarrolo estimado del proyecto 
$('.esfuerzoEstimadoDelSistemTotal').html(esfuerzoEstimadoDelSistemTotal.toFixed(2));
TDEV=[3.0*Math.pow(esfuerzoEstimadoDelSistemTotal,(0.33+0.2*(B-1.01)))];
$('.timeDevEstimado').html(TDEV);
//Esfuerzo nominal por modulo
// for(var i = 0; i < arrayDatoStatico.factorEscala.length; i++){
// 	var tdPM_nominal_modulo='<tr>'+
			  
// 							'<td>'+(i+1)+'</td>'+
// 							'<td>'+arrayDatoStatico.nombre[i]+'</td>'+
// 							'<td>'+arrayDatoStatico.slock[i]+'</td>'+
// 							'<td>'+arrayDatoStatico.EAF[i]+'</td>'+

// 						'/<tr>';
// 	$('.dataAfter').after(TD);
// }
 


//===============================IMPRIMIR TABLA CON LOS CALCULOS ESTIMADOS=============================//


$('#estimar').on('click',function(e){
    e.preventDefault();
	//alert("Imprme tabla");
	$('.nodosData').remove();
});


function imprimirTabla(){
	
}



