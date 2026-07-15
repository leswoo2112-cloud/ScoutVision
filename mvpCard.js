function updateMVPCard() {

    const box = document.getElementById("mvpCard");
    if (!box) return;

    const list = Object.entries(players);

    if (list.length === 0) {
        box.innerHTML = "아직 경기 기록이 없습니다.";
        return;
    }

    let bestName = "";
    let bestScore = -999;
    let best = null;

    list.forEach(([name, p]) => {

        const fg = p.fga ? Math.round((p.fgm / p.fga) * 100) : 0;

        const score =
            p.pts * 1 +
            p.reb * 1.2 +
            p.ast * 1.5 +
            p.stl * 2 +
            p.blk * 2 -
            p.to * 1.5 +
            fg * 0.15;

        if (score > bestScore) {
            bestScore = score;
            bestName = name;
            best = p;
        }

    });

    const fg = best.fga ? Math.round(best.fgm / best.fga * 100) : 0;

    box.innerHTML = `
    <h3>🏆 오늘의 MVP</h3>

    <h2>${bestName}</h2>

    ⭐ MVP 점수 : <b>${bestScore.toFixed(1)}</b><br><br>

    🏀 ${best.pts}점<br>
    💪 ${best.reb}리바운드<br>
    🤝 ${best.ast}어시스트<br>
    🛡️ ${best.stl}스틸<br>
    🚫 ${best.blk}블록<br>
    🎯 FG ${fg}%<br>

    <hr>

    🧠 ${
        best.pts >= 20
            ? "팀의 공격을 이끌며 최고의 활약을 펼쳤습니다."
            : best.ast >= 5
            ? "경기 조율 능력이 뛰어난 플레이메이커였습니다."
            : best.reb >= 8
            ? "골밑 장악력이 뛰어난 경기였습니다."
            : "공수에서 안정적인 활약을 보여주었습니다."
    }
    `;
}