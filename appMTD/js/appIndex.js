$(document).ready(function() {
    // SideNav Initialization
    // $(".button-collapse").sideNav();
	localStorage.clear();
	
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
});