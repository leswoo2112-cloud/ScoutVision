/* =========================================================
   ScoutVision 메인 시스템
   기록 · 선수 통계 · 타임라인 · 점수 흐름 · 실행 연결
========================================================= */

let records = [];
let players = {};

let scoreHistoryA = [0];
let scoreHistoryB = [0];


/* =========================================================
   기본 HTML 요소
========================================================= */

const video = document.getElementById("video");
const events = document.getElementById("events");
const stats = document.getElementById("stats");
const ai = document.getElementById("ai");


/* =========================================================
   안전하게 다른 기능 실행
========================================================= */

function safeCall(functionName) {
    const fn = window[functionName];

    if (typeof fn === "function") {
        try {
            fn();
        } catch (error) {
            console.error(functionName + " 실행 오류:", error);
        }
    }
}


/* =========================================================
   영상 불러오기
========================================================= */

function loadVideo(event) {
    const file = event.target.files[0];

    if (!file || !video) return;

    if (video.src) {
        URL.revokeObjectURL(video.src);
    }

    video.src = URL.createObjectURL(file);
    video.load();
}


/* =========================================================
   영상 시간 표시
========================================================= */

function timeText(time) {
    const safeTime = Number(time) || 0;

    const minute = Math.floor(safeTime / 60);
    const second = Math.floor(safeTime % 60);

    return (
        String(minute).padStart(2, "0") +
        ":" +
        String(second).padStart(2, "0")
    );
}


/* =========================================================
   선수 생성
========================================================= */

function makePlayer(name) {
    if (!name) return null;

    if (!players[name]) {
        players[name] = {
            name: name,
            team: "A",

            pts: 0,

            fgm: 0,
            fga: 0,

            threeM: 0,
            threeA: 0,

            ftm: 0,
            fta: 0,

            reb: 0,
            ast: 0,
            stl: 0,
            blk: 0,
            to: 0
        };
    }

    return players[name];
}


/* =========================================================
   현재 선택 선수와 팀 가져오기
========================================================= */

function getSelectedPlayerInfo() {
    const playerInput = document.getElementById("player");

    let name = "";

    if (
        typeof selectedPlayer2 !== "undefined" &&
        selectedPlayer2
    ) {
        name = selectedPlayer2;
    } else if (playerInput) {
        name = playerInput.value.trim();
    }

    let team = "A";

    if (
        typeof selectedPlayerTeam2 !== "undefined" &&
        selectedPlayerTeam2
    ) {
        team = selectedPlayerTeam2;
    } else if (
        name &&
        players[name] &&
        players[name].team
    ) {
        team = players[name].team;
    }

    return {
        name: name,
        team: team,
        playerInput: playerInput
    };
}


/* =========================================================
   기록하기
========================================================= */

function record(type) {
    const selected = getSelectedPlayerInfo();

    const name = selected.name;
    const team = selected.team;
    const playerInput = selected.playerInput;

    if (!name) {
        alert("먼저 A팀 또는 B팀 선수를 선택해주세요!");
        return;
    }

    const player = makePlayer(name);

    if (!player) {
        alert("선수 데이터를 만들 수 없습니다.");
        return;
    }

    player.team = team;

    switch (type) {
        case "2P 성공":
            player.pts += 2;
            player.fgm += 1;
            player.fga += 1;
            break;

        case "2P 실패":
            player.fga += 1;
            break;

        case "3P 성공":
            player.pts += 3;
            player.fgm += 1;
            player.fga += 1;
            player.threeM += 1;
            player.threeA += 1;
            break;

        case "3P 실패":
            player.fga += 1;
            player.threeA += 1;
            break;

        case "FT 성공":
            player.pts += 1;
            player.ftm += 1;
            player.fta += 1;
            break;

        case "FT 실패":
            player.fta += 1;
            break;

        case "리바운드":
            player.reb += 1;
            break;

        case "어시스트":
            player.ast += 1;
            break;

        case "스틸":
            player.stl += 1;
            break;

        case "블록":
            player.blk += 1;
            break;

        case "턴오버":
            player.to += 1;
            break;

        default:
            console.warn("알 수 없는 기록 종류:", type);
            return;
    }

    const currentTime =
        video && Number.isFinite(video.currentTime)
            ? video.currentTime
            : 0;

    records.push({
        team: team,
        name: name,
        type: type,
        time: currentTime
    });

    updateScoreHistory(team, type);

    if (playerInput) {
        playerInput.value = name;
    }

    drawScoreChart();
    draw();
}


/* =========================================================
   팀 점수 흐름 저장
========================================================= */

function updateScoreHistory(team, type) {
    const lastA =
        scoreHistoryA[scoreHistoryA.length - 1] || 0;

    const lastB =
        scoreHistoryB[scoreHistoryB.length - 1] || 0;

    let point = 0;

    if (type === "2P 성공") point = 2;
    if (type === "3P 성공") point = 3;
    if (type === "FT 성공") point = 1;

    if (point === 0) return;

    if (team === "B") {
        scoreHistoryA.push(lastA);
        scoreHistoryB.push(lastB + point);
    } else {
        scoreHistoryA.push(lastA + point);
        scoreHistoryB.push(lastB);
    }
}


/* =========================================================
   전체 화면 다시 그리기
========================================================= */

function draw() {
    drawTimeline();
    drawPlayerStats();
    makeAI();

    safeCall("updateTeamStats");
    safeCall("updateMVP");
    safeCall("updateShotChart");
    safeCall("updateRanking");
    safeCall("updateHeatMap");
    safeCall("updateReport2");

    safeCall("updateLeaderboard");
    safeCall("updateTeamCompare");
    safeCall("updateOVR");
    safeCall("updatePlayerType");
    safeCall("updateHotPlayer");
    safeCall("updateGrowth");

    safeCall("updateWinPrediction");
    safeCall("updateBestLineup");
    safeCall("updateCoachAI");
    safeCall("updateMVPCard");
    safeCall("updateSeasonStats");
    safeCall("updateMomentum");

    safeCall("updateLeagueStandings");
    safeCall("updateGameGrade");
    safeCall("updateTacticalAI");
    safeCall("updateZoneAnalysis");

    safeCall("updateScoreboard2");
}


/* =========================================================
   기록 타임라인
========================================================= */

function drawTimeline() {
    if (!events) return;

    events.innerHTML = "";

    if (records.length === 0) {
        events.innerHTML =
            '<div class="empty-message">아직 기록이 없습니다.</div>';

        return;
    }

    records.forEach(function (recordItem) {
        const item = document.createElement("div");

        item.className = "timeline-item";

        const teamIcon =
            recordItem.team === "B" ? "🔴" : "🔵";

        item.textContent =
            timeText(recordItem.time) +
            " | " +
            teamIcon +
            " " +
            recordItem.name +
            " | " +
            recordItem.type;

        item.onclick = function () {
            if (!video) return;

            video.currentTime = recordItem.time;
            video.play().catch(function () {});
        };

        events.appendChild(item);
    });
}


/* =========================================================
   선수 통계
========================================================= */

function drawPlayerStats() {
    if (!stats) return;

    stats.innerHTML = "";

    const playerEntries = Object.entries(players);

    if (playerEntries.length === 0) {
        stats.innerHTML =
            '<div class="empty-message">아직 선수 데이터가 없습니다.</div>';

        return;
    }

    playerEntries.forEach(function (entry) {
        const name = entry[0];
        const player = entry[1];

        const fg =
            player.fga > 0
                ? Math.round(
                    (player.fgm / player.fga) * 100
                )
                : 0;

        const three =
            player.threeA > 0
                ? Math.round(
                    (player.threeM / player.threeA) * 100
                )
                : 0;

        const ft =
            player.fta > 0
                ? Math.round(
                    (player.ftm / player.fta) * 100
                )
                : 0;

        const teamIcon =
            player.team === "B" ? "🔴" : "🔵";

        const box = document.createElement("div");

        box.className = "player-stat-card";

        box.innerHTML = `
            <h3>${teamIcon} ${name}</h3>

            <b>득점 ${player.pts}</b><br>

            FG ${player.fgm}/${player.fga}
            · ${fg}%<br>

            3P ${player.threeM}/${player.threeA}
            · ${three}%<br>

            FT ${player.ftm}/${player.fta}
            · ${ft}%<br>

            REB ${player.reb}
            · AST ${player.ast}<br>

            STL ${player.stl}
            · BLK ${player.blk}
            · TO ${player.to}
        `;

        stats.appendChild(box);
    });
}


/* =========================================================
   AI 한줄평
========================================================= */

function makeAI() {
    if (!ai) return;

    const playerEntries = Object.entries(players);

    if (playerEntries.length === 0) {
        ai.textContent = "아직 기록 없음";
        return;
    }

    const comments = [];

    playerEntries.forEach(function (entry) {
        const name = entry[0];
        const player = entry[1];

        const fg =
            player.fga > 0
                ? Math.round(
                    (player.fgm / player.fga) * 100
                )
                : 0;

        if (player.pts >= 15) {
            comments.push(
                name + "은 득점력이 좋았습니다."
            );
        }

        if (fg >= 50 && player.fga >= 4) {
            comments.push(
                name + "은 슛 효율이 좋았습니다."
            );
        }

        if (player.ast >= 5) {
            comments.push(
                name + "은 패스 기여도가 높았습니다."
            );
        }

        if (player.reb >= 5) {
            comments.push(
                name + "은 리바운드 기여도가 높았습니다."
            );
        }

        if (player.stl >= 3) {
            comments.push(
                name + "은 수비 압박이 좋았습니다."
            );
        }

        if (player.to >= 3) {
            comments.push(
                name + "은 턴오버 관리가 필요합니다."
            );
        }
    });

    ai.textContent =
        comments.length > 0
            ? comments.join(" ")
            : "기록이 더 쌓이면 AI 분석이 나옵니다.";
}


/* =========================================================
   영상 조작
========================================================= */

function back5() {
    if (!video) return;

    video.currentTime = Math.max(
        0,
        video.currentTime - 5
    );
}


function forward5() {
    if (!video) return;

    const maximum =
        Number.isFinite(video.duration)
            ? video.duration
            : video.currentTime + 5;

    video.currentTime = Math.min(
        maximum,
        video.currentTime + 5
    );
}


function playPause() {
    if (!video) return;

    if (video.paused) {
        video.play().catch(function () {});
    } else {
        video.pause();
    }
}


function slow() {
    if (video) {
        video.playbackRate = 0.5;
    }
}


function normal() {
    if (video) {
        video.playbackRate = 1;
    }
}


function fast() {
    if (video) {
        video.playbackRate = 2;
    }
}


/* =========================================================
   최근 기록 취소
========================================================= */

function undoLastRecord() {
    if (records.length === 0) {
        alert("취소할 기록이 없습니다.");
        return;
    }

    const removed = records.pop();
    const player = players[removed.name];

    if (!player) {
        draw();
        drawScoreChart();
        return;
    }

    switch (removed.type) {
        case "2P 성공":
            player.pts = Math.max(0, player.pts - 2);
            player.fgm = Math.max(0, player.fgm - 1);
            player.fga = Math.max(0, player.fga - 1);
            break;

        case "2P 실패":
            player.fga = Math.max(0, player.fga - 1);
            break;

        case "3P 성공":
            player.pts = Math.max(0, player.pts - 3);
            player.fgm = Math.max(0, player.fgm - 1);
            player.fga = Math.max(0, player.fga - 1);
            player.threeM =
                Math.max(0, player.threeM - 1);
            player.threeA =
                Math.max(0, player.threeA - 1);
            break;

        case "3P 실패":
            player.fga = Math.max(0, player.fga - 1);
            player.threeA =
                Math.max(0, player.threeA - 1);
            break;

        case "FT 성공":
            player.pts = Math.max(0, player.pts - 1);
            player.ftm = Math.max(0, player.ftm - 1);
            player.fta = Math.max(0, player.fta - 1);
            break;

        case "FT 실패":
            player.fta = Math.max(0, player.fta - 1);
            break;

        case "리바운드":
            player.reb = Math.max(0, player.reb - 1);
            break;

        case "어시스트":
            player.ast = Math.max(0, player.ast - 1);
            break;

        case "스틸":
            player.stl = Math.max(0, player.stl - 1);
            break;

        case "블록":
            player.blk = Math.max(0, player.blk - 1);
            break;

        case "턴오버":
            player.to = Math.max(0, player.to - 1);
            break;
    }

    if (
        removed.type === "2P 성공" ||
        removed.type === "3P 성공" ||
        removed.type === "FT 성공"
    ) {
        if (scoreHistoryA.length > 1) {
            scoreHistoryA.pop();
        }

        if (scoreHistoryB.length > 1) {
            scoreHistoryB.pop();
        }
    }

    drawScoreChart();
    draw();
}


/* =========================================================
   점수 흐름 그래프
========================================================= */

function drawScoreChart() {
    const canvas =
        document.getElementById("scoreChart");

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 35;

    context.clearRect(0, 0, width, height);

    context.fillStyle = "#111827";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "#475569";
    context.lineWidth = 1;

    for (let index = 0; index <= 5; index += 1) {
        const y =
            padding +
            ((height - padding * 2) / 5) * index;

        context.beginPath();
        context.moveTo(padding, y);
        context.lineTo(width - padding, y);
        context.stroke();
    }

    const maxScore = Math.max(
        10,
        ...scoreHistoryA,
        ...scoreHistoryB
    );

    drawTeamLine(
        context,
        scoreHistoryA,
        "#3b82f6",
        width,
        height,
        padding,
        maxScore
    );

    drawTeamLine(
        context,
        scoreHistoryB,
        "#ef4444",
        width,
        height,
        padding,
        maxScore
    );
}


function drawTeamLine(
    context,
    history,
    color,
    width,
    height,
    padding,
    maxScore
) {
    if (!history || history.length === 0) return;

    context.strokeStyle = color;
    context.lineWidth = 4;
    context.beginPath();

    history.forEach(function (score, index) {
        const denominator =
            Math.max(history.length - 1, 1);

        const x =
            padding +
            (index / denominator) *
            (width - padding * 2);

        const y =
            height -
            padding -
            (score / maxScore) *
            (height - padding * 2);

        if (index === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    });

    context.stroke();
}


/* =========================================================
   페이지 시작
========================================================= */

window.addEventListener("load", function () {
    draw();
    drawScoreChart();

    safeCall("initCourt");
    safeCall("renderPlayers2");

    const undoButton =
        document.getElementById("undoBtn");

    if (undoButton) {
        undoButton.onclick = undoLastRecord;
    }
});