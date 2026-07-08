window.addEventListener("load", function(){
  setTimeout(function(){
    const right = document.querySelector(".right");
    if(!right) return;

    let score = document.getElementById("scoreboard2");
    if(!score){
      score = document.createElement("div");
      score.id = "scoreboard2";
      score.className = "card";
      right.insertBefore(score, right.firstChild);
    }

    let players = document.getElementById("players2");
    if(!players){
      players = document.createElement("div");
      players.id = "players2";
      players.className = "card";
      right.insertBefore(players, right.children[1]);
    }

    if(typeof updateScoreboard2 === "function") updateScoreboard2();
    if(typeof renderPlayers2 === "function") renderPlayers2();
  }, 500);
});