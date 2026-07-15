function updateGameGrade() {
    const box = document.getElementById("gameGrade");
    if (!box) return;

    const playerList =
        typeof players !== "undefined" && players
            ? Object.values(players)
            : [];

    // 점수판 점수 찾기
    const scoreboardA = getGameGradeTeamScore("A");
    const scoreboardB = getGameGradeTeamScore("B");

    let totalPts = 0;
    let totalReb = 0;
    let totalAst = 0;
    let totalStl = 0;
    let totalBlk = 0;
    let totalTo = 0;
    let totalFgm = 0;
    let totalFga = 0;

    playerList.forEach(function (p) {
        totalPts += Number(p.pts || 0);
        totalReb += Number(p.reb || 0);
        totalAst += Number(p.ast || 0);
        totalStl += Number(p.stl || 0);
        totalBlk += Number(p.blk || 0);
        totalTo += Number(p.to || 0);
        totalFgm += Number(p.fgm || 0);
        totalFga += Number(p.fga || 0);
    });

    // 개인 득점 기록이 없으면 점수판 점수 사용
    if (totalPts === 0) {
        totalPts = scoreboardA + scoreboardB;
    }

    const hasData =
        playerList.length > 0 ||
        scoreboardA > 0 ||
        scoreboardB > 0 ||
        totalPts > 0 ||
        totalReb > 0 ||
        totalAst > 0 ||
        totalStl > 0 ||
        totalBlk > 0 ||
        totalTo > 0;

    if (!hasData) {
        box.innerHTML = "아직 경기 데이터가 없습니다.";
        return;
    }

    const fg = totalFga > 0
        ? Math.round((totalFgm / totalFga) * 100)
        : 0;

    let score =
        totalPts * 1.2 +
        totalReb * 1.5 +
        totalAst * 2 +
        totalStl * 2.5 +
        totalBlk * 2.5 +
        fg * 0.25 -
        totalTo * 2;

    score = Math.max(0, Math.round(score));

    let grade = "D";
    let stars = "⭐☆☆☆☆";
    let comment = "경기 기록을 더 쌓아보세요.";

    if (score >= 130) {
        grade = "S+";
        stars = "⭐⭐⭐⭐⭐";
        comment = "공격과 수비 모두 압도적인 경기였습니다.";
    } else if (score >= 110) {
        grade = "S";
        stars = "⭐⭐⭐⭐⭐";
        comment = "매우 뛰어난 경기력을 보여줬습니다.";
    } else if (score >= 90) {
        grade = "A+";
        stars = "⭐⭐⭐⭐☆";
        comment = "공수 밸런스가 매우 좋은 경기였습니다.";
    } else if (score >= 70) {
        grade = "A";
        stars = "⭐⭐⭐⭐☆";
        comment = "안정적인 경기력을 보여줬습니다.";
    } else if (score >= 50) {
        grade = "B";
        stars = "⭐⭐⭐☆☆";
        comment = "좋은 장면이 있었지만 보완도 필요합니다.";
    } else if (score >= 30) {
        grade = "C";
        stars = "⭐⭐☆☆☆";
        comment = "공격 효율과 팀플레이를 더 높여보세요.";
    }

    const winnerText =
        scoreboardA > scoreboardB
            ? "🔵 A팀 우세"
            : scoreboardB > scoreboardA
            ? "🔴 B팀 우세"
            : scoreboardA === 0 && scoreboardB === 0
            ? "⚪ 점수판 기록 없음"
            : "⚪ 동점";

    box.innerHTML = `
        <h3>🏅 경기 종합 평가</h3>

        <div style="
            font-size:48px;
            font-weight:800;
            margin:12px 0;
        ">
            ${grade}
        </div>

        <div style="font-size:22px;">
            ${stars}
        </div>

        <br>

        📊 경기 점수 : <b>${score}</b><br>
        🏀 총득점 : <b>${totalPts}</b><br>
        🔵 A팀 점수 : <b>${scoreboardA}</b><br>
        🔴 B팀 점수 : <b>${scoreboardB}</b><br>
        💪 리바운드 : <b>${totalReb}</b><br>
        🤝 어시스트 : <b>${totalAst}</b><br>
        🛡️ 스틸 : <b>${totalStl}</b><br>
        🚫 블록 : <b>${totalBlk}</b><br>
        ❌ 턴오버 : <b>${totalTo}</b><br>
        🎯 팀 FG : <b>${fg}%</b>

        <hr>

        ${winnerText}<br><br>
        🤖 ${comment}
    `;
}


// 점수판에서 A팀/B팀 점수를 자동으로 찾는 함수
function getGameGradeTeamScore(team) {
    const isA = team === "A";

    // 프로젝트에서 사용할 가능성이 있는 전역 변수 이름
    const variableNames = isA
        ? [
            "scoreA",
            "aScore",
            "teamAScore",
            "blueScore",
            "scoreBlue"
        ]
        : [
            "scoreB",
            "bScore",
            "teamBScore",
            "redScore",
            "scoreRed"
        ];

    for (const name of variableNames) {
        if (
            typeof globalThis[name] !== "undefined" &&
            !Number.isNaN(Number(globalThis[name]))
        ) {
            return Number(globalThis[name]) || 0;
        }
    }

    // 프로젝트에서 사용할 가능성이 있는 HTML id
    const elementIds = isA
        ? [
            "scoreA",
            "aScore",
            "teamAScore",
            "blueScore",
            "scoreBlue"
        ]
        : [
            "scoreB",
            "bScore",
            "teamBScore",
            "redScore",
            "scoreRed"
        ];

    for (const id of elementIds) {
        const element = document.getElementById(id);

        if (element) {
            const value = Number(
                String(element.textContent || element.value || "0")
                    .replace(/[^0-9.-]/g, "")
            );

            if (!Number.isNaN(value)) {
                return value;
            }
        }
    }

    return 0;
}