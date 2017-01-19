var ball = { x : 0, y : 0, width: 20, height: 20, speed_x : 0, speed_y : 0, display : null };
var player1 = { score: 0, x : 0, y : 0, width: 20, height: 140, display: null };
var player2 = { score: 0, x : 0, y : 0, width: 20, height: 140, display: null };
var wall1 = { x : 0, y : 0, width: 1000, height : 20, display: null };
var wall2 = { x : 0, y : 0, width: 1000, height : 20, display: null };

var to_play = 1;
var speed = 5;
var launched = 0;
var keys = { e : false, d : false, o : false, l : false };


var init_ball = function () {
    /* A COMPLÉTER */
    ball.x = 120;
    ball.y = 290;
    ball.display = document.getElementById("ball");
}

var init_players = function () {
  player1.x = 80;
  player1.y = 230;
  player1.display = document.getElementById("player1");
  player2.x = 900;
  player2.y = 230;
  player2.display = document.getElementById("player2");
}

var init_walls = function () {
  wall1.x = 0;
  wall1.y = 0;
  wall1.display = document.getElementById("wall1");
  wall2.x = 0;
  wall2.y = 580;
  wall2.display = document.getElementById("wall2");
}

var draw = function (o) {
  o.display.style.width = o.width + "px";
  o.display.style.height = o.height + "px";
  o.display.style.left = o.x + "px";
  o.display.style.top = o.y + "px";
}

var keypressedDown = function (e) {
  /*console.log(e); */
  switch (e.key) {
    case "e":
      keys.e = true;
      keys.d = false;
      break;    
    case "d":
      keys.d = true;
      keys.e = false;
      break;
    case "o":
      keys.o = true;
      key.l = false;
      break; 
    case "l":
      keys.l = true;
      kays.o = false;
      break;
    case "h":
      launch ();
  }
}

var keypressedUp = function (e) {
  /*console.log(e); */
  switch (e.key) {
    case "e":
      keys.e = false;
      break;    
    case "d":
      keys.d = false;
      break;
    case "o":
      keys.o = false;
      break; 
    case "l":
      keys.l = false;
      break;
    case "h":
      launch ();
  }
}

var move_players = function () {
  if (keys.e) {player1.y = Math.max(20, player1.y - 10)}
  if (keys.d) {player1.y = Math.min(600-20-player1.height, player1.y + 10)}
  if (keys.o) {player2.y = Math.max(20, player2.y - 10)}
  if (keys.l) {player2.y = Math.min(600-20-player2.height, player2.y + 10)}
}

var update_score = function () {
  div_score = document.getElementById("score");
  div_score.innerHTML = "<p>" + player1.score + ":" + player2.score + "</p>";
}

var start_position = function () {
  ball.y = 290;
  if (to_play == 1) {
    ball.x = 120
  } else { ball.x = 860}
}

var launch = function () {
  var angle = Math.random()*Math.PI*2/3 - Math.PI/3; 
  ball.speed_x = speed*Math.cos(angle);
  ball.speed_y = speed*Math.sin(angle);
  if (to_play == 2) {ball.speed_x = - ball.speed_x}
}

var update = function () {
  switch (update_ball ()) {
    case 1: 
      ball.speed_x = 0;
      ball.speed_y = 0;
      init_players ();
      player1.score = player1.score + 1;
      update_score();
      to_play = 2;
      start_position();
      launched = 0;
      break;
    case 2:
      ball.speed_x = 0;
      ball.speed_y = 0;
      init_players ();
      player2.score = player2.score + 1;
      update_score();
      to_play = 1;
      start_position();
      launched = 0;
      break;
  }
  draw (ball);
  draw (player1);
  draw (player2);
}

var update_ball = function () {
  ball.x = ball.x+ball.speed_x;
  ball.y = ball.y+ball.speed_y;
  var xc = ball.x + ball.width / 2;
  var yc = ball.y + ball.height / 2;
  
  if ((yc <= 20 ) || (yc >= 600 - 20)) {ball.speed_y = - ball.speed_y}
  if (xc <= player1.x + player1.width) {
    if ((yc >= player1.y ) && (yc <= player1.y + player1.height)) {ball.speed_x = -ball.speed_x} else {return 2}
  }  
  if (xc >= player2.x) {
    if ((yc >= player2.y ) && (yc <= player2.y + player2.height)) {ball.speed_x = -ball.speed_x} else {return 1}
  } 
  return 0;
}

/* A COMPLÉTER */
init_ball ();
init_players ();
init_walls ();
update();
draw (wall1);
draw (wall2);

setInterval(update, 1000/60);
setInterval(move_players, 1000/20);
document.addEventListener("keydown", keypressedDown);
document.addEventListener("keyup", keypressedUp);