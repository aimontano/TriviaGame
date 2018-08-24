$(document).ready(function(){
	let questions = []; // array contains all the question objects
	let answerChoices = []; // array contains all the answer choices
	let correctAnswer;  // contains correct answer

	let index = 0; // index of questions object array
	let secondsAvailable = 10; // seconds available

	let intervalId; // first interval for displaying questions interval
	let counterId;  // timer counter interval

	// query url for getting the random questions 
	let queryUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";

	// ajax request  to get all the questions
	$.get(queryUrl, function(res){
		// once questions received set them to questions array 
		questions = res;
	});

	// functions is called from interval
	const decrementTime = () => {
		// display seconds available to user
		$('.badge').text(" Seconds left: " + secondsAvailable);
		secondsAvailable--; // decrement seconds
		if(secondsAvailable === 0) {
			secondsAvailable = 10;
		}
	};

	const getIndex = () => {
		// let choicesAvailable = 4;
		let choice = [];

		while(true){
			let randomIndex = Math.floor(Math.random() * answerChoices.length);
			if(choice.indexOf(randomIndex) < 0) {
				choice.push(randomIndex);
				if(choice.length === 4){
					break;
				}
			}
		}

		return choice;
	};

	const getAnswerChoices = () => {
		answerChoices = [];
		answerChoices.push(questions.results[index].incorrect_answers[0]);
		answerChoices.push(questions.results[index].incorrect_answers[1]);
		answerChoices.push(questions.results[index].incorrect_answers[2]);
		answerChoices.push(questions.results[index].correct_answer);

		let choiceIndex = getIndex();

		for(let i = 0; i < answerChoices.length; i++){
			$('#choice' + (i + 1)).html(answerChoices[choiceIndex[i]]);
		}
	};

	const getQuestions = () => {
		if (index < 10){ 
			$('#question').html(questions.results[index].question + "<span class='badge badge-warning'>"+secondsAvailable+"</span>");
			getAnswerChoices();
			index++;
		} else {
			clearInterval(intervalId);
			index = 0;
		}	
	};	

	const displayTime = () => {
		clearInterval(counterId);
		counterId = setInterval(decrementTime, 1000);
	};

	// function displays questions to document
	const displayQuestion = () => {
		clearInterval(intervalId);
		intevalId = setInterval(getQuestions, 1000 * 10);
	};

	$('#start').click(function(evt){
		$('#content').load('./templates/questions.html', function(){
			getQuestions();
			decrementTime();
			
			displayQuestion();
			displayTime();

			$('.list-group-item').click(function(e){
				e.stopPropagation();
				console.log(this.textContent);
			});

		});
	});
	
	
});
