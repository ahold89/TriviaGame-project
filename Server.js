var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
app.use(bodyParser());
app.use(session({ secret: 'yotam', cookie: { maxAge: 6000000 }}));
app.use('/', express.static(__dirname + '/www'));

// session var
var sess;


var knownAccounts = [];

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/www/project.html" );
});


app.get('/signIn', function (req, res) {
    res.json('true');
    res.end();
});

app.get('/isLogin', function (req, res) {
    sess = req.session;
    if(sess.username) {
        res.json('true');
    } else {
        res.json('false');
    }
    res.end();
});


function checkIfNewUserExists(checkedName) {
	
	if(knownAccounts.length == 0) {
		return false;
	}
	
	for(var i = 0 ; i < knownAccounts.length; i++) {
		if(knownAccounts[i].name === checkedName) {
			return true;
		}
	}
	return false;
}

function checkIfKnowUserExists(checkedName, checkedPassword) {
	for(var i = 0 ; i < knownAccounts.length; i++) {
		if((knownAccounts[i].name === checkedName) && (knownAccounts[i].password === checkedPassword)) {
			return true;
		}
	}
	return false;
}

app.post('/getInKnownUser', function (req, res) {

	var account = {
		name: req.body.username,
		password: req.body.userPassword		
	}
	
	if(checkIfKnowUserExists(req.body.username, req.body.userPassword)) {
		var SuccessLoginDetails = {
            'isSuccess': 'true',
            'username': account.name,
            'password': account.password
        };
		sess = req.session;
		sess.username = account.name;
		res.json(SuccessLoginDetails);
	} else {
		var notSuccessLoginDetails = {
            'isSuccess': 'flase',
            'username': account.name,
            'password': account.password
        };
		res.json(notSuccessLoginDetails);
	}
	
	res.end;
});

app.post('/getInNewUser', function (req, res) {

	var account = {
		name: req.body.username,
		password: req.body.userPassword,
		phone: req.body.userPhone,
		email: req.body.userEmail,
		score: 0		
	}
	if(checkIfNewUserExists(req.body.username)) {
		var notSuccessLoginDetails = {
            'isSuccess': 'false',
            'username': account.name,
            'password': account.password
        };
		res.json(notSuccessLoginDetails);
	} else {
		knownAccounts.push(account);
		var successLoginDetails = {
            'isSuccess': 'true',
            'username': account.name,
            'password': account.password
        };
		sess = req.session;
		sess.username = account.name;
		res.json(successLoginDetails);
	}
	res.end;
});


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});

app.post('/isCorrect', function (req, res) {
	
	sess = req.session;
	
	if(sess.username) {
     var returnValue = 'false';
	 
	 for(var i = 0; i < Answers.length; i++) {
		 if(req.body.a === Answers[i]) {
			 returnValue = 'true';
			 break;
		 }
	 }
	 res.json(returnValue);		
	}

     res.end();
 });

 
 app.post('/updateScore', function (req, res) {
	
     var score = req.body.score;
	 
	 for(var i = 0; i < Answers.length; i++) {
		 if(req.body.a === Answers[i]) {
			 returnValue = 'true';
			 break;
		 }
	 }
	 res.json(returnValue);
     res.end();
 });
 
function checkUserScore(checkedName, newScore) {
				
	for(var i = 0; i < knownAccounts.length; i++) {
		if((knownAccounts[i].name === checkedName)) {
			if(knownAccounts[i].score  < newScore) {
				knownAccounts[i].score = newScore;
			//	return true;
			}
		}
	}

	if(highTableScores.length == 0) {
		return true;
	}

	else {
		if(highTableScores.length < 5) {
			return true;
		}
		var counter = 0;
		for(var i = 0; i < highTableScores.length; i++) {
			if(newScore <= parseInt(highTableScores[i].score)) {
				counter++;
			}
			if(counter >= 5) {
				break;
			}
		}

		if(counter < 5)
		{
			return true;
		}
	}
	return false;

} 

 
 
app.post('/checkScore', function (req, res) {

	sess = req.session;
    if(sess.username) {
		var scoreToCheck = req.body.scoreTo;
		
		if(checkUserScore(sess.username, parseInt(scoreToCheck))) {

			var NewHighScore = {
				'isSuccess': 'true',
				'score': scoreToCheck
			};

			highTableScores.push({
				name: sess.username,
				score: req.body.scoreTo
			});

			res.json(NewHighScore);

		} else {

		var NotNewHighScore = {
			'isSuccess': 'false', 
			'score': scoreToCheck
		};

		res.json(NotNewHighScore);
		}
	}

	res.end;	
});
 
app.get('/highScores', function (req, res) {
	//Take Top 5 scores:
	var scoresToSend = [];
	var length = highTableScores.length;
	
	for(var i = 0; i < length; i++){
		scoresToSend.push({name:highTableScores[i].name,
							 score:highTableScores[i].score});
	}
	res.json(scoresToSend);
	res.end();
}); 

var highTableScores = [];
 
 
 
 
 
 
 
 
 
 
 

Answers = ["11","5","90 minutes","40 minutes","Football player","Tennis tournament","White","Orange","4","swimming", "55 countries", "Uruguay", "9", "9.58", "Paul Pogba", "Avi Nimni", "Maccabi Tel-Aviv", "1930s", "India", "Softball", "Paris","North America","Qatar","Buenos Aires","Siam","China",
    "Amsterdam","Rome","Washington DC", "The Pacific","Stockholm",
    "1,250,000,000","Baku","Lebanon","Africa","Libya","Ordem e progresso",
    "Luxenburg","B'nei Barak","Mandarin","Ulan Betor","Malabo","Zimbabwe",
    "Venezuela","Algeria","Malawi","Niamey","Caracas, Venezuela","Faroe Islands",
    "North Korea","Ariana Grande","4","Justin Timberlake","Nirvana didn't release an album called 'The Wall'",
	"Ed Sheeran","Taylor Swift","The Cardigans","This Is Goodbye","Britney Spears","Good Riddance (Time of Your Life)",
	"Eight","The Archies","Justin Timberlake","The Cardigans","+, *","1.Renaissance 2.Baroque 3.Classical 4.Romantic",
	"Joseph Haydn","Katy Perry","Louise Veronicas","Blowin' In The Wind","Waiting For The Sun",
	"Let It Be - Beatles","Diana Ross","One Direction - 'Na Na Na'","Britney Spears - 'Till the World Ends'",
	"The Freddie Mercury Tribute Concert","Hands And Feet","Ryan Raynolds","None of the above","New Jersey",
	"Adam Lambert","Around 3 pounds","The Sequoia","Number of times the word 'f-ck' is mentioned by Al Pacino in Scarface",
	"Brothers","X15","Walmart","Spinach","4","Consumption of cannabis","Caligula","1789","Alexander Dumas","Tim Berners-Lee",
	"Muhammad", "A six-sided polygon","2.72m","The Count Of Monte Cristo","Stanford","Titanic","Thomas A. Anderson",
	"George Washington","1939-1945","Hebrew","The Nile","Michael Richards","David Schwimmer","Burj Khalifa",
	"The judge","J","1492","A type of Pulsar","A planet that emmits elctromagnetic waves","65 million years ago","10nm to 380nm",
	"Graviton","Masseter","Osmium","233 degrees celsius","Polonium","About 4.5 billion years","The European Organization for Nuclear Research",
	"An electrical generator that produces direct current","The material within a living cell, excluding the nucleus",
	"The Strong Force, Weak Force, Magnetic Force, Gravity","The Photo-Electric effect","6,371 km","The second explains the first",
	"Newton's second law","340.29 m/s","299,792,458 m/s","Armenium","A physicist and chemist who conducted pioneering research on radioactivity",
	"Hypertext Transfer Protocol","Alexander Graham Bell","Father of the periodic table","Mercury","65 million years ago",
	"100 degrees centigrade","Blue Whale","H20","Cesar Cielo","Butterfly","Cricket","Touching the pool floor","4 medals","Emmanuel Petit",
	"110m","Edson Arantes do Nascimento","Eddie Hall","Gabriel Sotomayor"];	
