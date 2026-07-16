let selectedPlayer2 = "";
let selectedPlayerTeam2 = "";

let teamPlayers2 = {
    A: [],
    B: []
};


// A팀 또는 B팀 선수 추가
function addPlayer2(team) {
    const inputId = team === "A" ? "newPlayerA2" : "newPlayerB2";
    const input = document.getElementById(inputId);

    if (!input) return;

    const name = input.value.trim();

    if (!name) {
        alert("선수 이름을 입력해줘용!");
        return;
    }

    if (!teamPlayers2[team].includes(name)) {
        teamPlayers2[team].push(name);
    }

// 기존 기록 시스템에 선수 생성
if (typeof makePlayer === "function") {
    makePlayer(name);

    if (players[name]) {
        players[name].team = team;
    }
}

// 추가한 선수를 바로 선택
selectedPlayer2 = name;
selectedPlayerTeam2 = team;

const playerInput = document.getElementById("player");

if (playerInput) {
    playerInput.value = name;
}
    input.value = "";
    renderPlayers2();
}


// 선수 선택
function selectPlayer2(name, team) {
    selectedPlayer2 = name;
    selectedPlayerTeam2 = team;

    const playerInput = document.getElementById("player");

    if (playerInput) {
        playerInput.value = name;
    }

    renderPlayers2();
}


// A팀과 B팀을 동시에 표시
function renderPlayers2() {
    const box = document.getElementById("players2");
    if (!box) return;

    box.innerHTML = `
        <h2>👥 선수 버튼</h2>

        <div class="team-player-columns">

            <div class="team-player-box team-a-box">
                <h3>🔵 A팀 선수</h3>

                <div class="team-player-add">
                    <input
                        id="newPlayerA2"
                        placeholder="A팀 선수 이름"
                    >

                    <button onclick="addPlayer2('A')">
                        A팀 추가
                    </button>
                </div>

                <div
                    id="playerBtnListA2"
                    class="player-button-list"
                ></div>
            </div>


            <div class="team-player-box team-b-box">
                <h3>🔴 B팀 선수</h3>

                <div class="team-player-add">
                    <input
                        id="newPlayerB2"
                        placeholder="B팀 선수 이름"
                    >

                    <button onclick="addPlayer2('B')">
                        B팀 추가
                    </button>
                </div>

                <div
                    id="playerBtnListB2"
                    class="player-button-list"
                ></div>
            </div>

        </div>

        <div class="selected-player-info">
            ${
                selectedPlayer2
                    ? `✅ 현재 선택: ${
                        selectedPlayerTeam2 === "A" ? "🔵 A팀" : "🔴 B팀"
                    } ${selectedPlayer2}`
                    : "선수를 선택해줘용."
            }
        </div>
    `;

    renderTeamPlayerButtons2("A");
    renderTeamPlayerButtons2("B");
}


// 팀별 선수 버튼 생성
function renderTeamPlayerButtons2(team) {
    const listId =
        team === "A"
            ? "playerBtnListA2"
            : "playerBtnListB2";

    const list = document.getElementById(listId);
    if (!list) return;

    list.innerHTML = "";

    teamPlayers2[team].forEach(function (name) {
        const btn = document.createElement("button");

        const isSelected =
            selectedPlayer2 === name &&
            selectedPlayerTeam2 === team;

        btn.textContent = isSelected
            ? "✅ " + name
            : name;

        btn.className =
            team === "A"
                ? "team-a-player-btn"
                : "team-b-player-btn";

        if (isSelected) {
            btn.classList.add("selected-player-btn");
        }

        btn.onclick = function () {
            selectPlayer2(name, team);
        };

        list.appendChild(btn);
    });
}


// 페이지가 열리면 선수 화면 표시
window.addEventListener("load", function () {
    renderPlayers2();
});


// 기존 record 함수 보관
const oldRecord2 = window.record;


// 기록 버튼을 누르면 선택 선수 이름 자동 입력
window.record = function (type) {
    const playerInput = document.getElementById("player");

    if (!selectedPlayer2) {
        alert("먼저 A팀 또는 B팀 선수를 선택해줘용!");
        return;
    }

    if (playerInput) {
        playerInput.value = selectedPlayer2;
    }

    if (typeof oldRecord2 === "function") {
        oldRecord2(type);
    }
};