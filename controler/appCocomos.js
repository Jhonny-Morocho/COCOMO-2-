// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
	console.log("¡Gran éxito! Todas las API de archivos son compatibles con el navegador");
} else {
	alert('The File APIs are not fully supported in this browser.');
	console.log("Las API de archivo no son totalmente compatibles con este navegador.");
}

var extensions = "*.js,*.php,*.html,*.css,*.json,*.java"; 			// The default extensions that are checked
var typeCommentInline = "^[\s\t]*\u002f\u002f.*?$,^[\s\t]*'.*?$";   //Comments identified by default of a single line: // y '.
var typeBlockCommentOpen = new Array(new RegExp(".*/\*.*"));
var typeBlockCommentClose = new Array(new RegExp(".*[\*/]"));

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

		// Separo las lineas de codigo por líneas
		var lines = e.target.result.split(/\r\n|\n/);
		lines.forEach(function(line) {
			// Comprueba si estoy en un bloque de comentario
			if (blockComentary) {
				isComment = true;

				//Ver si la línea actual cierra el comentario o no
				if (line.match(typeBlockCommentClose[iBlockComment]))
				{
					// Ya no se esta en un bloque de comentario
					blockComentary = false;
					iBlockComment = -1;
				}
			}
			else { // Linea de código normal

				// Comprobar si es un comentario de una sola línea
				isCommentary = false;
			}
		});
	};
	reader.readAsText(file);

	n_pfiles++;
}