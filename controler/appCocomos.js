// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
	console.log("¡Gran éxito! Todas las API de archivos son compatibles con el navegador");
} else {
	alert('The File APIs are not fully supported in this browser.');
	console.log("Las API de archivo no son totalmente compatibles con este navegador.");
}

var extensions = "*.js,*.php,*.html,*.css,*.json,*.java"; 			// The default extensions that are checked
var typeCommentInline = "^[\s\t]*\u002f\u002f.*?$";   				//Comments identified by default of a single line: //.
var typeBlockCommentOpen = ".*(\u002f\\*).*,.*(<!--).*";			// Block comment opening character /* <!--
var typeBlockCommentClose = ".*(\\*\u002f),.*(-->)";				// Block comment closing character */ -->
// Default exclusions (RegExp)
var exclusions = "^\\.git$,^\\.gitignore$,^\\.gitattributes$,^\\.svn$,^bin$,.*\\.obj$,.*\\.properties$,\\.md$";

// Arreglos de expresiones regulares
var regCommentInLine, regBlockCommentOpen, regBlockCommentClose;

// Variables globales para los cálculos de procesamiento
var n_folders, n_pfiles, n_tfiles, i_cfiles, n_tloc, n_tbloc, n_tcloc, n_tltotal;

// Temporizadores
var t_Initial, t_Final;

// Document is ready
$(document).ready(function() {

	var files;
	var f_exclusions;

	var re_excls = exclusions.split(",").map((item) => new RegExp(item));
	console.log(re_excls);

	$("#dir_files").on('change', function(event) {
		/* Act on the event */
		files = Array.from(event.target.files);
		//console.log($(this).val());
		
		$("select#ml_sel_excl").empty();

		files.forEach((f, index) => {
			var option = $('<option>', {
				'value': index,
				'text': Encoder.htmlDecode(f.name),
				'data-secondary-text': Encoder.htmlDecode(f.webkitRelativePath),
				'selected': re_excls.some((re) => f.name.search(re) != -1)
			});
			$("select#ml_sel_excl").append(option);
		});

		var i_excl = $("select#ml_sel_excl").val().map((item) => parseInt(item));
		if (files && files.length != 0)
		{
			f_exclusions = files.filter((it,index) => i_excl.indexOf(index) != -1);
		}
	});

	$("#block-multiselect_excl").on('click', '#btn_excl', function(event) {
		event.preventDefault();
		/* Act on the event */
		console.log($("select#ml_sel_excl").val());
		var i_excl = $("select#ml_sel_excl").val().map((item) => parseInt(item));
		if (files && files.length != 0)
		{
			f_exclusions = files.filter((it,index) => i_excl.indexOf(index) != -1);
		}
	});
	
	$("#btn_send").on('click', function(event) {
		event.preventDefault();
		/* Act on the event */

		if (!files || !files.length)
		{
			alert("El directorio esta vacio");
		}
		else
		{
			$("#pb-results").css('display', 'block');
			processDirectory(files, f_exclusions);
		}
	});
});

function processDirectory(files, f_exclusions)
{
	if (files.length == f_exclusions.length)
	{
		alert("Todos los archivos estan excluidos\nNo hay archivos a analizar");
		$("#pb-results").css('display', 'none');
		return;
	}

	resetGlobalVars();

	var fst_file = files[0];
	var folder_root = fst_file.webkitRelativePath.split(/\u002f/)[0];
	console.log(`%cComenzando a procesar la carpeta: "${folder_root}"`, "color:#819FF7");

	// Tiempo de comienzo del procesamiento
	t_Initial = performance.now();

	var exts = extensions.split(",").map((item) => item.replace("*", "").replace(/^\./, "\\."));
	console.log(exts);

	var expComentary = typeCommentInline.split(",");
	regCommentInLine = new Array();
	expComentary.forEach((exp) => regCommentInLine.push(new RegExp(exp, "ims")));
	console.log(expComentary);
	console.log(regCommentInLine);

	var expBlockComentaryOpen = typeBlockCommentOpen.split(",");
	regBlockCommentOpen = new Array();
	expBlockComentaryOpen.forEach((exp) => regBlockCommentOpen.push(new RegExp(exp)));
	console.log(expBlockComentaryOpen);
	console.log(regBlockCommentOpen);

	var expBlockComentaryClose = typeBlockCommentClose.split(",");
	regBlockCommentClose = new Array();
	expBlockComentaryClose.forEach((exp) => regBlockCommentClose.push(new RegExp(exp)));
	console.log(expBlockComentaryClose);
	console.log(regBlockCommentClose);

	// var excls = exclusions.split(",");
	// console.log(excls);
	
	// Se guarda el número total de archivos del directorio
	n_tfiles = files.length;

	// Obtener el número de archivos que se van a procesar del directorio
	files.forEach((f) => {
		if (f_exclusions.indexOf(f) == -1) {
			exts.forEach((ex) => {
				if (f.name.search(new RegExp("(" + ex + ")$")) != -1) {
					n_pfiles++;
				}
			});
		}
	});

	for (f of files) 
	{
		var b = false;
		if (f_exclusions.indexOf(f) == -1) {
			for (ex of exts) {
				var re = new RegExp("(" + ex + ")$");
				if (f.name.search(re) != -1)
				{
					b = true;
					accountLinesCode(f);
					break;
				}
			}
		}
		else
		{
			b = true;
			console.log(`%c${f.webkitRelativePath} (excluida)`, "color:#D358F7");
		}
		if (!b)
		{
			console.log("%c" + f.webkitRelativePath, "color:#F78181");
		}
	}
}

function accountLinesCode(file)
{
	if (!file) {
		return;
	}

	console.log("%c" + file.webkitRelativePath, "color:yellow");

	var blockComentary = false;
	var iBlockComment = -1;

	var reader = new FileReader();

	// Closure to capture the file information.
	reader.onload = function(e){
		//console.log(e.target.result);
		var isBlank = false;
		var isCommentary = false;
		var numComment = 0, numBlank = 0, numLines = 0;

		// Separo las lineas de codigo por líneas
		var lines = e.target.result.split(/\r\n|\n/);
		lines.forEach(function(line) {
			// Comprueba si estoy en un bloque de comentario
			if (blockComentary) 
			{
				isCommentary = true;

				//Ver si la línea actual cierra el comentario o no
				if (line.search(regBlockCommentClose[iBlockComment]) != -1)
				{
					// Ya no se esta en un bloque de comentario
					blockComentary = false;
					iBlockComment = -1;
				}
			}
			else // Linea de código normal
			{
				// Ver si es una linea vacía
				isBlank = isNullOrWhiteSpace(line);

				// Comprobar si es un comentario de una sola línea
				isCommentary = false;
				regCommentInLine.forEach((re) => {
					if (line.search(re) != -1) {
						isCommentary = true;
					}
				});

				// Verificar si es un comentario de varias lineas (Bloque de comentario)
				// Ver si la linea actual es una apertura de comentario
				for (var i = 0; i < regBlockCommentOpen.length; i++) {
					// Si es un bloque de comentario
					if (line.search(regBlockCommentOpen[i]) != -1) { 
						// Si no se cierra el comentario en la misma línea
						if (line.search(regBlockCommentClose[i]) == -1) 
						{
							// Es un bloque de comentario de varias lineas
							// Se marca a partir de ahora que las siguientes lineas son comentarios
							// hasta que aparesca el cierre del comentario
							iBlockComment = i;
							blockComentary = true;
						}
						isCommentary = true;
						break;
					}
				}
			}
			if (isCommentary) {
				numComment++;
			}
			else if (isBlank) {
				numBlank++;
			}
			else {
				numLines++;
			}
		});
		console.log(`%c${file.name}:\n
			Líneas de Código ejecutables: ${numLines}\n
			Líneas en blanco: ${numBlank}\n
			Lineas comentadas: ${numComment}\n
			Líneas totales: ${lines.length}`, "color:#FF4000");

		addToTotalResults(numLines, numBlank, numComment, lines.length);
	};
	reader.readAsText(file);

	// n_pfiles++;
}

function addToTotalResults(c_numLines, c_numBlank, c_numComment, c_tlines)
{
	n_tloc += c_numLines;
	n_tbloc += c_numBlank;
	n_tcloc += c_numComment;
	n_tltotal += c_tlines;
	i_cfiles++;

	// Si el numero de archivos procesados actuales son igual a los procesados totales
	if (i_cfiles == n_pfiles)
	{	
		// Tiempo final del procesamiento
		t_Final = performance.now();

		var divClocLoc = n_tcloc / n_tloc;
		var sResult = sprintf("Num archivos procesados: %d\nNum archivos totales: %d\n" +
			"Líneas de Código ejecutables (LOC): %d\nLíneas en blanco (BLOC): %d\n" + 
			"Lineas comentadas (CLOC): %d\nLíneas totales (TLOC): %d\n" + 
			"Relación Comentarios//Codigo: %.2f\nTiempo total empleado en el análisis: %.2f ms", 
			n_pfiles, n_tfiles, n_tloc, n_tbloc, n_tcloc, n_tltotal, divClocLoc, (t_Final - t_Initial));

		$("textarea#results").text(sResult);
		$("#pb-results").css('display', 'none');

		console.log(`%c${sResult}`, "color:#04B404");
		console.log("%cFinal del procesamiento", "color:#819FF7");

		// Guardar los datos en un localStorage
		localStorage.setItem('ntloc', n_tloc);
		localStorage.setItem('ntbloc', n_tbloc);
		localStorage.setItem('ntcloc', n_tcloc);
		localStorage.setItem('ntltotal', n_tltotal);
	}
}

function resetGlobalVars()
{
	n_folders = 0;
	n_pfiles = 0;
	n_tfiles = 0;
	i_cfiles = 0;
	n_tloc = 0;
	n_tbloc = 0; 
	n_tcloc = 0; 
	n_tltotal = 0;
	t_Initial = 0;
	t_Final = 0;
}

function isNullOrWhiteSpace(input) 
{
  return !input || (typeof input === "string" && !input.trim());
}