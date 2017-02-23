let builder = require('botbuilder');

module.exports.buildMovieCard = function (movie, session) {
    return new builder.HeroCard(session)
        .title(movie.Title)
        .subtitle("{0} IMDB {1}".format(movie.Year, movie.imdbRating))
        .text(movie.Plot)
        .images([builder.CardImage.create(session, movie.Poster)])
};


module.exports.buildTVSeriesCard = function (series, session) {
    return new builder.HeroCard(session)
        .title(series.Title)
        .subtitle("{0} IMDB {1}".format(series.Year, series.imdbRating))
        .text(series.Plot)
        .images([builder.CardImage.create(session, series.Poster)])
};