function updateGameGrade() {
    const box = document.getElementById("gameGrade");
    if (!box) return;

    if (
        typeof players === "undefined" ||
        Object.keys(players).length === 0
    ) {
        box.innerHTML = "아직 경기 데이터가 없습니다.";
        return;
    }

    let totalPts = 0;
    let totalReb = 0;
    let totalAst = 0;
    let totalStl = 0;
    let totalBlk = 0;
    let totalTo = 0;
    let totalFgm = 0;
    let totalFga = 0;

    Object.values(players).forEach(function (p) {
        totalPts += Number(p.pts || 0);
        totalReb += Number(p.reb || 0);
        totalAst += Number(p.ast || 0);
        totalStl += Number(p.stl || 0);
        totalBlk += Number(p.blk || 0);
        totalTo += Number(p.to || 0);
        totalFgm += Number(p.fgm || 0);
        totalFga += Number(p.fga || 0);
    });

    const fg = totalFga
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
    let comment = "기록을 조금 더 쌓아보세요.";

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
        comment = "공수 밸런스가 좋은 경기였습니다.";
    } else if (score >= 70) {
        grade = "A";
        stars = "⭐⭐⭐⭐☆";
        comment = "안정적인 경기력을 보여줬습니다.";
    } else if (score >= 50) {
        grade = "B";
        stars = "⭐⭐⭐☆☆";
        comment = "좋은 부분이 있었지만 보완도 필요합니다.";
    } else if (score >= 30) {
        grade = "C";
        stars = "⭐⭐☆☆☆";
        comment = "공격 효율과 팀플레이를 더 높여보세요.";
    }

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
        💪 리바운드 : <b>${totalReb}</b><br>
        🤝 어시스트 : <b>${totalAst}</b><br>
        🛡️ 스틸 : <b>${totalStl}</b><br>
        🚫 블록 : <b>${totalBlk}</b><br>
        ❌ 턴오버 : <b>${totalTo}</b><br>
        🎯 팀 FG : <b>${fg}%</b>

        <hr>

        🤖 ${comment}
    `;
}