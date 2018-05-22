require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var fs = require("fs");
var request = require('request');



var writeToLog = function (data) {
  fs.appendFile("log.txt", '\n-----\n');

  fs.appendFile("log.txt", JSON.stringify(data), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
}

//Creates a function for finding artist name from spotify
var spotify = new Spotify(keys.spotify);
var getArtistNames = function (artist) {
  return artist.name;
};

//Function for finding songs on Spotify
var mySpotify = function (songName) {
  if (songName === undefined) {
    songName = 'Shadows on the sun';
  };

  spotify.search({
    type: 'track',
    query: songName
  }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;
    var data = []; //empty array to hold data

    for (var i = 0; i < songs.length; i++) {
      data.push({
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
    writeToLog(data);
  });
};

var myTweets = function () {
var client = new Twitter(keys.twitter);
var params = {
    screen_name: 'Tyler02296653',
    count: 20
  };

  client.get('statuses/user_timeline', params, function (error, tweets, response) {

    if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
          'created at: ': tweets[i].created_at,
          'Tweets: ': tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};

var myMovie = function (movieName) {

  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&apikey=trilogy";

  request(urlHit, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
        'Title: ': jsonData.Title,
        'Year: ': jsonData.Year,
        'Rated: ': jsonData.Rated,
        'IMDB Rating: ': jsonData.imdbRating,
        'Country: ': jsonData.Country,
        'Language: ': jsonData.Language,
        'Plot: ': jsonData.Plot,
        'Actors: ': jsonData.Actors,
        'Rotten Tomatoes Rating: ': jsonData.tomatoRating,
        'Rotton Tomatoes URL: ': jsonData.tomatoURL,
      });
      console.log(data);
      writeToLog(data);
    }
  });

}

var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}

var pick = function (caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      myTweets();
      break;
    case 'spotify-this-song':
      mySpotify(functionData);
      break;
    case 'movie-this':
      myMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}

//run this on load of js file
var runThis = function (argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);