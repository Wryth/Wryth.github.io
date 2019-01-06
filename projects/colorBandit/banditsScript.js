
$(document).ready(function() {
    console.log("ready!");
    select();
});

var w = new Array(1,1,1);
var l = new Array(1,1,1);
var id = "";

//Return the index of the maximum value.
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        } else if (arr[i] == max) { //break tie
            coin = [i, maxIndex]
            rand = Math.floor(Math.random() * Math.floor(coin.length));
            maxIndex = coin[rand];
        }
    }
    return maxIndex;
}

function betaSampler(wlist,llist){
  var samples = wlist.map(
    function(x,i){
      return(jStat.beta.sample(x,llist[i]))
    }
  );
  return samples;
}

function tsampler(wlist,llist) {
  return indexOfMax(betaSampler(wlist,llist));
}

function success() {
    var index = id;
    w[index] = w[index] + 1;
    select();
}

function fail() {
  var index = id;
  l[index] = l[index] + 1;
  select();
}

//Select the prime rgb color.
function select() {
  var rgbs = betaColors(w,l);
  id = indexOfMax(rgbs);
  document.body.style.backgroundColor = "rgb(" + rgbs[0] + "," + rgbs[1] + "," + rgbs[2] + ")";
  document.getElementById("currentColor").innerText = "rgb(" + rgbs[0] + "," + rgbs[1] + "," + rgbs[2] + ")"
}

//Generates rbs colors out of a Beta sample.
function betaColors(wlist,llist){
  var betas = betaSampler(wlist,llist);
  var rgbs = betas.map(x => Math.floor(x*250));
  console.log(rgbs[0] + " " + rgbs[1] + " " + rgbs[2]);
  return rgbs;
}
