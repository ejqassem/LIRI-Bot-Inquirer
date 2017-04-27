// Global variables/npm package import
//============================================================================

var keys = require("./keys.js");
var Twitter = require('twitter');
var inquirer = require("inquirer");
var spotify = require("spotify");
var omdb = require("omdb");
var fs = require("fs");
var userSong = "";
var userMovie = "";


// Function Declarations
//============================================================================
function getTweets() {

  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  var params = {
    screen_name: "IanTheGreat7"
  };

  client.get('statuses/user_timeline', params, function(error, tweets, response){
    for (var i = 0; i < tweets.length; i++) {
      if(error) throw err;
      else {
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
      }
    }
  });
}

function spotifyThis() {
// userInput === "song-name", used in server call to grab:
  // Artist
  // The song's name
  // A preview link from spotify
  // The album that the song is from
// If no song is provided, then default display = "The Sign" by Ace of Base
  var songArray = [];
  spotify.search({ type:'track', query: userSong}, function(err, data) {
    if(!err) {
      // console.log(data.tracks.items[0]);
      console.log("The artist is " + data.tracks.items[0].artists[0].name);
      console.log("The song's name is: " + data.tracks.items[0].name);
      console.log("A url to preview this song is: " + data.tracks.items[0].preview_url);
      console.log("The album this track is from is " + data.tracks.items[0].album.name);

      songArray.push(data.tracks.items[0].artists[0].name, data.tracks.items[0].name, data.tracks.items[0].preview_url, data.tracks.items[0].album.name);
      // fs.appendFile("log.txt", songArray, function(err) {
      //   if(err) throw err;
      //   console.log("The data was appended to 'log.txt'");
      // });
    }
    else if (!data){
      console.log("'The Sign' by Ace of Base");
    }
  });
}

function movieThis() {
  // omdb API retrieving movie specificied by title, false = shortened plot returned
  omdb.get({ title: userMovie}, false, function(err, movie) {
      if(err) {
          return console.error(err);
      }
      if(!movie) {
          return console.log('Mr. Nobody');
      }
      var movieInfo = [];
      var movieActors = [];
      // console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
      console.log("The Movie's title is " + movie.title + ", release date: "+ movie.year + ", and the imdb rating: " + movie.imdb.rating);
      console.log(movie.plot);
      for( var i in movie.actors) {
        console.log("An actor in " + movie.title + " is " + movie.actors[i]);
      }
      for (var i in movie.countries) {
        console.log("This movie was shown in: " + movie.countries[i]);
      }
      console.log("The rotten Tomates URL is " + movie.tomato);

      movieInfo.push(movie.title, movie.year, movie.imdb.rating, movie.plot, movie.actors, movie.countries, movie.tomato);
      // fs.appendFile("log.txt", movieInfo, function(err) {
      //   if(err) throw err;
      //   console.log("The data was appended to 'log.txt'");
      // });
  });
}

// Main Code (Prompts user questions in the command line/terminal)
//============================================================================
inquirer.prompt([
  {
    type: "confirm",
    message: "Are you ready?",
    name: "confirm",
    default: true
  },

  {
    type: "input",
    message: "Please enter your favorite song!",
    name: "favoriteSong"
  },

  {
    type: "input",
    message: "Please enter your favorite movie!",
    name: "favoriteMovie"
  },

  {
    type: "list",
    message: "Please choose a function to run",
    choices: ["get-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "userChoice"
  }

]).then(function(data) {

  // if user chooses "get-tweets"
  //============================================================================
  if(data.userChoice === "get-tweets") {
    getTweets();
  }

    // if user chooses "spotify-this-song"
    //============================================================================
    else if(data.userChoice === "spotify-this-song") {
      // stores the user input's favorite song from the inquirer prompt so it can be used in the spotify query
      userSong = data.favoriteSong;
      spotifyThis();

    }

    // if user chooses "movie-this"
    //============================================================================
    else if(data.userChoice === "movie-this") {
      // stores the user input's favorite movie from the inquirer prompt so it can be used in the omdb query
      userMovie = data.favoriteMovie;
      movieThis();
    }

    // if user chooses "do-what-it-says"
    //============================================================================
    else if (data.userChoice === "do-what-it-says") {
      fs.readFile("random.txt", "utf8", function(err, data) {
        console.log(data);
        var dataArr = data.split(",");
        if(dataArr[0] === "spotify-this-song") {
          userSong = dataArr[1];
          spotifyThis();
        }
        else if(dataArr[0] === "movie-this") {
          userMovie = dataArr[1];
          movieThis();
        }
        else if(data.trim() === "get-tweets") {
          getTweets();
        }
      });
    }
});
