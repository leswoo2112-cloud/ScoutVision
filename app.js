/* =========================================================
   ScoutVision 4.0
   메인 기록·분석 시스템
   로컬 영상 + YouTube 영상 지원
========================================================= */


/* =========================================================
   기본 데이터
========================================================= */

var records = [];
var players = {};

var scoreHistoryA = [0];
var scoreHistoryB = [0];

window.records = records;
window.players = players;
window.scoreHistoryA = scoreHistoryA;
window.scoreHistoryB = scoreHistoryB;


/* =========================================================
   화면 요소
========================================================= */

var video = document.getElementById("video");
var events = document.getElementById("events");
var stats = document.getElementById("stats");
var ai = document.getElementById("ai");


/* =========================================================
   다른 JS 기능 안전 실행
========================================================= */

function safeCall(functionName) {
    try {
        if (typeof window[functionName] === "function") {
            window[functionName]();
        }
    } catch (error) {
        console.warn(
            functionName + " 실행 오류:",
            error
        );
    }
}


/* =========================================================
   영상 파일 불러오기
========================================================= */

function loadVideo(event) {
    var file =
        event &&
        event.target &&
        event.target.files
            ? event.target.files[0]
            : null;

    if (!file) return;

    video = document.getElementById("video");

    if (!video) {
        alert("영상 플레이어를 찾을 수 없습니다.");
        return;
    }

    if (
        typeof window.useLocalVideoMode ===
        "function"
    ) {
        window.useLocalVideoMode();
    }

    if (
        video.dataset.objectUrl
    ) {
        URL.revokeObjectURL(
            video.dataset.objectUrl
        );
    }

    var objectUrl =
        URL.createObjectURL(file);

    video.dataset.objectUrl =
        objectUrl;

    video.src = objectUrl;
    video.load();
}

window.loadVideo = loadVideo;


/* =========================================================
   시간 표시
========================================================= */

function timeText(seconds) {
    var total =
        Math.max(
            0,
            Math.floor(Number(seconds) || 0)
        );

    var minutes =
        Math.floor(total / 60);

    var remain =
        total % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remain).padStart(2, "0")
    );
}


/* =========================================================
   현재 영상 시간
========================================================= */

function getCurrentAnalysisTime() {
    if (
        typeof window.getAnalysisTime ===
        "function"
    ) {
        try {
            var youtubeTime =
                Number(
                    window.getAnalysisTime()
                );

            if (
                Number.isFinite(
                    youtubeTime
                )
            ) {
                return youtubeTime;
            }
        } catch (error) {
            console.warn(
                "영상 시간 확인 오류:",
                error
            );
        }
    }

    video =
        document.getElementById("video");

    if (
        video &&
        Number.isFinite(
            Number(video.currentTime)
        )
    ) {
        return Number(
            video.currentTime
        );
    }

    return 0;
}


/* =========================================================
   선수 생성
========================================================= */

function makePlayer(name) {
    var cleanName =
        String(name || "").trim();

    if (!cleanName) return null;

    if (!players[cleanName]) {
        players[cleanName] = {
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

    return players[cleanName];
}

window.makePlayer = makePlayer;


/* =========================================================
   선택된 선수 확인
========================================================= */

function getSelectedPlayerInfo() {
    var playerInput =
        document.getElementById("player");

    var name = "";

    if (
        typeof window.selectedPlayer2 ===
            "string" &&
        window.selectedPlayer2.trim()
    ) {
        name =
            window.selectedPlayer2.trim();
    } else if (
        typeof selectedPlayer2 !==
            "undefined" &&
        String(selectedPlayer2).trim()
    ) {
        name =
            String(selectedPlayer2).trim();
    } else if (playerInput) {
        name =
            playerInput.value.trim();
    }

    var team = "A";

    if (
        typeof window.selectedPlayerTeam2 ===
            "string" &&
        window.selectedPlayerTeam2
    ) {
        team =
            window.selectedPlayerTeam2;
    } else if (
        typeof selectedPlayerTeam2 !==
            "undefined" &&
        selectedPlayerTeam2
    ) {
        team =
            selectedPlayerTeam2;
    } else if (
        name &&
        players[name] &&
        players[name].team
    ) {
        team =
            players[name].team;
    }

    if (
        team !== "A" &&
        team !== "B"
    ) {
        team = "A";
    }

    return {
        name: name,
        team: team,
        input: playerInput
    };
}


/* =========================================================
   기록 입력
========================================================= */

function record(type) {
    try {
        var selected =
            getSelectedPlayerInfo();

        var name =
            selected.name;

        var team =
            selected.team;

        if (!name) {
            alert(
                "먼저 선수를 추가하고 선택해주세요."
            );
            return;
        }

        var player =
            makePlayer(name);

        if (!player) return;

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
                console.warn(
                    "알 수 없는 기록 종류:",
                    type
                );
                return;
        }

        var currentTime =
            getCurrentAnalysisTime();

        records.push({
            team: team,
            name: name,
            type: type,
            time: currentTime
        });

        updateScoreHistory(
            team,
            type
        );

        if (selected.input) {
            selected.input.value =
                name;
        }

        window.records = records;
        window.players = players;

        drawScoreChart();
        draw();
    } catch (error) {
        console.error(
            "기록 입력 오류:",
            error
        );

        alert(
            "기록 처리 중 오류가 발생했습니다."
        );
    }
}

window.record = record;


/* =========================================================
   점수 흐름 저장
========================================================= */

function updateScoreHistory(team, type) {
    var lastA =
        scoreHistoryA[
            scoreHistoryA.length - 1
        ] || 0;

    var lastB =
        scoreHistoryB[
            scoreHistoryB.length - 1
        ] || 0;

    var point = 0;

    if (type === "2P 성공") {
        point = 2;
    }

    if (type === "3P 성공") {
        point = 3;
    }

    if (type === "FT 성공") {
        point = 1;
    }

    if (point === 0) return;

    if (team === "B") {
        scoreHistoryA.push(lastA);
        scoreHistoryB.push(
            lastB + point
        );
    } else {
        scoreHistoryA.push(
            lastA + point
        );
        scoreHistoryB.push(lastB);
    }

    window.scoreHistoryA =
        scoreHistoryA;

    window.scoreHistoryB =
        scoreHistoryB;
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

window.draw = draw;


/* =========================================================
   기록 타임라인
========================================================= */

function drawTimeline() {
    events =
        document.getElementById("events");

    if (!events) return;

    events.innerHTML = "";

    if (records.length === 0) {
        events.innerHTML =
            '<div class="empty-message">' +
            "아직 기록이 없습니다." +
            "</div>";

        return;
    }

    records.forEach(
        function (recordItem) {
            var item =
                document.createElement(
                    "div"
                );

            item.className =
                "timeline-item";

            var teamIcon =
                recordItem.team === "B"
                    ? "🔴"
                    : "🔵";

            item.textContent =
                timeText(
                    recordItem.time
                ) +
                " | " +
                teamIcon +
                " " +
                recordItem.name +
                " | " +
                recordItem.type;

            item.onclick =
                function () {
                    if (
                        typeof window
                            .seekAnalysisTime ===
                        "function"
                    ) {
                        window.seekAnalysisTime(
                            recordItem.time
                        );
                    } else {
                        video =
                            document.getElementById(
                                "video"
                            );

                        if (video) {
                            video.currentTime =
                                recordItem.time;
                        }
                    }

                    if (
                        typeof window
                            .playAnalysisVideo ===
                        "function"
                    ) {
                        window.playAnalysisVideo();
                    } else if (video) {
                        video
                            .play()
                            .catch(
                                function () {}
                            );
                    }
                };

            events.appendChild(item);
        }
    );
}


/* =========================================================
   선수 통계
========================================================= */

function drawPlayerStats() {
    stats =
        document.getElementById("stats");

    if (!stats) return;

    stats.innerHTML = "";

    var playerEntries =
        Object.entries(players);

    if (
        playerEntries.length === 0
    ) {
        stats.innerHTML =
            '<div class="empty-message">' +
            "아직 선수 데이터가 없습니다." +
            "</div>";

        return;
    }

    playerEntries.forEach(
        function (entry) {
            var name =
                entry[0];

            var player =
                entry[1];

            var fg =
                player.fga > 0
                    ? Math.round(
                        (
                            player.fgm /
                            player.fga
                        ) * 100
                    )
                    : 0;

            var three =
                player.threeA > 0
                    ? Math.round(
                        (
                            player.threeM /
                            player.threeA
                        ) * 100
                    )
                    : 0;

            var ft =
                player.fta > 0
                    ? Math.round(
                        (
                            player.ftm /
                            player.fta
                        ) * 100
                    )
                    : 0;

            var teamIcon =
                player.team === "B"
                    ? "🔴"
                    : "🔵";

            var box =
                document.createElement(
                    "div"
                );

            box.className =
                "player-stat-card";

            box.innerHTML =
                "<h3>" +
                teamIcon +
                " " +
                name +
                "</h3>" +

                "<b>득점 " +
                player.pts +
                "</b><br>" +

                "FG " +
                player.fgm +
                "/" +
                player.fga +
                " · " +
                fg +
                "%<br>" +

                "3P " +
                player.threeM +
                "/" +
                player.threeA +
                " · " +
                three +
                "%<br>" +

                "FT " +
                player.ftm +
                "/" +
                player.fta +
                " · " +
                ft +
                "%<br>" +

                "REB " +
                player.reb +
                " · AST " +
                player.ast +
                "<br>" +

                "STL " +
                player.stl +
                " · BLK " +
                player.blk +
                " · TO " +
                player.to;

            stats.appendChild(box);
        }
    );
}


/* =========================================================
   AI 한줄평
========================================================= */

function makeAI() {
    ai =
        document.getElementById("ai");

    if (!ai) return;

    var playerEntries =
        Object.entries(players);

    if (
        playerEntries.length === 0
    ) {
        ai.textContent =
            "아직 기록 없음";

        return;
    }

    var comments = [];

    playerEntries.forEach(
        function (entry) {
            var name =
                entry[0];

            var player =
                entry[1];

            var fg =
                player.fga > 0
                    ? Math.round(
                        (
                            player.fgm /
                            player.fga
                        ) * 100
                    )
                    : 0;

            if (
                player.pts >= 15
            ) {
                comments.push(
                    name +
                    "은 득점력이 좋았습니다."
                );
            }

            if (
                fg >= 50 &&
                player.fga >= 4
            ) {
                comments.push(
                    name +
                    "은 슛 효율이 좋았습니다."
                );
            }

            if (
                player.ast >= 5
            ) {
                comments.push(
                    name +
                    "은 패스 기여도가 높았습니다."
                );
            }

            if (
                player.reb >= 5
            ) {
                comments.push(
                    name +
                    "은 리바운드 기여도가 높았습니다."
                );
            }

            if (
                player.stl >= 3
            ) {
                comments.push(
                    name +
                    "은 수비 압박이 좋았습니다."
                );
            }

            if (
                player.to >= 3
            ) {
                comments.push(
                    name +
                    "은 턴오버 관리가 필요합니다."
                );
            }
        }
    );

    ai.textContent =
        comments.length > 0
            ? comments.join(" ")
            : "경기 기록이 정상적으로 분석되고 있습니다.";
}


/* =========================================================
   영상 조작
========================================================= */

function back5() {
    if (
        typeof window.seekAnalysisTime ===
            "function" &&
        typeof window.getAnalysisTime ===
            "function"
    ) {
        window.seekAnalysisTime(
            window.getAnalysisTime() - 5
        );

        return;
    }

    video =
        document.getElementById("video");

    if (!video) return;

    video.currentTime =
        Math.max(
            0,
            video.currentTime - 5
        );
}


function forward5() {
    if (
        typeof window.seekAnalysisTime ===
            "function" &&
        typeof window.getAnalysisTime ===
            "function"
    ) {
        window.seekAnalysisTime(
            window.getAnalysisTime() + 5
        );

        return;
    }

    video =
        document.getElementById("video");

    if (!video) return;

    var maximum =
        Number.isFinite(
            video.duration
        )
            ? video.duration
            : video.currentTime + 5;

    video.currentTime =
        Math.min(
            maximum,
            video.currentTime + 5
        );
}


function playPause() {
    if (
        typeof window.toggleAnalysisVideo ===
        "function"
    ) {
        window.toggleAnalysisVideo();
        return;
    }

    video =
        document.getElementById("video");

    if (!video) return;

    if (video.paused) {
        video
            .play()
            .catch(function () {});
    } else {
        video.pause();
    }
}


function slow() {
    if (
        typeof window
            .setAnalysisPlaybackRate ===
        "function"
    ) {
        window.setAnalysisPlaybackRate(
            0.5
        );

        return;
    }

    video =
        document.getElementById("video");

    if (video) {
        video.playbackRate = 0.5;
    }
}


function normal() {
    if (
        typeof window
            .setAnalysisPlaybackRate ===
        "function"
    ) {
        window.setAnalysisPlaybackRate(
            1
        );

        return;
    }

    video =
        document.getElementById("video");

    if (video) {
        video.playbackRate = 1;
    }
}


function fast() {
    if (
        typeof window
            .setAnalysisPlaybackRate ===
        "function"
    ) {
        window.setAnalysisPlaybackRate(
            2
        );

        return;
    }

    video =
        document.getElementById("video");

    if (video) {
        video.playbackRate = 2;
    }
}

window.back5 = back5;
window.forward5 = forward5;
window.playPause = playPause;
window.slow = slow;
window.normal = normal;
window.fast = fast;


/* =========================================================
   최근 기록 취소
========================================================= */

function undoLastRecord() {
    if (records.length === 0) {
        alert(
            "취소할 기록이 없습니다."
        );
        return;
    }

    var removed =
        records.pop();

    var player =
        players[removed.name];

    if (!player) {
        draw();
        drawScoreChart();
        return;
    }

    switch (removed.type) {
        case "2P 성공":
            player.pts =
                Math.max(
                    0,
                    player.pts - 2
                );

            player.fgm =
                Math.max(
                    0,
                    player.fgm - 1
                );

            player.fga =
                Math.max(
                    0,
                    player.fga - 1
                );
            break;

        case "2P 실패":
            player.fga =
                Math.max(
                    0,
                    player.fga - 1
                );
            break;

        case "3P 성공":
            player.pts =
                Math.max(
                    0,
                    player.pts - 3
                );

            player.fgm =
                Math.max(
                    0,
                    player.fgm - 1
                );

            player.fga =
                Math.max(
                    0,
                    player.fga - 1
                );

            player.threeM =
                Math.max(
                    0,
                    player.threeM - 1
                );

            player.threeA =
                Math.max(
                    0,
                    player.threeA - 1
                );
            break;

        case "3P 실패":
            player.fga =
                Math.max(
                    0,
                    player.fga - 1
                );

            player.threeA =
                Math.max(
                    0,
                    player.threeA - 1
                );
            break;

        case "FT 성공":
            player.pts =
                Math.max(
                    0,
                    player.pts - 1
                );

            player.ftm =
                Math.max(
                    0,
                    player.ftm - 1
                );

            player.fta =
                Math.max(
                    0,
                    player.fta - 1
                );
            break;

        case "FT 실패":
            player.fta =
                Math.max(
                    0,
                    player.fta - 1
                );
            break;

        case "리바운드":
            player.reb =
                Math.max(
                    0,
                    player.reb - 1
                );
            break;

        case "어시스트":
            player.ast =
                Math.max(
                    0,
                    player.ast - 1
                );
            break;

        case "스틸":
            player.stl =
                Math.max(
                    0,
                    player.stl - 1
                );
            break;

        case "블록":
            player.blk =
                Math.max(
                    0,
                    player.blk - 1
                );
            break;

        case "턴오버":
            player.to =
                Math.max(
                    0,
                    player.to - 1
                );
            break;
    }

    rebuildScoreHistory();

    drawScoreChart();
    draw();
}

window.undoLastRecord =
    undoLastRecord;


/* =========================================================
   점수 흐름 다시 계산
========================================================= */

function rebuildScoreHistory() {
    scoreHistoryA = [0];
    scoreHistoryB = [0];

    records.forEach(
        function (recordItem) {
            updateScoreHistory(
                recordItem.team,
                recordItem.type
            );
        }
    );

    window.scoreHistoryA =
        scoreHistoryA;

    window.scoreHistoryB =
        scoreHistoryB;
}


/* =========================================================
   점수 흐름 그래프
========================================================= */

function drawScoreChart() {
    var canvas =
        document.getElementById(
            "scoreChart"
        );

    if (!canvas) return;

    var context =
        canvas.getContext("2d");

    if (!context) return;

    var width =
        canvas.clientWidth || 800;

    var height =
        canvas.clientHeight || 260;

    var ratio =
        window.devicePixelRatio || 1;

    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;

    context.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    context.clearRect(
        0,
        0,
        width,
        height
    );

    var padding = 35;

    var allScores =
        scoreHistoryA.concat(
            scoreHistoryB
        );

    var maximumScore =
        Math.max(
            10,
            ...allScores
        );

    var count =
        Math.max(
            scoreHistoryA.length,
            scoreHistoryB.length
        );

    function drawLine(
        history,
        strokeStyle
    ) {
        context.beginPath();

        history.forEach(
            function (score, index) {
                var x =
                    padding +
                    (
                        index /
                        Math.max(
                            1,
                            count - 1
                        )
                    ) *
                    (
                        width -
                        padding * 2
                    );

                var y =
                    height -
                    padding -
                    (
                        score /
                        maximumScore
                    ) *
                    (
                        height -
                        padding * 2
                    );

                if (index === 0) {
                    context.moveTo(
                        x,
                        y
                    );
                } else {
                    context.lineTo(
                        x,
                        y
                    );
                }
            }
        );

        context.strokeStyle =
            strokeStyle;

        context.lineWidth = 3;
        context.stroke();
    }

    context.strokeStyle =
        "rgba(148,163,184,0.3)";

    context.lineWidth = 1;

    context.beginPath();

    context.moveTo(
        padding,
        height - padding
    );

    context.lineTo(
        width - padding,
        height - padding
    );

    context.stroke();

    drawLine(
        scoreHistoryA,
        "#3b82f6"
    );

    drawLine(
        scoreHistoryB,
        "#ef4444"
    );
}

window.drawScoreChart =
    drawScoreChart;


/* =========================================================
   최초 실행
========================================================= */

window.addEventListener(
    "load",
    function () {
        video =
            document.getElementById(
                "video"
            );

        events =
            document.getElementById(
                "events"
            );

        stats =
            document.getElementById(
                "stats"
            );

        ai =
            document.getElementById(
                "ai"
            );

        drawScoreChart();
        draw();
    }
);


window.addEventListener(
    "resize",
    function () {
        drawScoreChart();
    }
);