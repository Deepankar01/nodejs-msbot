/**
 * Created by Agrawal Deepankar on 23/02/2017.
 */
module.exports.TVSeries = {
    seriesChoices: [],
    extractTVSeriesChoices: function (seriesList) {
        this.seriesChoices = seriesList.map(series => ("{0} , {1}".format(series.Title, series.Year)));
        console.log(this.seriesChoices);
        return this;
    }
};