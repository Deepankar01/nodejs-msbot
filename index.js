var restify = require('restify');
var builder = require('botbuilder');
var moment = require("moment");
var unirest = require('unirest');

var menuChoices = [
    "Search Movie", "Movies List"
];


//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "YOUR APP ID",
    appPassword: "YOUR APP PASSWORD"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [
    function (session) {
        builder.Prompts.choice(session, "What do you want to search for?", menuChoices);
    },
    function (session, results) {
        var userChoice = results.response.entity;
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
    builder.Prompts.text(session, "This feature is under construction :)");
    session.endDialog();
    session.beginDialog("/");
}]);


//show some kind of error
bot.dialog('/someError', [function (session) {
    builder.Prompts.text(session, "This feature is under construction :)");
    session.endDialog();
    session.beginDialog("/");
}]);
