
// Declare the data variable
const bubbledata = '/json';

// Using d3, fetch the JSON data
d3.json(bubbledata).then((bubbledata) => {
  // console.log(bubbledata)

  bubbledata.sort((a, b) => (a.Studio > b.Studio) * 2 - 1)
  // console.log(bubbledata)

  // CREATE LISTOF ALL STUDIOS


  var Bubblelist = []
  for (var i = 0; i < bubbledata.length; i++) {
    var Studio = bubbledata[i]["Studio"];
    // console.log(Studio);
    Bubblelist.push(Studio);
    // var data = bubbledata[i]['Studio'];
  }
  // console.log(Bubblelist);
  var studios = new Set(Bubblelist);
  // console.log(studios);
  // Loop through studio to find movies & gross

  var studiodata = [];
  var currentStudios = [];
  var studioList = Array.from(studios);

  var finalBubbleData = [];
  for (var i = 0; i < studioList.length; i++) {
    currentStudios = bubbledata.filter((b) => b["Studio"] === studioList[i]);
    currentStudios = currentStudios.map((s) => {
      return {
        "name": s["Title"],
        "value": s["Total Gross"]
      }
    });

    finalBubbleData.push({
      "name": studioList[i],
      "children": currentStudios
    });
  }
  // console.log(finalBubbleData);

  // <!-- Chart code -->
  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);

    var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())
    console.log(finalBubbleData);
    networkSeries.data = finalBubbleData;

    networkSeries.dataFields.linkWith = "linkWith";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.children = "children";
    networkSeries.links.template.distance = 1;
    networkSeries.nodes.template.tooltipText = "{name}: Gross Earnings: $ {value} ";
    networkSeries.nodes.template.fillOpacity = 1;
    networkSeries.nodes.template.outerCircle.scale = 1;

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 8;
    networkSeries.nodes.template.label.hideOversized = true;
    networkSeries.nodes.template.label.truncate = false;
    networkSeries.minRadius = am4core.percent(2.5);
    networkSeries.manyBodyStrength = -5;
    networkSeries.links.template.strokeOpacity = 0;

  }); // end am4core.ready()

});
