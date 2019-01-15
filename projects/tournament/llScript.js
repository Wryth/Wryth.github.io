
$(document).ready(function() {
    console.log("ready!");
    //var data = $.csv.toObjects(csv);
    //console.log(data);
    
    trigModal();
});

// Triggers the settings option Modal.
function trigModal(){
  document.getElementById("myModal").style.display = "block";
}

// initiates tournament setup.
function hideModal(){
  var playersList = convertText();
  playerObjectList = createPlayerList(playersList);
  console.log(playerObjectList);
  setup(playerObjectList);
  document.getElementById("myModal").style.display = "none";
}

// Creates an array of the user input players.
function convertText(){
  var newPlayers = document.getElementById("playerText").value;
  var playersList = newPlayers.split(",");
  console.log(playersList);
  return playersList;
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
    document.getElementById(id).style.position = "absolute";
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
  document.getElementById("box").innerHTML = html;
}

// creates html elements for each matchup.
function setMatches(numbPlayers,round,players){
  var html = "";
  for (var i = 0; i < numbPlayers; i++) {
    var playerName = "______";
    if (round == 0) {
      playerName = players[i].name;
    };
    html = html + "<div id=" + round + "m" + i + i +"><input type=text id=" + round + "m" + i + 
    " oninput=progresser(this.id) value=\"0\" style=\"width:25%\" name=" + 
    playerName +"><span>" + playerName + "</span></input></div>";
  };
  return html;
}

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

// Moves a winning player to the next round.
function progress(id){
  var newId = id.split('m');
  var newSlot = findNext(parseInt(newId[1]));
  var nextRound = parseInt(newId[0]) + 1;
  var nextId = nextRound + "m" + newSlot;
  var winner = document.getElementById(id);
  document.getElementById(nextId).innerHTML = winner.innerHTML;
  var loser = loserId(id);
  var lId = moveLoser(loser);
  var ll = document.getElementById(loser);
  document.getElementById(lId).innerHTML = ll.innerHTML;
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
  //size = players.length;
  depth = 1;
  while (size/2 % 2 == 0) {
    size = size/2;
    depth = depth + 1;
  }
  return depth;
}

// Player object generator. #TODO add id field?
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
  var playerList = players.map(x => new Player(x,undefined,undefined,undefined,false));
  return playerList;
}

//----------- work in progress -------------- file conversion.
