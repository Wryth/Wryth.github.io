$(document).ready(function() {
    console.log("ready!");
    tournamentNameSpace.trigModal();
});

// Revealing module module pattern.
tournamentNameSpace = function(){

// Module variables
  var playerObjectList = [];
  var data = null;


// Triggers the settings option Modal.
function trigModal(){
  document.getElementById("settingsModal").style.display = "block";
}

// initiates tournament setup.
function hideModal(){
  var isChecked = document.getElementById("exampleCheckbox").checked;
  if (isChecked) {
    playerObjectList = setEightPlayers();
  } else {
    playerObjectList = createPlayerList(data);
  }
  setup(playerObjectList);
  document.getElementById("settingsModal").style.display = "none";
}

// Method that reads and processes the selected file
function upload(evt) {
  data = null; // Module variable, will be changed to a return value.
  var file = evt.target.files[0];
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(event) {
  var csvData = event.target.result;
    data = $.csv.toObjects(csvData);
    if (data && data.length > 0) {
      alert('Imported -' + data.length + '- rows successfully!');
      } else {
      alert('No data to import!');
      }
    reader.onerror = function() {
    alert('Unable to read ' + file.fileName);
    };
  };
}

// Creates the match and round html elements for a tournament.
function setup(players){
  setRounds(players);
  newStyle(players);
  setLoserRounds(players);
}

// Moves each round in a horizontal manner of 200px increments.
function newStyle(players){
  var rounds = findDepth(players.length) + 1;
  for (var i = 0; i < rounds; i++) {
    var id = "round" + i;
    var left = i * 200 + "px";
    document.getElementById(id).style.left = left;
    document.getElementById(id).style.position = "static";
    document.getElementById(id).style.float = "left";
  }
}

// creates html elements for each round.
function setRounds(players){
  var html = "";
  var rounds = findDepth(players.length) +1;
  var nMatches = players.length;
  for (var i = 0; i < rounds; i++) {
    html = html + "<div id=round" + i + ">";

    html = html + setMatches(nMatches,i,players) + "</div>";
    nMatches = nMatches/2;
  }
  document.getElementById("finals").innerHTML = html;
}

// creates html elements for each matchup.
function setMatches(numbPlayers,round,players){
  var html = "";
  for (var i = 0; i < numbPlayers; i++) {
    html = html + "<div id=" + round + "m" + i + i +">";
    if (numbPlayers == 1) {
      html = html + "<span id=" + round + "m" + i + ">Winner: </span><span>" + "____" + "</span>";
    } else {
      html = html + matchInput(round,i,players);
    }
    html = html + "</div>";
  };
  return html;
}

function matchInput(round,i,players){
  var playerName = "__"
  if (round == 0) {
    playerName = players[i].name;
  };
  var html = "<input type=number placeholder=0 class=throwValue id=" + round + "m" + i + 
  " oninput=tournamentNameSpace.progresser(this.id) name=" + 
  playerName +"><span>" + playerName + "</span></input>";
  return html;
}

// returns the id of the winner.
function selectLargest(firstId) {
  var first = document.getElementById(firstId).value;
  var secondId = loserId(firstId);
  var second = document.getElementById(secondId).value;
  var winner = secondId;
  if (first > second) {
    winner = firstId;
  } //add break tie coinflip or other method.
  return winner;
}


// Check value difference instead of button click. "one value input check if larger then loser slot"
function progresser(inId) {
  var id = selectLargest(inId);
  var newId = id.split('m');
  var newSlot = findNext(parseInt(newId[1]));
  var nextRound = parseInt(newId[0]) + 1;
  var nextId = nextRound + "m" + newSlot;
  var winner = document.getElementById(id);
  console.log(nextId);
  document.getElementById(nextId).name = winner.name;
  document.getElementById(nextId).nextSibling.innerHTML = winner.name;
  
  var loser = loserId(id);
  var lId = moveLoser(loser);
  var ll = document.getElementById(loser);
  console.log(lId);
  
  document.getElementById(lId).name = ll.name;
  document.getElementById(lId).nextSibling.innerHTML = ll.name;
  document.getElementById(lId).innerHTML = document.getElementById(loser).value;
}

// creates html elements for each loser bracket round.
function setLoserRounds(players){
  var html = "";
  var rounds = findDepth(players.length);
  var nMatches = players.length;
  for (var i = 0; i < rounds; i++) {
    nMatches = nMatches/2;
    html = html + setLoserSlots(nMatches,i);
  }
  document.getElementById("loserbracket").innerHTML = html;
}

// creates html elements for each matchup.
function setLoserSlots(numbPlayers,round){
  var html = "";
  var playerName = "______";
  for (var i = 0; i < numbPlayers; i++) {
    html = html + "<div id=" + round + "l" + i + i +"><span class=loserThrow id=" + round + "l" + i +"></span><span>" + playerName + "</span></div>";
  };
  return html;
}

// find the respective loserbracket slot
function moveLoser(loser){
  var loserSplit = loser.split("m");
  var lSlot = findNext(parseInt(loserSplit[1]));
  var lId = loserSplit[0] + "l" + lSlot;
  return lId;
}

// Find the id of the losing html element.
function loserId(htmlId){
  var id = htmlId.split("m");
  var other = 1; // call findNext() be used here?
  if (isOdd(parseInt(id[1])) == true) {
    other = -1;
  }
  var other = parseInt(id[1]) + other;
  otherId = id[0] + "m" + other;
  return otherId;
}

// Returns the new possition id of a winning player.
function findNext(id){
  var reduce = 0;
  if (isOdd(id)) {
    reduce = -1;
  }
  var newId = (id + reduce)/2;
  return newId;
}


function isOdd(num) {
  var result = false;
  if (num % 2 == 1) {
    result = true;
  }
  return result;
}

// Return the amount of times a list can be divided by 2.
function findDepth(size){
  depth = 1;
  while (size/2 % 2 == 0) {
    size = size/2;
    depth = depth + 1;
  }
  return depth;
}

// Player object generator. #TODO add id field? "prior rank"/"tournament rank"? Use tournament rank as a means in order to move setup endgame after qualifiers etc.
class Player {
  constructor(name,rank,recentThrow,longestThrow,lost){
    this.name = name;
    this.rank = rank;
    this.recentThrow = recentThrow;
    this.longestThrow = longestThrow;
    this.lost = lost;
  }
};

// Creates a list of object representing the contenders.
function createPlayerList(players){
  if (players === null) {
    alert("Please enter a csv file.")
  }
  var playerList = players.map(x => new Player(x["player"],parseInt(x["rank"]),undefined,undefined,false));
  return playerList;
}


function createExamplePlayers(size) {
  var players = [];
  for (let i = 0; i < size; i++) {
    var rank = i + 1;
    var fakePlayer = "p" + rank;
    players[i] = new Player(fakePlayer,rank,undefined,undefined,false);
  };
  return players;
}

function setEightPlayers() {
  var playersExample = createExamplePlayers(8);
  return playersExample;
}

//----------- work in progress -------------- file conversion.

return{
  trigModal:trigModal,
  hideModal:hideModal,
  progresser:progresser,
  upload:upload,
  setEightPlayers:setEightPlayers,
  //testInput11:testInput11,
}

}();

// Event listerners
window.onload = function (){
document.getElementById("settings").addEventListener("click", tournamentNameSpace.trigModal);
document.getElementById("hideModal").addEventListener("click", tournamentNameSpace.hideModal);

document.getElementById("input").addEventListener("change", tournamentNameSpace.upload, false);

};

test = function(){

function testInput11() {
  document.getElementById("0m10").value = 10;
  if (document.getElementById("1m5").name === "p11") {
    console.log("Test Passed");  
  } else {
    console.log("Test Failed");
  };
}

function testInputs(used,moved,realName) {
  document.getElementById(used).value = 10;
  if (document.getElementById(moved).name === realName) {
    console.log("Test Passed");  
  } else {
    console.log("Test Failed");
  };
}


return{
  testInputs:testInputs,
  testInput11:testInput11
}
}();