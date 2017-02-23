//constants
const applicationConfig = require("./config/config.json");
const url = require('url');
const cardsUtility = require('./utils/cards');
const _ = require('lodash');

//3rd party libraries
let restify = require('restify');
let builder = require('botbuilder');
let moment = require("moment");

//self made libraries
let omdbNetworkUtils = require('./utils/omdb');
let movieUtils = require('./utils/movies');
let seriesUtils = require('./utils/tvSeries');
let commons = require('./utils/commons');

//load string utils
require('./utils/strings');

let menuChoices = [
    "Search Movie",
    "TV Series",
    "Suggest some"
];


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

//root dialog
bot.dialog('/', [
    function (session) {
        builder.Prompts.choice(session, "What do you want to search for?", menuChoices);
    },
    function (session, results) {
        let userChoice = results.response.entity;
        if (userChoice === "Search Movie") {
            session.beginDialog('/searchMovie');
        }
        else if (userChoice === "TV Series") {
            session.beginDialog('/tvSeriesInfo');
        }
        else if (userChoice === "Suggest some") {
            session.beginDialog('/suggestSome');
        }
        else {
            session.beginDialog('/someError');
        }
    }
]);


/**
 * suggestions for some movie after a series of waterfall question
 */
bot.dialog('/suggestSome', [function (session) {
    //get some nice movies or tv series after a series of questions
}]);


/**
 * TV Series waterfall dialog session
 */
bot.dialog('/tvSeriesInfo', [
    function (session) {
        builder.Prompts.text(session, "What's the name of the series a partial name also works for me");
    },
    function (session, result) {
        let tvSeries = result.response;
        omdbNetworkUtils.getTVSeries(tvSeries).then(function tvSeriesParser(tvSeriesList) {
            let tvSeriesTitlesList = seriesUtils.TVSeries.extractTVSeriesChoices(tvSeriesList).seriesChoices;
            /**
             * Check the length of series list
             * if we have more than one then we need to add it to the user session
             * storage else we don't need it
             */

            if (tvSeriesList.length === 1) {
                let card = commons.getTVSeriesDetails(tvSeriesList.imdbID, session);
                session.send(card);
                session.endDialog();
                session.beginDialog("/");
            }
            else {
                //we have multiple series
                session.userData.tvSeries = tvSeriesList;
                builder.Prompts.choice(session, "I found a lot of series named {0}\n Which one are you exactly looking for?".format(tvSeries), tvSeriesTitlesList);
            }

        });

    },
    function (session, result) {
        let TVSeriesTitle = result.response.entity.split(" ,")[0];
        let series = _.find(session.userData.tvSeries, {'Title': TVSeriesTitle});
        omdbNetworkUtils.getMovieDetails(series.imdbID).then(function getSeriesDetails(seriesDetails) {
            let card = cardsUtility.buildTVSeriesCard(seriesDetails, session);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            session.endDialog();
            session.beginDialog("/");
        });
    }
]);


/**
 * Search Movie dialog
 */
bot.dialog('/searchMovie', [
    function (session) {
        builder.Prompts.text(session, "What's the movie name a partial movie name also works for me");
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
            if (movieTitles.length === 1) {
                let card = commons.getMovieDetails(movies.imdbID, session);
                session.send(card);
                session.endDialog();
                session.beginDialog("/");
            }
            else {
                session.userData.movies = movies;
                builder.Prompts.choice(session, "I found a lot of movies named {0}\n Which one are you exactly looking for?".format(movieName), movieTitles);
            }
        });

    }, function (session, result) {
        let movieTitle = result.response.entity.split(" ,")[0];
        let movie = _.find(session.userData.movies, {'Title': movieTitle});
        omdbNetworkUtils.getMovieDetails(movie.imdbID).then(function getMovieDetails(movieDetails) {
            let card = cardsUtility.buildMovieCard(movieDetails, session);
            let msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
            session.endDialog();
            session.beginDialog("/");
        });
    }
]);


/**
 * If some kind of error happens then some error
 */
bot.dialog('/someError', [
    function (session) {
        builder.Prompts.text(session, "Something happened :joy:");
        session.endDialog();
        session.beginDialog("/");
    }]);
