require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var dateFormat = require("dateFormat");
// var moment = require ('moment');
// moment().format();
var inquirer = require("inquirer");
// var concert = require('bandsintown-events');

var spotifyApi = new Spotify(keys.spotify);

var command1 = process.argv[2];
var command2 = process.argv[3];

// function runAction(command1, command2) {
switch (command1) {
    // use spotify api
    case "spotify-this-song":
        spotify();
        break;
    // use omdb api
    case "movie-this":
        movie();
        break;
    // use bands in town
    case "concert-this":
        concert();
        break;
    case "do-what-it-says":
        what();
        break;
    default:
        console.log("Error! Please try again!");
}

function spotify() {

    spotifyApi.search({ type: 'track', query: command2, limit: 1 }, function (err, data) {
        if (err) {
            return console.log("Error" + err);
        }

        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Title: " + data.tracks.items[0].name);
        console.log("Song Link: " + data.tracks.items[0].artists[0].href);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Release date: " + data.tracks.items[0].album.release_date);

    });
}

function movie() {


    request("http://www.omdbapi.com/?t=" + command2 + "&apikey=32b165d1", function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var jsonData = JSON.parse(body);


            console.log("Title: " + jsonData.Title);
            console.log("Release in " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated)
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Actors);
            console.log("Actors: " + jsonData.Actors);
        }
    });
}

function concert() {
    var location = ""
    var queryURL = "https://rest.bandsintown.com/artists/" + command2 + "/events?app_id=e7698ddd959431609007fd04406b8322"
    // e7698ddd959431609007fd04406b8322
    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            var result = JSON.parse(body);


            console.log(command2 + " results:")


            for (i = 0; i < result.length; i++) {

                console.log("Name of venue: " + result[i].venue.name);
                console.log("Venue location: " + result[i].venue.city + ", " + result[i].venue.region);
                console.log("Date of event: " + dateFormat(result[i].datetime, "mm/dd/yyyy"))
                // dateFormat(result[i].datatime, "mm/dd/yyyy"))
            }
        }
    })
}


function what() {


    // Running the readFile module that's inside of fs.
    // Stores the read information into the variable "data"
    fs.readFile("random.txt", "utf8", function (error, data) {
        // if (!error) {
        //     console.log(error);
        var dataArr = data.split(",");

        command1 = dataArr[0];
        command2 = dataArr[1];
        // command1 = data;
        if (command1 === 'spotify-this-song') {
            spotify(command2);
        }
        if (command1 === 'movie-this') {
            movie(command2);
        }
        if (command1 === 'concert-this') {
            concert(command2);
        }
   

        


    //  console.log(data);


        // spotify(dataArr[0], dataArr[1]);

        //     // console.log(dataArr[0], dataArr[1]);

        //    if (dataArr[0] === "spotify-this-song") {
        //        var song = dataArr[1].slice(1, -1);
        //        spotify(song);
        //    } else if (dataArr[0] === "movie-this") {
        //        var movies = dataArr[1].slice(1, -1);
        //        movie(movies);
        //    } else if (dataArr[0] === "concert-this") {
        //        var show = dataArr[1].slice(1, -1);
        //        concert(show);


    

});
}

