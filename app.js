let records = [];
let players = {};

const video = document.getElementById("video");
const events = document.getElementById("events");
const stats = document.getElementById("stats");
const ai = document.getElementById("ai");

function loadVideo(e){
  const file = e.target.files[0];
  if(!file) return;
  video.src = URL.createObjectURL(file);
}

function timeText(t){
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
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
  const name = document.getElementById("player").value.trim();
  const teamBox = document.getElementById("team");
  const team = teamBox ? teamBox.value : "A";

  if(!name){
    alert("선수 이름 입력!");
    return;
  }

  makePlayer(name);
  const p = players[name];

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

  const t = video ? (video.currentTime || 0) : 0;

  records.push({
    team: team,
    name: name,
    type: type,
    time: t
  });

  draw();
}

function draw(){
  if(events){
    events.innerHTML = "";
    records.forEach(function(r){
      const div = document.createElement("div");
      div.textContent = timeText(r.time) + " | " + r.name + " | " + r.type;
      div.onclick = function(){
        if(video){
          video.currentTime = r.time;
          video.play();
        }
      };
      events.appendChild(div);
    });
  }

  if(stats){
    stats.innerHTML = "";

    Object.entries(players).forEach(function(item){
      const name = item[0];
      const p = item[1];

      const fg = p.fga ? Math.round((p.fgm / p.fga) * 100) : 0;
      const three = p.threeA ? Math.round((p.threeM / p.threeA) * 100) : 0;
      const ft = p.fta ? Math.round((p.ftm / p.fta) * 100) : 0;

      const box = document.createElement("div");
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
  }

  makeAI();

  if(typeof updateTeamStats === "function") updateTeamStats();
  if(typeof updateMVP === "function") updateMVP();
  if(typeof updateShotChart === "function") updateShotChart();
  if(typeof updateRanking === "function") updateRanking();
  if(typeof updateHeatMap === "function") updateHeatMap();
  if(typeof updateReport === "function") updateReport();
  if(typeof updateReport2 === "function") updateReport2();
}

function makeAI(){
  if(!ai) return;

  let text = "";

  Object.entries(players).forEach(function(item){
    const name = item[0];
    const p = item[1];

    const fg = p.fga ? Math.round((p.fgm / p.fga) * 100) : 0;

    if(p.pts >= 15) text += name + "은 득점력이 좋았습니다. ";
    if(fg >= 50 && p.fga >= 4) text += name + "은 슛 효율이 좋았습니다. ";
    if(p.to >= 3) text += name + "은 턴오버 관리가 필요합니다. ";
    if(p.ast >= 5) text += name + "은 패스 기여도가 높았습니다. ";
  });

  ai.textContent = text || "기록이 더 쌓이면 AI 분석이 나옵니다.";
}

function back5(){
  if(video) video.currentTime = Math.max(0, video.currentTime - 5);
}

function forward5(){
  if(video) video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
}

function playPause(){
  if(!video) return;
  if(video.paused) video.play();
  else video.pause();
}

function slow(){
  if(video) video.playbackRate = 0.5;
}

function normal(){
  if(video) video.playbackRate = 1;
}

function fast(){
  if(video) video.playbackRate = 2;
}

window.onload = function(){
  draw();
  if(typeof initCourt === "function") initCourt();
};