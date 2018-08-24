$(document).ready(function(){
	let questions = []; // array contains all the question objects
	let answerChoices = []; // array contains all the answer choices
	let correctAnswer;  // contains correct answer

	let index = 0; // index of questions object array
	let secondsAvailable = 10; // seconds available

	let intervalId; // first interval for displaying questions interval
	let counterId;  // timer counter interval

	let hasGuessed = false; // user can only guess once
	let correctGuess = 0; // stores user correct guesses
	let incorrectGuess = 0; // stores user incorrect guesses
	let notAnswered = 0; // stores user not answered questions

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

	// function returns an array with random index number 
	const getIndex = () => {
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

	// function displays answer choices randomly
	const getAnswerChoices = () => {
		answerChoices = [];
		answerChoices.push(questions.results[index].incorrect_answers[0]);
		answerChoices.push(questions.results[index].incorrect_answers[1]);
		answerChoices.push(questions.results[index].incorrect_answers[2]);
		answerChoices.push(questions.results[index].correct_answer);

		correctAnswer = questions.results[index].correct_answer;

		let choiceIndex = getIndex();

		for(let i = 0; i < answerChoices.length; i++){
			console.log(choiceIndex[i]);
			$('#choice' + (i + 1)).html(answerChoices[choiceIndex[i]]);
		}
	};

	const resetStyle = () => {
		hasGuessed = false;
		$('.list-group-item').css('background-color', 'white');
	};

	// function display questions 
	const getQuestions = () => {
		if (index < 10){ 
			resetStyle();
			$('#question').html(questions.results[index].question + "<span class='badge badge-warning'>"+secondsAvailable+"</span>");
				getAnswerChoices();
			index++;
		} else {
			clearInterval(intervalId);
			index = 0;
		}	
	};	

	// function displays time remaining
	const displayTime = () => {
		clearInterval(counterId);
		counterId = setInterval(decrementTime, 1000);
	};

	// function displays questions to document
	const questionDelay = () => {
		clearInterval(intervalId);
		intevalId = setInterval(getQuestions, 1000 * 10);
	};

	// when user clicks on start button
	$('#start').click(function(){
		// load questions.html template with questions
		$('#content').load('./templates/questions.html', function(){
			getQuestions(); // display question on template
			decrementTime(); // start counting down 
			
			questionDelay(); // start question countdown
			displayTime(); // display time remaining

			// if user clicks on one of the choices
			$('.list-group-item').click(function(){
				let userGuess = this.textContent; // store uses guess
				// check if user guess is correct
				if(userGuess == correctAnswer && !hasGuessed) {
					$(this).css('background-color', '#28a745'); // set choice background to green
					hasGuessed = true; // don't let user guess again for current question
				} else  if(userGuess != correctAnswer && !hasGuessed){ // if user guess incorrect
					$(this).css('background-color', '#dc3545'); // set choice background to red
					hasGuessed = true; // don't let user guess again
				}
			});

		});
	});
	
	
});
