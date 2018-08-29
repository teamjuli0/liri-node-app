require("dotenv").config();

//Node app required installs
var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs')

//Keys for Spotify api
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);

//Take user input
var nodeArgs = process.argv;
var command = process.argv[2];
var searchItem;
var song;
var movie;
var queryUrl;

//Switch to select what function to use
switch (command) {
  case "concert-this":
    concert();
    break;

  case "spotify-this-song":
    spotifySong();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    justDoIt();
    break;

  default:
    var consoleDefault = '----------NO ENTRY MADE----------\nPlease enter a valid command followed by a search item.\n\nCommand options:\n\n1) "concert-this": Search for event details for an artist./n2) "spotify-this-song": Search for details for a specific song.\n3) "movie-this": Search for movie details of a movie of your choice including release year and ratings.\n4) "do-what-it-says": Search one of the liri commands using the text provided inside of random.txt\n---------------------------------';

    console.log(consoleDefault);
};


//------------------------------------------------------------------------------------------------------------
//CONCERT SEARCH
//------------------------------------------------------------------------------------------------------------


function concert() {
  searchItem = nodeArgs.slice(3).join('+');
  artistName = searchItem;

  if (searchItem === '' || searchItem === undefined) {
    console.log(artistName)
    artistName = 'Chris Tomlin';
  };

  concertSearch();
};

function concertSearch() {
  queryUrl = 'https://rest.bandsintown.com/artists/' + artistName + '/events?app_id=f820042ae046382e266e52ce000263e5';

  request(queryUrl, function(error, response, body) {
    if (error) {
      return console.log("Please try search again!")
    }
    parsedConcertInfo = JSON.parse(body);
    concertInfo = parsedConcertInfo[0];
    console.log("\nArtist Name: " + concertInfo.lineup)
    console.log("\nVenue Name: " + concertInfo.venue.name)
    console.log("\nLocation: " + concertInfo.venue.country)
    console.log("\nDate: " + moment(concertInfo.datetime).format('MM/DD/YYYY'))
  })
}


//------------------------------------------------------------------------------------------------------------
//SPOTIFY SEARCH
//------------------------------------------------------------------------------------------------------------


//Determines what song we will be searching for
function spotifySong() {

  //Variable for movie search
  searchItem = nodeArgs.slice(3).join(' ');
  song = searchItem;

  //If search item is empty...
  if (searchItem == "" || searchItem == undefined) {
    song = "The Final CountDown"
  };

  spotifySearch();
};

//Searches for movie using spotify api
function spotifySearch() {
  spotify.search({
    type: 'track',
    query: song,
    limit: 1,
  }, function(err, data) {


    var songInfo = data.tracks.items
    var spotifyInfo =
      '\n--------------------------------------------\nSong Name: ' + song +
      '\nArtists: ' + songInfo[0].artists[0].name +
      '\nAlbum: ' + songInfo[0].album.name +
      '\nPreview URL: ' + songInfo[0].preview_url


    if (searchItem === "" || searchItem === undefined) {
      console.log('Have you hear ever heard "The Final CountDown? You Really Should!"');
      console.log(spotifyInfo)
    } else if (err) {
      console.log('Error: ' + err)
    } else {
      console.log(spotifyInfo)
    }
  });
};


//------------------------------------------------------------------------------------------------------------
//MOVIE SEARCH
//------------------------------------------------------------------------------------------------------------


//Determines what movie we will be searching for
function movie() {

  //Variable for our movie search
  searchItem = nodeArgs.slice(3).join('+');
  movie = searchItem;

  //If search item is empty...
  if (searchItem === "" || searchItem === undefined) {
    movie = "Mr.Nobody"
  };

  movieSearch();
};

//Searches for movie using omdb api
function movieSearch() {

  //QueryUrl for our movie search
  queryUrl = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=3c3f9ef3";

  //Request for our movie
  request(queryUrl, function(error, response, body) {

    //Variable for movies
    var movieDetails =
      "\n--------------------------------------------\nMovie Title: " + JSON.parse(body).Title +
      "\nRelease Year: " + JSON.parse(body).Year +
      "\nActors: " + JSON.parse(body).Actors +
      "\n\nIMBD Rating: " + JSON.parse(body).imdbRating +
      "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value +
      "\n\nProduced in: " + JSON.parse(body).Country +
      "\nLanguage: " + JSON.parse(body).Language +
      "\n\nMovie Plot: " + JSON.parse(body).Plot + "\n--------------------------------------------\n";

    //If user input is empty...
    if (searchItem === "" || searchItem === undefined) {
      console.log("\nIf you haven't watched Mr. Nobody, then you should. Plus, it's totally on Netflix!");
      console.log(movieDetails);
    }

    //If user movie search successful...
    else if (!error && response.statusCode === 200) {
      console.log(movieDetails);
    }

    //If user movie search returns an error...
    else if (err) {
      console.log("Error: " + err + "\n\nPlease Try Again");
    };
  });
};


//------------------------------------------------------------------------------------------------------------
//JUST DO IT
//------------------------------------------------------------------------------------------------------------
function justDoIt() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if (error) {
      return console.log('Error: ' + error)
    }
    var results = data.split(',');
    command = results[0];
    searchItem = results[1]

    switch (command) {
      case "concert-this":
        concert();
        break;

      case "spotify-this-song":
        spotifySong();
        break;

      case "movie-this":
        movie();
        break;

      case "do-what-it-says":
        justDoIt();
        break;
    }
  })
}
