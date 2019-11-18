var dataJson = "/";
console.log("pass");
d3.selectAll("#menuOpt").on("change", getValue);

var selectOpt = d3.select("#smileFace");

d3.json(dataJson).then(dataJson => {
  console.log(dataJson);
  showFaceTextblob(dataJson);
});

function showFaceTextblob(dataValue) {
  if (dataValue.textblob == "positive") {
  }
}
