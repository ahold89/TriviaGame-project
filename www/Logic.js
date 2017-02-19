// main buttons on each div
var signInButton = document.getElementById("login");
var signUpButton = document.getElementById("signup");
var getInButton = document.getElementById("getIn");
var submitButton = document.getElementById("submit");
var startGameButton = document.getElementById("startGameButton");
var settingsButton = document.getElementById("settingsButton");
var highScoreTableButton = document.getElementById("highScoreTableButton");
var backToMainButton = document.getElementById("backToMainButton");
var getInFailureButton = document.getElementById("getInFailure");
var backToMainButton8 = document.getElementById("backToMainButton8");
var highScoreButton8 = document.getElementById("highScoreButton8");

// game buttons
var question = document.getElementById('question');
var answer1 = document.getElementById('answer1');
var answer2 = document.getElementById('answer2');
var answer3 = document.getElementById('answer3');
var answer4 = document.getElementById('answer4');

// divs
var first = document.getElementById("first");
var second = document.getElementById("second");
var third = document.getElementById("third");
var fourth = document.getElementById("fourth");
var fifth = document.getElementById("fifth");
var sixth = document.getElementById("sixth");
var seventh = document.getElementById("seventh");
var eighth = document.getElementById("eighth");

var usernameField = document.getElementById("usernameField");
var passwordField = document.getElementById("passwordField");

var newUserName = document.getElementById("Name");

var logo = document.getElementById("logo");

// score table
var place1 = document.getElementById("idNum1");
var place2 = document.getElementById("idNum2");
var place3 = document.getElementById("idNum3");
var place4 = document.getElementById("idNum4");
var place5 = document.getElementById("idNum5");
var places = [place1, place2, place3, place4, place5];

var score1 = document.getElementById("score1");
var score2 = document.getElementById("score2");
var score3 = document.getElementById("score3");
var score4 = document.getElementById("score4");
var score5 = document.getElementById("score5");
var scores = [score1, score2, score3, score4, score5];

// errors
var existUserNameText = document.getElementById("existUserName");
var unknownUserPasswordText = document.getElementById("unknownUserPassword");
var chooseSettingsText = document.getElementById("chooseSettings");
var newHighScoreText = document.getElementById("newHighScoreText");
var newScoreText = document.getElementById("userScore");
var youLostText = document.getElementById("youLostText");

// variables
var difficultylevel = '';
var subject = '';
var levelNum;
var score = 0;
var settingButtonWasSelected = false


function setBorder(e){
    e.srcElement.style.border = "black";
}
// in order to check if the user is already logged-in
$(document).ready(function(){
    $.ajax({
        url: '/isLogin',
        type: 'GET',
        success: function (data) {
            if(data == 'true') {
				first.style.display = "none";
                fourth.style.display = "block";
            } else {
                first.style.display = "block";
            }
        }
    });
});


function questionRandomizer(difficultylevel, subject){

	// initialize the chosen difficulty level
    switch(difficultylevel){
        case "easy":
            levelNum = 0;
            break;
        case "medium":
            levelNum = 1;
            break;
        case "hard":
            levelNum = 2;
            break;
    }

	// initialize the chosen subject of questions
    switch (subject){
        case "science":
            levelQuestionChooser(science[levelNum]);
            break;
        case "geography":
            levelQuestionChooser(geography[levelNum]);
            break;
        case "music":
            levelQuestionChooser(music[levelNum]);
            break;
        case "general":
            levelQuestionChooser(general[levelNum]);
            break;
		case "sport":
            levelQuestionChooser(sport[levelNum]);
            break;
    }
}

//In this function the actual work of mixing the questions and answers happens
function levelQuestionChooser(category){
   length = category.length;
    for(var i = 0; i < length; i++){
        var randomNumber = getRandomInt(i, length);
        var randomForAnswers = getRandomInt(0,4);
        //mix questions
        swapInArr(category, randomNumber, i);
        //mix answers
        swapInArr(category[i][1], randomForAnswers,
            getRandomInt(0, 3 - randomForAnswers));
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function swapInArr(arr, indexA, indexB){
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
}

function acceptLevel(e){
    var level = e.srcElement.id;
    console.log(level)
    e.srcElement.style.backgroundColor = "#00b359";
    //wait for 250 mil
    setTimeout(function(){
                   document.getElementById("settingsDiv").style.display = "none";
                   document.getElementById("subjectDiv").style.display = "block"
                   e.srcElement.style.backgroundColor = "#B22222";
               }
               , 250)
    difficultylevel = level;
}

function acceptSubject(e){
    var subjectChosen = e.srcElement.id;
    console.log(subjectChosen);
    e.srcElement.style.backgroundColor = "#00b359";
    setTimeout(function(){
        document.getElementById("subjectDiv").style.display = "none";
        sixth.style.display = "none";
        e.srcElement.style.backgroundColor = "#B22222";
        subject = subjectChosen;
        setTimeout(function(){
            if(settingButtonWasSelected){
                settingButtonWasSelected = false;
                settingsButton.style.display = "none";
                fourth.style.display = "block";
                startGameButton.style.display = "block";
            }else{
                questionRandomizer(difficultylevel, subject);
                manageTheGame();
            }
        }, 100)
    }, 250)
}

// log-in form
signInButton.addEventListener("click", function() {
    $.ajax({
        url: '/signIn',
        type: 'GET',
		data: '',
        dataType: 'json',
		success: function (data) {
			if(data === 'true') {
			first.style.display = "none";
			second.style.display = "block";
			}
        }
    });
});

getInButton.addEventListener("click", function() {

    if(($('input[id=usernameField]').val() != '') &&
       ($('input[id=passwordField]').val() != '')) { //user entered username and password

        var userInfo = {
            'username': $('input[id=usernameField]').val(),
            'userPassword': $('input[id=passwordField]').val()
        };
        $.ajax({
            url: '/getInKnownUser',
            type: 'POST',
            data: userInfo,
            dataType: 'json',
            success: function (data) {
                // if the login operation was success
                if (data.isSuccess == 'true') {
                    unknownUserPasswordText.style.display = "none";
                    second.style.display = "none";
                    fourth.style.display = "block";
                } else {
                    unknownUserPasswordText.style.display = "block";
                    usernameField.value = '';
                    passwordField.value = '';
                    getInFailureButton.style.display = "block";
                }
            }
        });
    }
    else {
        unknownUserPasswordText.style.display = "none";
        getInFailureButton.style.display = "block";
    }
});

getInFailureButton.addEventListener("click", function() {
    second.style.display = "none";
    third.style.display = "block";
    getInFailureButton.style.display = "none";
});

submitButton.addEventListener("click", function() {

	if(($('input[id=Name]').val() != '') && 
       ($('input[id=Password]').val() != '') && 
       ($('input[id=Email]').val() != '') && 
       ($('input[id=Phone]').val() != '')) { //user entered all signup details:

        var userInfo = {
            'username' : $('input[id=Name]').val(),
            'userEmail' : $('input[id=Email]').val(),
            'userPhone' : $('input[id=Phone]').val(),
            'userPassword' : $('input[id=Password]').val()
        };
    
        $.ajax({
            url: '/getInNewUser',
            type: 'POST',
            data: userInfo,
            dataType: 'json',
            success: function (data) {
                // if the login operation was success
                if(data.isSuccess == 'true') {
                    third.style.display = "none";
                    fourth.style.display = "block";
                    existUserNameText.style.display = "none";
    
                } else {
                    existUserNameText.style.display = "block";
                    newUserName.value = '';
                }
            }
        });
	}
    else {
        existUserNameText.style.display = "none";
        var requiredInputs = document.getElementsByClassName("required");
        for(var i = 0; i < requiredInputs.length; i++){
            if(requiredInputs[i].value === ''){
                requiredInputs[i].placeholder = requiredInputs[i].id + " is required";
                requiredInputs[i].style.border = "1px solid red"
            }
        }
    }
});

signUpButton.addEventListener("click", function() {
    first.style.display = "none";
    third.style.display = "block";
});

startGameButton.addEventListener("click", function() {
	
	if(subject === '' || difficultylevel === '') {
        // chooseSettingsText.style.display = "block";
        fourth.style.display = "none";
        sixth.style.display = "block";
        document.getElementById("settingsDiv").style.display = "block";
	} else {
		questionRandomizer(difficultylevel, subject);
		logo.style.display = "none";
		manageTheGame();
	}
});

var index = 0;

function manageTheGame() {

	fourth.style.display = "none";
    seventh.style.display = "block";

		// if the game is over
		if(index >= 10) {
            eighth.style.display = "block";
            seventh.style.display = "none";
            newScoreText.innerHTML = score;
            if (index === 101) {
                youLostText.style.display = "block";
            }
            else {
                youLostText.style.display = "none";
            }
            index = 0;

            var scoreToSend = {
                scoreTo: score
            };

            $.ajax({
                url: '/checkScore',
                type: 'POST',
                data: scoreToSend,
                dataType: 'json',
                success: function (data) {
                }
            });

            var newHighScore = false;

			// check if there is a need to show the 'high scores' button
            if(score5.innerHTML != "") {
                var s5 = parseInt(score5.innerHTML);
                if (score >= s5)
                    newHighScore = true;
            }
            else
                newHighScore = true;
            if(newHighScore) {
                newHighScoreText.style.display = "block";
				highScoreButton8.style.display = "block";
            }
            else {
                newHighScoreText.style.display = "none";
                highScoreButton8.style.display = "none";
            }
			score = 0;
	} else {
		switch (subject){
			case "science":
				displayQuestionAndAnswers(science);
				break;
			case "geography":
				displayQuestionAndAnswers(geography);
				break;
			case "music":
				displayQuestionAndAnswers(music);
				break;
			case "general":
				displayQuestionAndAnswers(general);
				break;
			case "sport":
				displayQuestionAndAnswers(sport);
				break;
		}
	}
}

function displayQuestionAndAnswers(subject){
    question.innerHTML = subject[levelNum][index][0];
    answer1.innerHTML = subject[levelNum][index][1][0];
    answer2.innerHTML = subject[levelNum][index][1][1];
    answer3.innerHTML = subject[levelNum][index][1][2];
    answer4.innerHTML = subject[levelNum][index][1][3];
}

function manageTheAnswers(button, not) {
    index++;
    manageTheGame();
    button.style.backgroundColor = "#B22222";
    button.disabled = false;
    for(var i = 0; i < not.length; i++){
        not[i].disabled = false;
    }
}

function answerFunc(currAnswer, not){
    var answer = { 'a': currAnswer.innerHTML};
    for(var i = 0; i < not.length; i++){
        not[i].disabled = true;
    }
    currAnswer.disabled = true;
    $.ajax({
        url: '/isCorrect',
        type: 'POST',
        data: answer,
        dataType: 'json',
        success: function (data) {
            if(data === 'true') { //User answered correctly
                score = score + levelNum + 1;
                currAnswer.style.backgroundColor = "#27f40b"
                setTimeout(function(){ return manageTheAnswers(currAnswer, not)},250);
            } else {
                currAnswer.style.backgroundColor = "#eb1414"
                index = 100; //We chose arbitrarily 100 to be the index when user answered incorrectly
                //reset settings:
                difficultylevel = ''
                subject = ''
                setTimeout(function(){ return manageTheAnswers(currAnswer, not)},250);
            }
        }
    });
}

answer1.addEventListener("click", function(){answerFunc(answer1, [answer2,answer4,answer3])});
answer2.addEventListener("click", function(){answerFunc(answer2, [answer1,answer3,answer4])});
answer3.addEventListener("click", function(){answerFunc(answer3, [answer2,answer1,answer4])});
answer4.addEventListener("click", function(){answerFunc(answer4, [answer2,answer3,answer1])});

settingsButton.addEventListener("click", function() {
    settingButtonWasSelected = true
    fourth.style.display = "none";
    sixth.style.display = "block";
    document.getElementById("settingsDiv").style.display = "block";
});

highScoreTableButton.addEventListener("click", function() {
	$.ajax({
		url: '/highScores',
		type: 'GET',
		data: '',
		dataType: 'json',
		success: function (data) {
            highScoreFunc(data)
        }});

    fourth.style.display = "none";
    fifth.style.display = "block";
});

backToMainButton.addEventListener("click", function() {
    settingsButton.style.display = "block";
    fifth.style.display = "none";
    fourth.style.display = "block";
	logo.style.display = "block";
});


backToMainButton8.addEventListener("click", function() {
    settingsButton.style.display = "block";
    eighth.style.display = "none";
    fourth.style.display = "block";
	logo.style.display = "block";
});

function highScoreFunc(data) {
    var scoreTable = document.getElementById('highScores');
    data.sort(function(a, b){
            if (parseInt(a.score) > parseInt(b.score)) {
                return -1;
            }
            if (parseInt(a.score) < parseInt(b.score)) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }
    );

    for(var i = 0; i < 5; i++){
        if(data[i] != undefined) {
            places[i].innerHTML = data[i].name;
            scores[i].innerHTML = data[i].score;
        }
    }
}


highScoreButton8.addEventListener("click", function() {

    $.ajax({
        url: '/highScores',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (data) {
            highScoreFunc(data)
        }});
    
    eighth.style.display = "none";
    fifth.style.display = "block";
	logo.style.display = "block";
});
