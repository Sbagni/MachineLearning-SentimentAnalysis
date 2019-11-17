// Declare the data variable
const data = '/json';

// Using d3, fetch the JSON data
d3.json(data).then((data) => {
    //  console.log(data) 
    var button = d3.select("#filter-btn")

    button.on("click", () => {
        var inputStart = d3.select("#start");
        var startValue = inputStart.property("value")
        var startValue = startValue - 1;
        var inputEnd = d3.select("#end");
        var endValue = inputEnd.property("value");
        console.log(startValue)
        buildCSV(startValue, endValue, data)
    }
    )
    buildCSV(0, 25, data);
});

function buildCSV(start, end, data) {
    var movieData = [];
    data.slice(start, end).forEach((movie) => {
        var actors = movie.Actors;
        // var genres = movie.Genre;
        actors.forEach((actor) => {
            var movieList = [movie.Title, movie.Rated];
            movieList.push(actor);
            movieData.push(movieList);
        })
    });
    //console.log(movieData);
    // From JSON
    var json = {
        'header': ['Movies', 'Rating', 'Actor'],
        'data': movieData
    };
    var csv = new dex.csv(json);


    // Configure a chart
    var network = dex.charts.d3plus.RingNetwork({
        'parent': '#D3Plus_RingNetwork',
        'type': 'rings',
        'edges': { 'arrows': true },
        'csv': csv
    }).render()
}