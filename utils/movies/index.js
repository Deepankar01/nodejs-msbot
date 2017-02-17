module.exports.movies = {
    movieChoices: [],
    extractMovieChoices: function (movieList) {
        this.movieChoices = movieList.map(movie => ("{0} , {1}".format(movie.Title, movie.Year)));
        return this;
    }
};