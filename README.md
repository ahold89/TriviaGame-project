#README:

##Requirements

NPM(NodeJS), ExpressJS, BodyParser, express-session.

## Instructions

Once Server.js is run as server (port 8081), the app will run.
You then sign-up to the app, by typing credentials (username, password, email, phone number)
(If this isn't the first time your playing since the server is running - log in).
Now you can start the game -> you will have to configure the level of difficulty and the category you want to play.

###Levels      
Easy [1 point per correct answer]
Medium [2 points per correct answer]
Hard [3 point per correct answer]
		 
###Categories 
 
Music, Sports, Science, Geography and General => Each category of each level has 10 questions (Total: 150 questions).
 
If you answer a question incorrectly, the game ends and your score will be compared with previous (5) high scores (of all users that have played).
