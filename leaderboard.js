function updateLeaderboard() {
    const box = document.getElementById("leaderboard");
    if (!box) return;

    const arr = [];

    Object.entries(players).forEach(([name, p]) => {

        const missedShots = Math.max(0, p.fga - p.fgm);
        const missedFT = Math.max(0, p.fta - p.ftm);

        const score =
            p.pts +
            p.reb * 1.2 +
            p.ast * 1.5 +
            p.stl * 2.5 +
            p.blk * 2.5 -
            p.to * 1.5 -
            missedShots * 0.5 -
            missedFT * 0.25;

        arr.push({
            name,
            score,
            pts: p.pts
        });
    });

    arr.sort((a, b) => b.score - a.score);

    if (arr.length === 0) {
        box.innerHTML = "아직 기록이 없습니다.";
        return;
    }

    let html = "<h3>🏅 선수 순위</h3>";

    arr.forEach((p, i) => {

        let medal = "";

        if (i === 0) medal = "🥇";
        else if (i === 1) medal = "🥈";
        else if (i === 2) medal = "🥉";
        else medal = (i + 1) + ".";

        html += `
        <div style="padding:8px;border-bottom:1px solid #333;">
            ${medal} <b>${p.name}</b>
            <br>
            MVP 점수 ${p.score.toFixed(1)}
            | 득점 ${p.pts}
        </div>
        `;
    });

    box.innerHTML = html;
}