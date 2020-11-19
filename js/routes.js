Path.map("#/logout").to(function () {
	$.session.clear();   
    window.location.href = '/';
});

Path.map("#/dashboard").to(function () {
    $('#content').load('views/dashboard.html');
});

Path.map("#/config").to(function () {
    $('#content').load('views/config.html');
});

Path.map("#/reports").to(function () {	
    $('#content').load('views/reports.html');
});


Path.listen();