let selectedPlayer2 = "";

let teamPlayers2 = {
  A: ["이은성", "선수2", "선수3", "선수4", "선수5"],
  B: ["상대1", "상대2", "상대3", "상대4", "상대5"]
};

function selectPlayer2(name){
  selectedPlayer2 = name;
  const input = document.getElementById("player");
  if(input) input.value = name;
  renderPlayers2();
}

function renderPlayers2(){
  const box = document.getElementById("players2");
  if(!box) return;

  const teamBox = document.getElementById("team");
  const team = teamBox ? teamBox.value : "A";

  box.innerHTML = "<h2>👥 선수 버튼</h2>";

  teamPlayers2[team].forEach(function(name){
    const btn = document.createElement("button");
    btn.textContent = name === selectedPlayer2 ? "✅ " + name : name;
    btn.onclick = function(){
      selectPlayer2(name);
    };
    box.appendChild(btn);
  });
}