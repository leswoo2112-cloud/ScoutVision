let selectedPlayer2 = "";

let teamPlayers2 = {
  A: [],
  B: []
};

function addPlayer2(){
  const teamBox = document.getElementById("team");
  const input = document.getElementById("newPlayer2");

  const team = teamBox ? teamBox.value : "A";
  const name = input.value.trim();

  if(!name){
    alert("선수 이름 입력!");
    return;
  }

  if(!teamPlayers2[team].includes(name)){
    teamPlayers2[team].push(name);
  }

  input.value = "";
  renderPlayers2();
}

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

  box.innerHTML = `
    <h2>👥 선수 버튼</h2>
    <p>${team === "A" ? "🔵 A팀" : "🔴 B팀"} 선수 입력</p>
    <input id="newPlayer2" placeholder="선수 이름 추가">
    <button onclick="addPlayer2()">추가</button>
    <div id="playerBtnList2"></div>
  `;

  const list = document.getElementById("playerBtnList2");

  teamPlayers2[team].forEach(function(name){
    const btn = document.createElement("button");
    btn.textContent = name === selectedPlayer2 ? "✅ " + name : name;
    btn.onclick = function(){
      selectPlayer2(name);
    };
    list.appendChild(btn);
  });
}

window.addEventListener("load", function(){
  renderPlayers2();
});