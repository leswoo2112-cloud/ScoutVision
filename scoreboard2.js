let game2 = {
  scoreA: 0,
  scoreB: 0,
  quarter: 1,
  foulA: 0,
  foulB: 0
};

function addScore(team, point){
  if(team === "A") game2.scoreA += point;
  if(team === "B") game2.scoreB += point;
  updateScoreboard2();
}

function addFoul(team){
  if(team === "A") game2.foulA++;
  if(team === "B") game2.foulB++;
  updateScoreboard2();
}

function nextQuarter2(){
  if(game2.quarter < 4) game2.quarter++;
  updateScoreboard2();
}

function resetScoreboard2(){
  game2 = { scoreA:0, scoreB:0, quarter:1, foulA:0, foulB:0 };
  updateScoreboard2();
}

function updateScoreboard2(){
  const box = document.getElementById("scoreboard2");
  if(!box) return;

  box.innerHTML = `
    <h2>🏀 2.0 점수판</h2>
    <div class="scoreRow">
      <div>🔵 A팀 <b>${game2.scoreA}</b><br>파울 ${game2.foulA}</div>
      <div><b>${game2.quarter}Q</b><br><button onclick="nextQuarter2()">쿼터 +</button></div>
      <div>🔴 B팀 <b>${game2.scoreB}</b><br>파울 ${game2.foulB}</div>
    </div>
    <button onclick="resetScoreboard2()">점수판 초기화</button>
  `;
}
window.addEventListener("load", function(){
  updateScoreboard2();
});