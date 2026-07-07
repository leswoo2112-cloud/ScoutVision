function saveData(){
  localStorage.setItem("scout_records", JSON.stringify(records));
  localStorage.setItem("scout_players", JSON.stringify(players));
  alert("기록 저장 완료!");
}

function loadData(){
  records = JSON.parse(localStorage.getItem("scout_records")) || [];
  players = JSON.parse(localStorage.getItem("scout_players")) || {};
  draw();
  alert("기록 불러오기 완료!");
}

function resetData(){
  if(confirm("기록을 전부 삭제할까요?")){
    records = [];
    players = {};
    draw();
    localStorage.removeItem("scout_records");
    localStorage.removeItem("scout_players");
  }
}