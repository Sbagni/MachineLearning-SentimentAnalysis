var dataJson;
console.log("pass");
d3.selectAll("#menuOpt").on("change", getValue);

//call flask api
function getValue() {
  console.log("pass");
  var valueSelect = d3.select("#menuOpt").node().value;
  if (valueSelect == "Labeled") {
    dataJson = "/twitter";
  }
  // Using d3, fetch the JSON data
  d3.json(dataJson).then(dataJson => {
    console.log(dataJson);
    //populateList(data);
  });
}
