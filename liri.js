/*
LIRI Bot

In this assignment, you will make LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

Make a new GitHub repository called liri-node-app and clone it to your computer.

To retrieve the data that will power this app, you'll need to send requests to the Twitter, Spotify and OMDB APIs. You'll find these Node packages crucial for your assignment.

In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.

Make sure you append each command you run to the log.txt file.

Do not overwrite your file each time you run a command.
*/

var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request'); // You'll use Request to grab data from the OMDB API.
var fs = require('fs');

// At the top of the liri.js file, write the code you need to grab the data from keys.js. Then store the keys in a variable.

var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

// Read in the command line arguments
var cmdArgs = process.argv;

// The LIRI command will always be the second command line argument
var liriCommand = cmdArgs[2];

// The parameter to the LIRI command may contain spaces
var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

// LIRI will display your latest tweets. As we do not want to display your personal account, or its keys, please make an alias account and add a few tweets to it!
// retrieveTweets will retrieve my last 20 tweets and display them together with the date
function retrieveTweets() {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
		if (err) throw err;
	});

	// Initialize the Twitter client
	var client = new Twitter(twitterKeys);

	// Set the 'screen_name' to my Twitter handle
	var parameters = {screen_name: '@joevfuentes', count: 20};

	// Retrieve the last 20 tweets
	client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
		if (error) {
			var errorString = 'ERROR: Retrieving user tweets -- ' + error;

			// Append the error string to the log file
			fs.appendFile('./log.txt', errorString, (err) => {
				if (err) throw err;
				console.log(errorString);
			});
			return;
		} else {
			// Pretty print user tweets
			var outputString = '------------------------\n' +
							'User Tweets:\n' + 
							'------------------------\n\n';

			for (var i = 0; i < tweets.length; i++) {
				outputString += 'Created on: ' + tweets[i].created_at + '\n' + 
							 'Tweet content: ' + tweets[i].text + '\n' +
							 '------------------------\n';
			}

			// Append the output to the log file
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
				if (err) throw err;
				console.log(outputString);
			});
		}
	});
}

// spotifySong will retrieve information on a song from Spotify
function spotifySong(song) {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
		if (err) throw err;
	});

	// If no song is provided, LIRI defaults to 'The Sign' by Ace Of Base
	var search;
	if (song === '') {
		search = 'The Sign Ace Of Base';
	} else {
		search = song;
	}

	spotify.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
			var errorString1 = 'ERROR: Retrieving Spotify track -- ' + error;

			// Append the error string to the log file
			fs.appendFile('./log.txt', errorString1, (err) => {
				if (err) throw err;
				console.log(errorString1);
			});
			return;
	    } else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				var errorString2 = 'ERROR: No song info retrieved, please check the spelling of the song name!';

				// Append the error string to the log file
				fs.appendFile('./log.txt', errorString2, (err) => {
					if (err) throw err;
					console.log(errorString2);
				});
				return;
			} else {
				// Pretty print the song information
				var outputString = '------------------------\n' + 
								'Song Information:\n' + 
								'------------------------\n\n' + 
								'Song Name: ' + songInfo.name + '\n'+ 
								'Artist: ' + songInfo.artists[0].name + '\n' + 
								'Album: ' + songInfo.album.name + '\n' + 
								'Preview Here: ' + songInfo.preview_url + '\n';

				// Append the output to the log file
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
					if (err) throw err;
					console.log(outputString);
				});
			}
	    }
	});
}
/*
node liri.js movie-this '<movie name here>'

This will output the following information to your terminal/bash window:

  * Title of the movie.
  * Year the movie came out.
  * IMDB Rating of the movie.
  * Rotten Tomatoes Rating of the movie.
  * Country where the movie was produced.
  * Language of the movie.
  * Plot of the movie.
  * Actors in the movie.
*/
// retrieveOMDBInfo will retrieve information on a movie from the OMDB database
function getMovieInfo(movie) {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
		if (err) throw err;
	});

	// If the user doesn't type a movie title in, the program will output data for the movie 'Mr. Nobody.'
	var search;
	if (movie === '') {
		search = 'Mr. Nobody';
	} else {
		search = movie;
	}

	// Replace spaces with '+' for the query string
	search = search.split(' ').join('+');

	// Construct the query string
	var queryStr = 'http://www.omdbapi.com/?t=' + search + '&plot=full&tomatoes=true';

	// Send the request to OMDB
	request(queryStr, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
			var errorString1 = 'ERROR: Retrieving OMDB entry -- ' + error;

			// Append the error string to the log file
			fs.appendFile('./log.txt', errorString1, (err) => {
				if (err) throw err;
				console.log(errorString1);
			});
			return;
		} else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released && !data.imdbRating) {
				var errorString2 = 'ERROR: No movie info retrieved, please check the spelling of the movie name!';

				// Append the error string to the log file
				fs.appendFile('./log.txt', errorString2, (err) => {
					if (err) throw err;
					console.log(errorString2);
				});
				return;
			} else {
		    	// Pretty print the movie information
		    	var outputString = '------------------------\n' + 
								'Movie Information:\n' + 
								'------------------------\n\n' +
								'Movie Title: ' + data.Title + '\n' + 
								'Year Released: ' + data.Released + '\n' +
								'IMBD Rating: ' + data.imdbRating + '\n' +
								'Country Produced: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Actors: ' + data.Actors + '\n' + 
								'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
								'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';

				// Append the output to the log file
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
					if (err) throw err;
					console.log(outputString);
				});
			}
		}
	});
}

// beObedient will read in a file to determine the desired command and then execute
function beObedient() {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
		if (err) throw err;
	});

/*
Make a file called random.txt.
Inside of random.txt put the following in with no extra characters or white space:
Make a JavaScript file named liri.js.
*/
	// Read in the file containing the command
	fs.readFile('./random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else {
			// Split out the command name and the parameter name
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();

			/* 
			Make it so liri.js can take in one of the following commands:
				- my-tweets
				- spotify-this-song
				- movie-this
			*/
			switch(command) {
				case 'my-tweets':
					retrieveTweets(); 
					break;

				// spotify-this-song,"I Want it That Way"
				case 'spotify-this-song':
					spotifySong(param);
					break;

				case 'movie-this':
					getMovieInfo(param);
					break;
			}
		}
	});
}

// Determine which LIRI command is being requested by the user

/*
node liri.js my-tweets
This will show your last 20 tweets and when they were created at in your terminal/bash window.
*/
if (liriCommand === 'my-tweets') {
	retrieveTweets(); 

} else if (liriCommand === `spotify-this-song`) {
	spotifySong(liriArg);

} else if (liriCommand === `movie-this`) {
	getMovieInfo(liriArg);

} else if (liriCommand ===  `do-what-it-says`) { // node liri.js do-what-it-says
	beObedient();	// do-what-it-says

} else {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: ' + cmdArgs + '\n\n', (err) => {
		if (err) throw err;

		// If the user types in a command that LIRI does not recognize, output the Usage menu 
		// which lists the available commands.
		outputString = 'Usage:\n' + 
				   '    node liri.js my-tweets\n' + 
				   '    node liri.js spotify-this-song "<song_name>"\n' + 
				   '    node liri.js movie-this "<movie_name>"\n' + 
				   '    node liri.js do-what-it-says\n';

		// Append the output to the log file
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputString + '\n', (err) => {
			if (err) throw err;
			console.log(outputString);
		});
	});
}