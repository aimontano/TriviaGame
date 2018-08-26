$(document).ready(function(){
	let questions = []; // array contains all the question objects
	let answerChoices = []; // array contains all the answer choices
	let correctAnswer;  // contains correct answer

	let index = 0; // index of questions object array
	let secondsAvailable = 2; // seconds available

	let counterId;  // timer counter interval

	let hasGuessed = false; // user can only guess once
	let correctGuess = 0; // stores user correct guesses
	let incorrectGuess = 0; // stores user incorrect guesses
	let notAnswered = 0; // stores user not answered questions
	let hasResult = false;

	// query url for getting the random questions 
	let queryUrl = "https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple";

	// ajax request  to get all the questions
	$.get(queryUrl, function(res){
		// once questions received set them to questions array 
		questions = res;
	});

	// resets variables 
	const resetVariables = () => {
		index = 0;
		secondsAvailable = 2;
		hasGuessed = false;
		correctGuess = 0;
		incorrectGuess = 0;
		notAnswered = 0;
		hasResult = false;
	};

	// functions starts the game
	const startGame = () => {
		// loads questions template
		$('#content').load('./templates/questions.html', function(){
			hasResult = false; // each time it runs resets variable to false
			getQuestions(); // display question on template

			// if user clicks on one of the choices
			$('.list-group-item').click(function(){
				let userGuess = $(this).attr('data-answerChoice'); // store uses guess
							
				// check if user guess is correct
				if(userGuess == correctAnswer && !hasGuessed) {
					hasGuessed = true; // don't let user guess again for current question
					correctGuess++;
					$(this).css('background-color', '#28a745'); // set choice background to green
				} 

				if(userGuess != correctAnswer && !hasGuessed){ // if user guess incorrect
					hasGuessed = true; // don't let user guess again
					incorrectGuess++;
					$(this).css('background-color', '#dc3545'); // set choice background to red
					setTimeout(function(){
						displayCorrectAnswer();
					}, 500);
				}	
			});				
		});
	};	

	// function returns an array with random index number 
	const getIndex = () => {
		let choice = []; // create an empty array
		while(true){ // start an infinite while loop
			// create a random number between 1 and number of answer choices each time it loops 
			let randomIndex = Math.floor(Math.random() * answerChoices.length);
			// if random number is not in the array 
			if(choice.indexOf(randomIndex) < 0) {
				choice.push(randomIndex); // append random number to the array
				if(choice.length === 4){ // once it array contains 4 items
					break; // stop loop
				}  
			}
		}
		return choice;
	};

	// function displays answer choices randomly
	const getAnswerChoices = () => {
		answerChoices = []; // resets every time is called
		// push each answer choice to array
		answerChoices.push(questions.results[index].incorrect_answers[0]);
		answerChoices.push(questions.results[index].incorrect_answers[1]);
		answerChoices.push(questions.results[index].incorrect_answers[2]);
		answerChoices.push(questions.results[index].correct_answer);

		let choiceIndex = getIndex(); // contains an array with random index numbers

		// loops through each answer choice
		for(let i = 0; i < answerChoices.length; i++){
			// display each answer choice randomly 
			$('#choice' + (i + 1)).html(answerChoices[choiceIndex[i]]).attr('data-answerChoice', answerChoices[choiceIndex[i]]);
		}
	};

	// function resets each answer choice styles
	const resetStyle = () => {
		hasGuessed = false; // lets user choose an answer
		$('.list-group-item').css('background-color', 'white');
	};

	// functions shows the result
	const getResult = () => {
		hasResult = true; // tells program user has the result
		secondsAvailable = 10; // gives time for user to look at results
		displayTime(); // display time
		decrementTime(); // start counting down
		$('#correct').text(correctGuess); // display correct guesses
		$('#incorrect').text(incorrectGuess); // display incorrect guesses
		$('#unanswered').text(notAnswered); // display unanswered questions
	};

	// function displays result
	const displayResult = () => {
		// loads template and gets the results to display to user
		$('#content').load('./templates/result.html', getResult);
	};

	// function display questions 
	const getQuestions = () => {
		resetStyle(); // each time getQuestion is called resets styles
		if (index < 10){   // if user has not gone through all the questions
			let question = questions.results[index].question; // store question in variable
			correctAnswer = questions.results[index].correct_answer; // store correct answer in variable
			// display question & seconds available
			$('#question').html(question + "<span class='badge badge-warning'>"+secondsAvailable+"</span>");

			getAnswerChoices(); // get answer choices
			displayTime(); // display time
			decrementTime(); // start countdown
 
			index++; // add 1 to index to go to next question	
		} else { // otherwise
			displayResult(); // display results
		}
	};	

	// functions is called from interval
	const decrementTime = () => {
		// display seconds available to user
		$('.badge').text(" Seconds left: " + secondsAvailable);

		// if user has guessed
		if(hasGuessed){
			clearInterval(counterId); // clear interval
			secondsAvailable = 2; // restart time 
			setTimeout(function(){ // get another question after 1.3 seconds
				getQuestions();
			}, 1300);
		}  

		// if run out of time and user has the result
		if (secondsAvailable == 0 && hasResult) {
			resetVariables(); // reset variables
			clearInterval(counterId); // reset interval
			startGame(); // start game again
		}  

		// if user has run out of time & has not answered
		if(secondsAvailable == 0 && !hasGuessed) { 
			notAnswered++; // add 1 to notAnswered variable
			displayCorrectAnswer(); // display correct answer
			setTimeout(function(){ // wait a second
				secondsAvailable = 2; // reset seconds available to 10
				getQuestions(); // get another question 
			}, 1000);
		}  

		
		secondsAvailable--; // decrement seconds
	};

	// function displays time remaining
	const displayTime = () => {
		clearInterval(counterId); // clear interval each time function is called
		counterId = setInterval(decrementTime, 1000); // start interval
	};

	// display correct answer function
	const displayCorrectAnswer = () => {
		// loop through each answer choice 
		for(let i = 0; i < answerChoices.length; i++) {
			// loop for correct answer element
			if($('#choice' + (i + 1)).attr('data-answerChoice') == correctAnswer){
				$('#choice' + (i + 1)).css('background-color', '#28a745'); // set background to green
			}
		}
	};

	// when user clicks on start button
	$('#start').click(function(){
		// load questions.html template with questions
		startGame();
	});
	
	
});
