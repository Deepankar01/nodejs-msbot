
//common function to get the movie details
module.exports.getMovieDetails = function (imdbID,session) {
    omdbNetworkUtils.getMovieDetails(imdbID).then(function getMovieDetails(movie) {
        let card = cardsUtility.buildMovieCard(movie, session);
        return new builder.Message(session).addAttachment(card);
    });
};

module.exports.getTVSeriesDetails = function (imdbID,session) {
    omdbNetworkUtils.getTVSeriesDetails(imdbID).then(function getSeriesDetails(movie) {
        let card = cardsUtility.buildTVSeriesCard(movie, session);
        return new builder.Message(session).addAttachment(card);
    });
};