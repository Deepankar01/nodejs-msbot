//constants
const applicationConfig = require("./config/config.json");
const url = require('url');
const cardsUtility = require('./utils/cards');
const _ = require('lodash');

let restify = require('restify');
let builder = require('botbuilder');
let moment = require("moment");
let unirest = require('unirest');
let omdbNetworkUtils = require('./utils/omdb');
let movieUtils = require('./utils/movies');


//load string utils
require('./utils/strings');

let menuChoices = [
    "Search Movie", "Movies List"
];


// console.log("{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET"));

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || applicationConfig.port, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
let connector = new builder.ChatConnector({
    appId: applicationConfig.appId,
    appPassword: applicationConfig.appPassword
});
let bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [
    function (session) {
        builder.Prompts.choice(session, "What do you want to search for?", menuChoices);
    },
    function (session, results) {
        let userChoice = results.response.entity;
        if (userChoice === "Search Movie") {
            session.beginDialog('/searchMovie');
        }
        else if (userChoice === "Movies List") {
            session.beginDialog('/getMovieList');
        }
        else {
            session.beginDialog('/someError');
        }
    }
]);


//search for a particular movie
bot.dialog('/searchMovie', [function (session) {
    builder.Prompts.text(session, "Enter a movie name or a partial movie name");
}, function (session, result) {
    //TODO add LUIS or REGEX
    let movieName = result.response;
    omdbNetworkUtils.searchMovies(movieName).then(function searchMovies(movies) {
        let movieTitles = movieUtils.movies.extractMovieChoices(movies).movieChoices;
        /**
         * Check the length of movie lists
         * if we have more than one then we need to add it to the user session
         * storage else we don't need it
         */
        if (movieTitles.length == 1) {
            //get more details
            omdbNetworkUtils.getMovieDetails(movies.imdbID).then(function getMovieDetails(movie) {
                let card = cardsUtility.buildMovieCard(movie, session);
                let msg = new builder.Message(session).addAttachment(card);
                console.log(msg);
                session.send(msg);
                session.endDialog();
                session.beginDialog("/");
            });
        }
        else {
            session.userData.movies = movies;
            builder.Prompts.choice(session, "I found a lot of movies named {0}\n Which one are you looking for?".format(movieName), movieTitles);
        }
    });

}, function (session, result) {
    let movieTitle = result.response.entity.split(" ,")[0];
    let movie = _.find(session.userData.movies, {'Title': movieTitle});
    omdbNetworkUtils.getMovieDetails(movie.imdbID).then(function getMovieDetails(movieDetails) {
        console.log(movieDetails);
        let card = cardsUtility.buildMovieCard(movieDetails, session);
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        session.endDialog();
        session.beginDialog("/");
    });
}
]);


//show some kind of error
bot.dialog('/someError', [function (session) {
    builder.Prompts.text(session, "Something happened :joy:");
    session.endDialog();
    session.beginDialog("/");
}]);
