$(document).ready(function(){
	let questions = [];
	let answerChoices = [];
	let correctAnswer;

	let index = 0;

	let intervalId;

	let queryUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";

	$.get(queryUrl, function(res){
		questions = res;
	});

	const displayQuestion = (i) => {
		if (index < 10){
			$('#question').html(questions.results[index].question);
			$('#choice1').html(questions.results[index].incorrect_answers[0]);
			$('#choice2').html(questions.results[index].incorrect_answers[1]);
			$('#choice3').html(questions.results[index].incorrect_answers[2]);
			$('#choice4').html(questions.results[index].correct_answer);

			console.log(questions.results[index].question);
			index++;
		} else {
			clearInterval(intervalId);
		}
	};

	$('#start').click(function(evt){
		// console.log(questions);
		// evt.stopPropagation();
		$('#content').load('./templates/questions.html', function(){
			displayQuestion();
			intevalId = setInterval(function(){
				displayQuestion();
			}, 1000 * 10);

			$('.list-group-item').click(function(e){
				e.stopPropagation();
				console.log(this.textContent);
			});

			console.log(questions.results[0].correct_answer);
		});
	});
	
	
});
