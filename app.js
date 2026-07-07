let records = [];
let players = {};

function loadVideo(e){
  let file = e.target.files[0];
  if(!file) return;
  video.src = URL.createObjectURL(file);
}

function timeText(t){
  let m = Math.floor(t / 60);
  let s = Math.floor(t % 60);
  return m + ":" + String(s).padStart(2, "0");
}

function makePlayer(name){
  if(!players[name]){
    players[name] = {
      pts:0, fgm:0, fga:0,
      threeM:0, threeA:0,
      ftm:0, fta:0,
      reb:0, ast:0, stl:0, blk:0, to:0
    };
  }
}

function record(type){
  let name = document.getElementById("player").value.trim();
  if(!name){
    alert("선수 이름 입력!");
    return;
  }

  makePlayer(name);
  let p = players[name];

  if(type === "2P 성공"){ p.pts += 2; p.fgm++; p.fga++; }
  if(type === "2P 실패"){ p.fga++; }
  if(type === "3P 성공"){ p.pts += 3; p.fgm++; p.fga++; p.threeM++; p.threeA++; }
  if(type === "3P 실패"){ p.fga++; p.threeA++; }
  if(type === "FT 성공"){ p.pts += 1; p.ftm++; p.fta++; }
  if(type === "FT 실패"){ p.fta++; }
  if(type === "리바운드"){ p.reb++; }
  if(type === "어시스트"){ p.ast++; }
  if(type === "스틸"){ p.stl++; }
  if(type === "블록"){ p.blk++; }
  if(type === "턴오버"){ p.to++; }

  let t = video.currentTime || 0;
  records.push({ name:name, type:type, time:t });

  draw();
}

function draw(){
  events.innerHTML = "";

  records.forEach(function(r){
    let div = document.createElement("div");
    div.textContent = timeText(r.time) + " | " + r.name + " | " + r.type;
    div.onclick = function(){
      video.currentTime = r.time;
      video.play();
    };
    events.appendChild(div);
  });

  stats.innerHTML = "";

  Object.entries(players).forEach(function(item){
    let name = item[0];
    let p = item[1];

    let fg = p.fga ? Math.round((p.fgm / p.fga) * 100) : 0;
    let three = p.threeA ? Math.round((p.threeM / p.threeA) * 100) : 0;
    let ft = p.fta ? Math.round((p.ftm / p.fta) * 100) : 0;

    let box = document.createElement("div");
    box.className = "stat";
    box.innerHTML =
      "<b>" + name + "</b><br>" +
      "득점 " + p.pts + "<br>" +
      "FG% " + fg + "%<br>" +
      "3P% " + three + "%<br>" +
      "FT% " + ft + "%<br>" +
      "REB " + p.reb + " AST " + p.ast + "<br>" +
      "STL " + p.stl + " BLK " + p.blk + " TO " + p.to;

    stats.appendChild(box);
  });

  makeAI();
}

function makeAI(){
  let text = "";

  Object.entries(players).forEach(function(item){
    let name = item[0];
    let p = item[1];

    let fg = p.fga ? Math.round((p.fgm / p.fga) * 100) : 0;

    if(p.pts >= 15) text += name + "은 득점력이 좋았습니다. ";
    if(fg >= 50 && p.fga >= 4) text += name + "은 슛 효율이 좋았습니다. ";
    if(p.to >= 3) text += name + "은 턴오버 관리가 필요합니다. ";
    if(p.ast >= 5) text += name + "은 패스 기여도가 높았습니다. ";
  });

  ai.textContent = text || "기록이 더 쌓이면 AI 분석이 나옵니다.";
}