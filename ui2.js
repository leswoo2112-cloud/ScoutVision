function makeUI2(){
  const right = document.querySelector(".right");
  if(!right) return;

  if(!document.getElementById("scoreboard2")){
    const score = document.createElement("div");
    score.id = "scoreboard2";
    score.className = "card";
    right.prepend(score);
  }

  if(!document.getElementById("players2")){
    const players = document.createElement("div");
    players.id = "players2";
    players.className = "card";

    const team = document.getElementById("team");
    if(team && team.parentNode){
      team.parentNode.insertBefore(players, team.nextSibling);
    } else {
      right.prepend(players);
    }
  }

  updateScoreboard2();
  renderPlayers2();
}

window.addEventListener("load", function(){
  makeUI2();

  const oldRecord = window.record;

  window.record = function(type){
    const teamBox = document.getElementById("team");
    const team = teamBox ? teamBox.value : "A";

    if(type === "2P 성공") addScore(team, 2);
    if(type === "3P 성공") addScore(team, 3);
    if(type === "FT 성공") addScore(team, 1);
    if(type === "파울") addFoul(team);

    oldRecord(type);
  };
});