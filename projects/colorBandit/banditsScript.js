$(document).ready(function() {
    console.log("ready!");
    banditNameSpace.select();
});

banditNameSpace = function(){

// private variables.
var wins = new Array(1,1,1);
var loss = new Array(1,1,1);
var bSample = [0,0,0];
var bMean = [0,0,0];
var palette = [];

function betaMean(wlist,llist) {
  var meanColor = wlist.map(
    function(x,i){
      return(jStat.beta.mean(x,llist[i]))
    }
  );
  return meanColor;
}

// draws a random beta samples.
function betaSampler(wlist,llist){
  var samples = wlist.map(
    function(x,i){
      return(jStat.beta.sample(x,llist[i]))
    }
  );
  return samples;
}

// move distribution mean towards sample.
function success() {
    wins = wins.map((x, i) => x + praisAndBlame(bMean,bSample)[i]);
    loss = loss.map((x, i) => x + praisAndBlame(bSample,bMean)[i]);
    select();
}

// move distribution mean away from sample.
function fail() {
  loss = loss.map((x, i) => x + praisAndBlame(bMean,bSample)[i]);
  wins = wins.map((x, i) => x + praisAndBlame(bSample,bMean)[i]);
  select();
}

//Generate the next color.
function select() {
  bSample = betaSampler(wins,loss);
  bMean = betaMean(wins,loss);
  var meanrgbs = bMean.map(x => Math.floor(x*250));
  var rgbs = bSample.map(x => Math.floor(x*250));
  setColors(meanrgbs, rgbs);
}

// Applies selected colors to the DOM.
function setColors(meanrgbs, rgbs) {
  document.getElementById("colorBox").style.backgroundColor = "rgb(" + rgbs[0] + "," + rgbs[1] + "," + rgbs[2] + ")";
  document.getElementById("sampleColor").innerText = "Sample Color: rgb(" + rgbs[0] + "," + rgbs[1] + "," + rgbs[2] + ")";
  document.getElementById("meanColor").innerText = "Mean Color: rgb(" + meanrgbs[0] + "," + meanrgbs[1] + "," + meanrgbs[2] + ")";
}

// reward or punish depending on the relationship mean has to sample.
function praisAndBlame(mean,sample) {
  var reward = sample.map(function(x,i) {
    var value = 0;
    if (x > mean[i]) {
      value = 1;
    }
    return value;
  });
  return reward;
}

// Returns true if arr has the same color as any saved palette color.
function colorIsEqual(arr) {
  var result = false;
  for (let n = 0; n < palette.length; n++) {
    var equalCount = 0;
    for (let i = 0; i < palette[n].length; i++) {
      if (palette[n][i] === arr[i]) {
        equalCount = equalCount + 1;
      }
    }
    if (equalCount === 3) {
      result = true;  
      break;  
    }
  }
  return result;
}

// move the current collor to the pallet.
function saveColor() {
  var rgbColor = bSample.map(x => Math.floor(x*250));
  if (!colorIsEqual(rgbColor)) {
    palette.push(rgbColor);
  };
  console.log(palette);
  showPalette();
}

// add each pallet color to an html associated element.
function showPalette(){
  for (let i = 0; i < palette.length; i++) {
    let id = "palettePos" + i;
    document.getElementById(id).style.backgroundColor = "rgb(" + palette[i][0] + "," + palette[i][1] + "," + palette[i][2] + ")";
    //document.getElementById(id).innerText = "rgb(" + palette[i][0] + "," + palette[i][1] + "," + palette[i][2] + ")"; // Text does not scale right yet.
  }
}

//reset beta distributions.
function resetBeta() {
  wins = [1,1,1];
  loss = [1,1,1];
  select();
}

// EventListeners
window.onload = function (){

  document.getElementById("likeButton").addEventListener("click", success);
  document.getElementById("nopeButton").addEventListener("click", fail);
  document.getElementById("superButton").addEventListener("click", saveColor);
  document.getElementById("resetButton").addEventListener("click", resetBeta);

  document.getElementById("infoButton").addEventListener("click", (function () {alert("Use the Like and Nope button to find a color you like. \nYou can save a color to your palette by clicking the save button. \nThe reset button restarts the color selection path.")}));
  
  document.getElementById("exportPaletteButton").addEventListener("click", (function() {alert("" +
    document.getElementById("palettePos0").style.backgroundColor + "\n" +
    document.getElementById("palettePos1").style.backgroundColor + "\n" +
    document.getElementById("palettePos2").style.backgroundColor + "\n" +
    document.getElementById("palettePos3").style.backgroundColor + "\n" +
    document.getElementById("palettePos4").style.backgroundColor + "");
  }));
  };

return{
  select:select,
  success:success,
  fail:fail,
  saveColor:saveColor,
  resetBeta:resetBeta

}
}();
