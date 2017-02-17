const applicationConfig = require("./config/config.json");
var restify = require('restify');
var builder = require('botbuilder');
var moment = require("moment");
var unirest = require('unirest');
//load string utils
require('./utils/strings');

var menuChoices = [
    "Search Movie", "Movies List"
];


console.log("{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET"));

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || applicationConfig.port, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: applicationConfig.appId,
    appPassword: applicationConfig.appPassword
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
