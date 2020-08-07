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
var exclusions = ".git,.gitignore,.gitattributes,.svn,bin,obj,properties";

var regCommentInLine, regBlockCommentOpen, regBlockCommentClose;

var n_folders, n_pfiles, n_lines, n_lWhite, n_comments;

// Document is ready
$(document).ready(function() {

	var files;

	$("#dir_files").on('change', function(event) {
		/* Act on the event */
		files = event.target.files;
		//console.log($(this).val());
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
			processDirectory(files);
		}
	});
});

function processDirectory(files)
{
	var fst_file = files[0];
	var folder_root = fst_file.webkitRelativePath.split(/\u002f/)[0];
	console.log(`%cComenzando a procesar la carpeta: "${folder_root}"`, "color:#819FF7");

	var exts = extensions.split(",").map((item) => item.replace("*", ""));
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

	var excls = exclusions.split(",");
	console.log(excls);

	for (f of files) 
	{
		var b = false;
		for (ex of exts) {
			var re = new RegExp("(" + ex + ")$");
			if (f.name.search(re) != -1)
			{
				b = true;
				accountLinesCode(f);
				break;
			}
		}
		for (x of excls) {
			var re = new RegExp("^" + x + "$");
			if (f.name.search(re) != -1)
			{
				b = true;
				console.log(`%c${f.webkitRelativePath} (excluida)`, "color:#D358F7");
				break;
			}
		}
		if (!b)
		{
			console.log("%c" + f.webkitRelativePath, "color:#F78181");
		}
	}

	console.log("%cRESULTADOS:\n\
		Num Carpetas: {0:N0}\n\
		Num archivos: {1:N0}\n\
		Líneas de Código ejecutables (LOC): {2:N0}\n\
		Líneas en blanco (BLOC): {3:N0}\n\
		Lineas comentadas (CLOC): {4:N0}\n\
		Líneas totales (TLOC): {5:N0}\n\
		Ratio Comentarios/Codigo: {6:F2}/1\n\
		Tiempo total empleado en el análisis: {7:N0}ms", "color:#04B404");
	console.log("%cFinal del procesamiento", "color:#819FF7");
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
	};
	reader.readAsText(file);

	n_pfiles++;
}

function isNullOrWhiteSpace(input) 
{
  return !input || (typeof input === "string" && !input.trim());
}