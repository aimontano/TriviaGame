$(document).ready(function(){
	let questions = [];
	let answerChoices = [];

	let queryUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";

	let xhr = $.get(queryUrl, function(res){
		questions = res;
	});

	$('#start').click(function(evt){
		console.log(questions);
		$('#content').load('../templates/questions.html', function(){
			$('#question').html(questions.results[0].question);
			$('#choice1').html(questions.results[0].incorrect_answers[0]);
			$('#choice2').html(questions.results[0].incorrect_answers[1]);
			$('#choice3').html(questions.results[0].incorrect_answers[2]);
			$('#choice4').html(questions.results[0].correct_answer);
			console.log(questions.results[0].correct_answer);
		});
	});
});