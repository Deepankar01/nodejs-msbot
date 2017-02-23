let unirest = require('unirest');
const applicationConfig = require("../../config/config.json");

/**
 * Function to search the movies
 * @param movieName
 * @returns {Promise}
 */
module.exports.searchMovies = function (movieName) {
    return new Promise(function (resolve, reject) {
        try {
            unirest.get(applicationConfig.omdb.baseUrl)
                .query({
                    s: movieName,
                    type: applicationConfig.omdb.supportedTypes.movie,
                    r: applicationConfig.omdb.supportedReturnTypes.json
                })
                .end(function (response) {
                    return resolve(response.body.Search);
                });
        }
        catch (exception) {
            reject(exception);
        }

    });
};


/**
 * Function to get the movie details
 * @param imdbID
 * @returns {Promise}
 */
module.exports.getMovieDetails = function (imdbID) {
    return new Promise(function (resolve, reject) {
        try {
            unirest.get(applicationConfig.omdb.baseUrl)
                .query({
                    i: imdbID,
                    type: applicationConfig.omdb.supportedTypes.movie,
                    r: applicationConfig.omdb.supportedReturnTypes.json
                })
                .end(function (response) {
                    return resolve(response.body);
                });
        }
        catch (exception) {
            reject(exception);
        }

    });
};

/**
 * Function to get the TV Series
 * @param tvSeriesName
 * @returns {Promise}
 */
module.exports.getTVSeries = function (tvSeriesName) {
    return new Promise(function (resolve, reject) {
        try {
            unirest.get(applicationConfig.omdb.baseUrl)
                .query({
                    s:tvSeriesName,
                    type: applicationConfig.omdb.supportedTypes.series,
                    r: applicationConfig.omdb.supportedReturnTypes.json
                })
                .end(function (response) {
                    return resolve(response.body.Search);
                })
        }
        catch (exception) {
            reject(exception);
        }
    });
};