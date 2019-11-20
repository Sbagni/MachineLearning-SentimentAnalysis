var width = 100;
var heght = 100;
var textValueTextBlog = d3.selectAll("#textValueTextblog").text();
var imgs = d3.selectAll("#smileFaceTextblo");

if (textValueTextBlog == "negative") {
  imgs
    .attr("src", "/static/images/NEGATIVE.png")
    .attr("width", width)
    .attr("heght", heght);
} else if (textValueTextBlog == "positive") {
  imgs
    .attr("src", "/static/images/POSITIVE.png")
    .attr("width", width)
    .attr("heght", heght);
} else {
  imgs
    .attr("src", "/static/images/NEUTRAL.png")
    .attr("width", width)
    .attr("heght", heght);
}

var textValueModule = d3.selectAll("#textValueHuman").text();
var imgsModule = d3.selectAll("#smileFaceHuman");

if (textValueModule == "0") {
  imgsModule
    .attr("src", "/static/images/NEGATIVE.png")
    .attr("width", width)
    .attr("heght", heght);
} else if (textValueModule == "1") {
  imgsModule
    .attr("src", "/static/images/POSITIVE.png")
    .attr("width", width)
    .attr("heght", heght);
}

var textValueModel = d3.selectAll("#textValueModel").text();
var imgsModel = d3.selectAll("#smileFaceModel");

if (textValueModel == "0") {
  imgsModel
    .attr("src", "/static/images/NEGATIVE.png")
    .attr("width", width)
    .attr("heght", heght);
} else if (textValueModel == "1") {
  imgsModel
    .attr("src", "/static/images/POSITIVE.png")
    .attr("width", width)
    .attr("heght", heght);
}
var textValuePolitic = d3.selectAll("#textValuePolitic").text();
var imgsPolitic = d3.selectAll("#smileFacePolitic");

if (textValuePolitic == "negative") {
  imgsPolitic
    .attr("src", "/static/images/THUMBS_UP.png")
    .attr("width", width)
    .attr("heght", heght);
} else if (textValuePolitic == "positive") {
  imgsPolitic
    .attr("src", "/static/images/THUMBS_DOWN.png")
    .attr("width", width)
    .attr("heght", heght);
}
