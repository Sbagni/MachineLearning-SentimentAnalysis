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
  } else if (valueSelect == "initial") {
    d3.selectAll("#plot").html("");
  }
}

function plotCompare(data) {
  //---> TEXTBLOB
  var Ytextblog = [];
  var positive = 0;
  var negative = 0;
  var neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.textblob))];

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
  //---> HUMAN LABELED
  Ytextblog = [];
  positive = 0;
  negative = 0;
  neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.module_sent_an))];

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
  //---> MODULE SENTIMENTAL ANALYSIS
  Ytextblog = [];
  positive = 0;
  negative = 0;
  neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.model_sent_an))];

  for (var i = 0; i < data.length; i++) {
    if (data[i].model_sent_an == "0") positive += 1;
    else if (data[i].model_sent_an == "1") negative += 1;
  }
  for (var i = 0; i < Xtextblog.length; i++) {
    if (Xtextblog[i] == "0") Xtextblog[i] = "negative";
    else Xtextblog[i] = "positive";
  }

  Ytextblog.push(positive);
  Ytextblog.push(negative);

  var trace3 = {
    x: Xtextblog,
    y: Ytextblog,
    type: "bar",
    name: "Model - Sentimental"
  };
  var data2 = [trace1, trace2, trace3];
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
  //TEXTBLOB
  var Ytextblog = [];
  var positive = 0;
  var negative = 0;
  var neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.textblob))];

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
    name: "TextBlob"
  };
  //model SENTIMENT
  Ytextblog = [];
  positive = 0;
  negative = 0;
  neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.model_sent_an))];

  for (var i = 0; i < data.length; i++) {
    if (data[i].model_sent_an == "0") positive += 1;
    else if (data[i].model_sent_an == "1") negative += 1;
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
    name: "Model - Sentimental"
  };
  //POLITICAL MODEL
  Ytextblog = [];
  positive = 0;
  negative = 0;
  neutral = 0;
  //set unique values
  var Xtextblog = [...new Set(data.map(x => x.module_politics))];

  for (var i = 0; i < data.length; i++) {
    if (data[i].module_politics == "positive") positive += 1;
    else if (data[i].module_politics == "negative") negative += 1;
  }

  Ytextblog.push(positive);
  Ytextblog.push(negative);

  var trace3 = {
    x: Xtextblog,
    y: Ytextblog,
    type: "bar",
    name: "Model - Political"
  };

  var data2 = [trace1, trace2, trace3];

  var layout = {
    title: "Machine Learning classification <br>Total: " + data.length,
    xaxis: { title: "Type of Sentiment" },
    yaxis: { title: "Number of Twitter (messages)" }
  };
  Plotly.newPlot("plot", data2, layout);
}
