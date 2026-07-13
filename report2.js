function updateReport2() {
    const box = document.getElementById("report2");
    if (!box) return;

    const playerList = Object.entries(players || {});

    if (playerList.length === 0 || records.length === 0) {
        box.innerHTML = "아직 경기 기록이 없습니다.";
        return;
    }

    function findLeader(stat) {
        let leaderName = "-";
        let leaderValue = -1;

        playerList.forEach(function ([name, player]) {
            const value = Number(player[stat] || 0);

            if (value > leaderValue) {
                leaderName = name;
                leaderValue = value;
            }
        });

        return {
            name: leaderName,
            value: Math.max(leaderValue, 0)
        };
    }

    function getMVP() {
        let bestName = "-";
        let bestScore = -Infinity;

        playerList.forEach(function ([name, p]) {
            const missedShots = Math.max(
                0,
                Number(p.fga || 0) - Number(p.fgm || 0)
            );

            const missedFT = Math.max(
                0,
                Number(p.fta || 0) - Number(p.ftm || 0)
            );

            const score =
                Number(p.pts || 0) +
                Number(p.reb || 0) * 1.2 +
                Number(p.ast || 0) * 1.5 +
                Number(p.stl || 0) * 2.5 +
                Number(p.blk || 0) * 2.5 -
                Number(p.to || 0) * 1.5 -
                missedShots * 0.5 -
                missedFT * 0.25;

            if (score > bestScore) {
                bestName = name;
                bestScore = score;
            }
        });

        return {
            name: bestName,
            score: bestScore === -Infinity ? 0 : bestScore
        };
    }

    const scoringLeader = findLeader("pts");
    const reboundLeader = findLeader("reb");
    const assistLeader = findLeader("ast");
    const stealLeader = findLeader("stl");
    const blockLeader = findLeader("blk");
    const mvp = getMVP();

    const scoreA =
        typeof scoreHistoryA !== "undefined"
            ? scoreHistoryA[scoreHistoryA.length - 1] || 0
            : 0;

    const scoreB =
        typeof scoreHistoryB !== "undefined"
            ? scoreHistoryB[scoreHistoryB.length - 1] || 0
            : 0;

    let resultText = "무승부";

    if (scoreA > scoreB) resultText = "🔵 A팀 승리";
    if (scoreB > scoreA) resultText = "🔴 B팀 승리";

    let analysis = "두 팀이 치열한 경기를 펼쳤습니다.";

    if (scoreA > scoreB) {
        analysis = "A팀이 더 높은 득점력을 바탕으로 경기를 앞섰습니다.";
    } else if (scoreB > scoreA) {
        analysis = "B팀이 더 높은 득점력을 바탕으로 경기를 앞섰습니다.";
    }

    box.innerHTML = `
        <h2>📋 경기 리포트</h2>

        <h3>${resultText}</h3>
        <p>🔵 A팀 ${scoreA} : ${scoreB} B팀 🔴</p>

        <hr>

        <p>🏆 <b>MVP</b><br>
        ${mvp.name} · MVP 점수 ${mvp.score.toFixed(1)}</p>

        <p>🏀 <b>최다 득점</b><br>
        ${scoringLeader.name} · ${scoringLeader.value}점</p>

        <p>💪 <b>최다 리바운드</b><br>
        ${reboundLeader.name} · ${reboundLeader.value}개</p>

        <p>🤝 <b>최다 어시스트</b><br>
        ${assistLeader.name} · ${assistLeader.value}개</p>

        <p>🛡️ <b>최다 스틸</b><br>
        ${stealLeader.name} · ${stealLeader.value}개</p>

        <p>🚫 <b>최다 블록</b><br>
        ${blockLeader.name} · ${blockLeader.value}개</p>

        <hr>

        <p>🤖 <b>자동 분석</b><br>
        ${analysis}</p>
    `;
}