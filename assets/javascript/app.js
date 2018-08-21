$(document).ready(function(){

	$('#start').click(function(){
		$.ajax({
			url: '../templates/questions.html',
			method: 'GET'
		}).then(function(response){
			$('#content').html(response);
		});
	});
	
});