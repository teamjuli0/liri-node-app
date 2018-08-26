require("dotenv").config();

var keys = require('./keys.js');
var request = require('request');
var Spotify = require('node-spotify-api');

var nodeArgs = process.argv
var command = process.argv[2]
var searchItem = nodeArgs.slice(3).join('+')

//Movie Command
if (command === "movie-this") {
  var movie = searchItem
  if (searchItem == "") {
    movie = "Mr.Nobody"
  }
  var queryUrl = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=3c3f9ef3";

  request(queryUrl, function(error, response, body) {
    if (searchItem == "") {
      console.log("\nIf you haven't watched Mr. Nobody, then you should; It's on Netflix!")
      console.log("\nMovie Title: " + JSON.parse(body).Title + "\n\nRelease Year: " + JSON.parse(body).Year + "\nActors: " + JSON.parse(body).Actors + "\n\nIMBD Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value + "\n\nProduced in: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\n\nMovie Plot: " + JSON.parse(body).Plot)
    } else if (!error && response.statusCode === 200) {
      console.log("\nMovie Title: " + JSON.parse(body).Title + "\n\nRelease Year: " + JSON.parse(body).Year + "\nActors: " + JSON.parse(body).Actors + "\n\nIMBD Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value + "\n\nProduced in: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\n\nMovie Plot: " + JSON.parse(body).Plot)
    } else {
      console.log("Error: " + error)
    }
  })
} else if command === "spotify-this-song" {

  var song = searchItem
  var queryUrl = d
  request
}