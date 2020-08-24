var progressBar;
var valProgInitFile;
var valProgEndFile;

$(document).ready(function() {
    // SideNav Initialization
    // $(".button-collapse").sideNav();
	localStorage.clear();
	progressBar = $("#pb-file-upload");
	$("#pb-results").css('display', 'none');
	
    new WOW().init();

    // Material Select Initialization
    $('.mdb-select').materialSelect();

    var messages = {
		default: "Arrastre y suelte una carpeta o haga clic aquí",
		replace: "Arrastra y suelte o haz clic para reemplazar",
		remove: "Eliminar",
		error: "Vaya, algo sucedió mal."
	};
	$('#dir_files').data("messages", messages);

    // Init File Upload
	$('.file-upload').file_upload();

	$(".file-upload").on('change', function(e){
		handleFileSelect(e);
	});

	$(".file-upload-wrapper").on('click', '.file-upload button', function(){
		progressBar.css('width', '0%');
		progressBar.attr('aria-valuenow', '0');
	});
});

function handleFileSelect(evt) {
	// Reset progress indicator on new file selection.
	progressBar.css('width', '0%');
	progressBar.attr('aria-valuenow', '0');

	var nfiles = evt.target.files.length;

	evt.target.files.forEach(function(f, index) {
		reader = new FileReader();
		reader.onerror = errorHandler;
		reader.onprogress = updateProgress;
		reader.onloadstart = function(e) {
			valProgInitFile = (index * 100) / nfiles;
			valProgEndFile = ((index + 1) * 100) / nfiles;
		};
		reader.onload = function(e) {
			progressBar.css('width', valProgEndFile.toString() + "%");
			progressBar.attr('aria-valuenow', valProgEndFile.toString());
		}

		// Read in the image file as a binary string.
		reader.readAsBinaryString(f);
	});
}

function updateProgress(evt) {
	// evt is an ProgressEvent.
	if (evt.lengthComputable) {
		var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
			// Increase the progress bar length.
		if (percentLoaded < 100) {
			var percentReal = Math.round((percentLoaded * valProgEndFile) / 100);
			progressBar.css('width', percentReal.toString() + "%");
			progressBar.attr('aria-valuenow', percentReal.toString());
		}
	}
}

function errorHandler(evt) {
	switch(evt.target.error.code) {
		case evt.target.error.NOT_FOUND_ERR:
			alert('File Not Found!');
			break;
		case evt.target.error.NOT_READABLE_ERR:
			alert('File is not readable');
			break;
		case evt.target.error.ABORT_ERR:
			break; // noop
		default:
			alert('An error occurred reading this file.');
	};
}