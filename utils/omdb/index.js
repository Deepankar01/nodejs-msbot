let unirest = require('unirest');
const applicationConfig = require("../../config/config.json");

module.exports.searchMovies = function (movieName) {
    return new Promise(function (resolve, reject) {
        unirest.get(applicationConfig.omdb.baseUrl)
            .query({
                s: movieName,
                type: applicationConfig.omdb.supportedTypes.movie,
                r: applicationConfig.omdb.supportedReturnTypes.json
            })
            .end(function (response) {
                return resolve(response.body.Search);
            });
    });
};


module.exports.getMovieDetails = function (imdbID) {
    return new Promise(function (resolve, reject) {
        unirest.get(applicationConfig.omdb.baseUrl)
            .query({
                i: imdbID,
                type: applicationConfig.omdb.supportedTypes.movie,
                r: applicationConfig.omdb.supportedReturnTypes.json
            })
            .end(function (response) {
                return resolve(response.body);
            });
    });
};