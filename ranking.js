function updateRanking(){
  let rank = document.getElementById("ranking");
  if(!rank) return;

  let list = Object.entries(players).map(function(item){
    let name = item[0];
    let p = item[1];

    let score = p.pts + p.reb*1.2 + p.ast*1.5 + p.stl*2 + p.blk*2 - p.to;

    return { name:name, p:p, score:score };
  });

  list.sort(function(a,b){
    return b.score - a.score;
  });

  let html = "<h3>🏆 선수 순위</h3>";

  list.forEach(function(x, i){
    html +=
      (i+1) + "위 " + x.name +
      " | 점수 " + Math.round(x.score) +
      " | 득점 " + x.p.pts +
      " | 리바 " + x.p.reb +
      " | 어시 " + x.p.ast +
      "<br>";
  });

  rank.innerHTML = html || "아직 기록 없음";
}
function updateRanking() {
    const box = document.getElementById("teamStats");
    if (!box) return;

    let list = Object.entries(players).map(([name, p]) => ({
        name,
        score: p.pts + p.reb + p.ast + p.stl + p.blk - p.to
    }));

    list.sort((a, b) => b.score - a.score);

    let html = "<h3>🏆 선수 랭킹</h3>";

    list.forEach((p, i) => {
        html += `${i + 1}. ${p.name} (${p.score})<br>`;
    });

    box.innerHTML += "<br>" + html;
}