var dataJson;
console.log("pass");
d3.selectAll("#menuOpt").on("change", getValue);

//call flask api
function getValue() {
  console.log("pass");
  var valueSelect = d3.select("#menuOpt").node().value;
  if (valueSelect == "Labeled") {
    dataJson = "/label";
    // Using d3, fetch the JSON data
    d3.json(dataJson).then(dataJson => {
      console.log(dataJson);
      plotLabeled(dataJson);
    });
  } else if (valueSelect == "Compare") {
    dataJson = "/label";
    // Using d3, fetch the JSON data
    d3.json(dataJson).then(dataJson => {
      console.log(dataJson);
      plotCompare(dataJson);
    });
  } else if (valueSelect == "Machine") {
    dataJson = "/twitter";
    // Using d3, fetch the JSON data
    d3.json(dataJson).then(dataJson => {
      console.log(dataJson);
      plotMahcine(dataJson);
    });
  }
}

function plotCompare(data) {
  var Ytextblog = [];
  var positive = 0;
  var negative = 0;
  var neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.textblob))];

  //first treatment (textblob)
  for (var i = 0; i < data.length; i++) {
    if (data[i].textblob == "neutral") neutral += 1;
    else if (data[i].textblob == "negative") negative += 1;
    else positive += 1;
  }

  Ytextblog.push(neutral);
  Ytextblog.push(positive);
  Ytextblog.push(negative);
  //   console.log(Xtextblog);
  //   console.log(Ytextblog);

  var trace1 = {
    x: Xtextblog,
    y: Ytextblog,
    type: "bar",
    // text: "TextBlob",
    name: "TextBlob"
  };

  Ytextblog = [];
  positive = 0;
  negative = 0;
  neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.module_sent_an))];

  //first treatment (human label)
  for (var i = 0; i < data.length; i++) {
    if (data[i].module_sent_an == "0") positive += 1;
    else if (data[i].module_sent_an == "1") negative += 1;
  }
  for (var i = 0; i < Xtextblog.length; i++) {
    if (Xtextblog[i] == "0") Xtextblog[i] = "negative";
    else Xtextblog[i] = "positive";
  }

  Ytextblog.push(positive);
  Ytextblog.push(negative);

  var trace2 = {
    x: Xtextblog,
    y: Ytextblog,
    type: "bar",
    // text: "Labeled by Human",
    name: "Labeled by Human"
  };
  var data2 = [trace1, trace2];
  var layout = {
    title:
      "Compare Machine Learning vs Human Analysis<br>Total: " + data.length,
    xaxis: { title: "Type of Sentiment" },
    yaxis: { title: "Number of Twitter (messages)" }
  };
  Plotly.newPlot("plot", data2, layout);
}

function plotLabeled(data) {
  var Ytextblog = [];
  var positive = 0;
  var negative = 0;

  Ytextblog = [];
  positive = 0;
  negative = 0;
  neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.module_sent_an))];

  //first treatment (human label)
  for (var i = 0; i < data.length; i++) {
    if (data[i].module_sent_an == "0") positive += 1;
    else if (data[i].module_sent_an == "1") negative += 1;
  }
  for (var i = 0; i < Xtextblog.length; i++) {
    if (Xtextblog[i] == "0") Xtextblog[i] = "negative";
    else Xtextblog[i] = "positive";
  }

  Ytextblog.push(positive);
  Ytextblog.push(negative);

  var trace1 = {
    x: Xtextblog,
    y: Ytextblog,
    type: "bar",
    // text: "Labeled by Human",
    name: "Total: " + data.length,
    showlegend: true
  };
  var data2 = [trace1];
  var layout = {
    title: "Labeled by Human (our group) <br>Total: " + data.length,
    xaxis: { title: "Type of Sentiment" },
    yaxis: { title: "Number of Twitter (messages)" }
  };
  Plotly.newPlot("plot", data2, layout);
}

function plotMahcine(data) {
  var Ytextblog = [];
  var positive = 0;
  var negative = 0;
  var neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.textblob))];

  //first treatment (textblob)
  for (var i = 0; i < data.length; i++) {
    if (data[i].textblob == "neutral") neutral += 1;
    else if (data[i].textblob == "negative") negative += 1;
    else positive += 1;
  }

  Ytextblog.push(neutral);
  Ytextblog.push(positive);
  Ytextblog.push(negative);
  //   console.log(Xtextblog);
  //   console.log(Ytextblog);

  var trace1 = {
    x: Xtextblog,
    y: Ytextblog,
    type: "bar",
    // text: "TextBlob",
    name: "TextBlob"
  };

  Ytextblog = [];
  positive = 0;
  negative = 0;
  neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.module_sent_an))];

  //first treatment (human label)
  for (var i = 0; i < data.length; i++) {
    if (data[i].module_sent_an == "0") positive += 1;
    else if (data[i].module_sent_an == "1") negative += 1;
  }
  for (var i = 0; i < Xtextblog.length; i++) {
    if (Xtextblog[i] == "0") Xtextblog[i] = "negative";
    else Xtextblog[i] = "positive";
  }

  Ytextblog.push(positive);
  Ytextblog.push(negative);

  var trace2 = {
    x: Xtextblog,
    y: Ytextblog,
    type: "bar",
    // text: "Labeled by Human",
    name: "Labeled by Human"
  };
  var data2 = [trace1, trace2];
  var layout = {
    title: "Machine Learning classification <br>Total: " + data.length,
    xaxis: { title: "Type of Sentiment" },
    yaxis: { title: "Number of Twitter (messages)" }
  };
  Plotly.newPlot("plot", data2, layout);
}
