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
var shadesOfSample = [[0,0,0],[0,0,0],[0,0,0]];

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
  wins = wins.map((x, i) => x + praisAndBlame(bSample,bMean)[i]);
  loss = loss.map((x, i) => x + praisAndBlame(bMean,bSample)[i]);
  select();
}

//Generate the next color.
function select() {
  bSample = betaSampler(wins,loss);
  bMean = betaMean(wins,loss);
  shadesOfSample = generateShades([bSample,bSample,bSample,bSample,bSample],0.8,0.1);
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


//eventListener spesific Functions:

// move the current color to the palette.
function saveColor() {
  var rgbColor = betaToRgb(bSample);
  if (!colorIsEqual(rgbColor)) {
    palette.push(rgbColor);
  };
  console.log(palette);
  showPalette();
}

// add each palette color to an html associated element.
function showPalette(){
  for (let i = 0; i < palette.length; i++) {
    let id = "palettePos" + i;
    document.getElementById(id).style.backgroundColor = "rgb(" + palette[i][0] + "," + palette[i][1] + "," + palette[i][2] + ")";
  }
}

//reset beta distributions.
function resetBeta() {
  wins = [1,1,1];
  loss = [1,1,1];
  select();
}

// toggles the shadeBox visability.
function toggleShades() {
  var boxStyle = "none";
  if (document.getElementById("shadesBox").style.display === "none") {
    boxStyle = "block";
  }
  document.getElementById("shadesBox").style.display = boxStyle;
  setShades();
}

// generate sample color shades,
function setShades() {
  console.log(shadesOfSample);
  for (let i = 0; i < shadesOfSample.length; i++) {
    var shadeId = "shade" + i;
    var rgbs = betaToRgb(shadesOfSample[i]); 
    document.getElementById(shadeId).style.backgroundColor = "rgb(" + rgbs[0] + "," + rgbs[1] + "," + rgbs[2] + ")";
  }
}

//Close shades, and apply the pick as the new sample color.
function moveToSample(event) {
  var targetElement = event.target;
  var colorId = targetElement.id; // get current button.
  var idSplit = colorId.split("e"); // split by shad"e" [0-5]
  bSample = shadesOfSample[idSplit[1]]; // set new bSample.
  setColors(betaToRgb(bMean),betaToRgb(bSample));
  toggleShades();
}

//create shades of Beta
function shadesOfBeta(sample, prosentage) {
  var shade = sample.map(x => x * prosentage);
  return shade;
}

// create an increment of shades.(pr = start pr, incrementas are by how much each shade increases.)
function generateShades(shadesArr,pr,increments) {
  for (let i = 0; i < shadesArr.length; i++) {
    shadesArr[i] = shadesOfBeta(shadesArr[i],pr)
    pr = pr + increments;
  }
  return shadesArr;
}

// Converts the betasamples in to a rgb number.
function betaToRgb(betaArr) {
  return betaArr.map(x => Math.floor(x*250));
}

// Sets an eventlisner to the given class
function setClassEventListener(aclassname, atype, afunction) {
  var thisClass = document.getElementsByClassName(aclassname);
  for (var i = 0; i < thisClass.length; i++) {
    thisClass[i].addEventListener(atype, afunction, false);
  }
}

function exportPalette() {
  var alertString = "";
  for (let i = 0; i < palette.length; i++) {
    alertString = alertString + "rgb(" + palette[i] + ")\n";
  }
  alert(alertString);
}


// EventListeners
window.onload = function (){

  document.getElementById("likeButton").addEventListener("click", success);
  document.getElementById("nopeButton").addEventListener("click", fail);
  document.getElementById("superButton").addEventListener("click", saveColor);
  document.getElementById("resetButton").addEventListener("click", resetBeta);
  document.getElementById("shadeButton").addEventListener("click", toggleShades);
  setClassEventListener("shade", "click", moveToSample);


  document.getElementById("infoButton").addEventListener("click", (function () {alert("Use the Like and Nope button to find a color you like.\n" + 
    "You can save a color to your palette by clicking the save button.\n" +  
    "The reset button restarts the color selection path.")}));

  document.getElementById("exportPaletteButton").addEventListener("click", exportPalette);

  };

return{
  select:select,
  success:success,
  fail:fail,
  saveColor:saveColor,
  resetBeta:resetBeta,
  toggleShades:toggleShades,
  moveToSample:moveToSample,
  exportPalette:exportPalette,

}
}();
