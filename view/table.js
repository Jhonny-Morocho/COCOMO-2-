
// var arrayDatoStatico={nombre:['Qedit','Search','Output','UpEdit','Modify','Utils'],
// slock:[1800,700,1200,1700,900,1731],
// factorEscala:[3.72 , 3.04],
// EAF:[0.54,0.39],
// Sueldo:[5370,5370]
// }

//=======================================IMPRIMIR TABLA===============================//


function imprimirTabla(dataFormulario,dataPm_porModulo,dataPmEstimadoModiulo){
	//borra nodoAnterior para seguir imprimiento
	$('.dataTablaEstimaciones').remove();
	console.log(dataPm_porModulo);
	//imprimir los datos del objeto dataFormulario 
	for(var i = 0; i < dataFormulario.sloc.length; i++){
		Pm_estimado_modulo=(dataPm_porModulo[i]*dataFormulario.EAF[i]).toFixed(2);
		 //Pm_estimado_modulo=(arrayDatoStatico.EAF[i]*(arrayDatoStatico.slock[i]/ProductividadNominal)).toFixed(2);
		TD='<tr class="dataTablaEstimaciones">'+
			
				'<td>'+(i+1)+'</td>'+
				'<td>'+dataFormulario.nombreModulo[i]+'</td>'+
				'<td class="soloc">'+dataFormulario.sloc[i]+'</td>'+
				'<td>'+dataFormulario.EAF[i]+'</td>'+
				'<td >'+dataPm_porModulo[i]+'</td>'+
				// PASO 9. Esfuerzo estimado por modulo(Pm_estimado_modulo = Pm_nominal_modulo*EAF)
				'<td class="classPM_estimado">'+((dataPm_porModulo[i]*dataFormulario.EAF[i]).toFixed(2))+'</td>'+
				'<td>'+dataFormulario.sueldo[i]+'</td>'+
				// PASO 12 Costo del Mes-Persona para cada módulo, expresado en miles de dólares
				
				'<td>'+((dataPm_porModulo[i]*dataFormulario.EAF[i]).toFixed(2)*(dataFormulario.sueldo[i])).toFixed(2)+'</td>'+
			
			'/<tr>';
			//añadir nodos a la tabla  Formulario para la estimación de esfuerzo y tiempo de desarrollo utilizando 
		$('.dataAfter').after(TD);
		//esfuerzoEstimadoDelSistemTotal+=arrayDatoStatico.EAF[i]*(arrayDatoStatico.slock[i]/ProductividadNominal);
	}
}




