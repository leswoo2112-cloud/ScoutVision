function updateSeasonStats() {
    const box = document.getElementById("seasonStats");
    if (!box) return;

    if (typeof players === "undefined") {
        box.innerHTML = "아직 시즌 데이터가 없습니다.";
        return;
    }

    const list = Object.entries(players);

    if (list.length === 0) {
        box.innerHTML = "아직 시즌 데이터가 없습니다.";
        return;
    }

    const games = Number(
        localStorage.getItem("scoutvisionSeasonGames") || 1
    );

    let totalPts = 0;
    let totalReb = 0;
    let totalAst = 0;
    let totalStl = 0;
    let totalBlk = 0;
    let totalTo = 0;
    let totalFgm = 0;
    let totalFga = 0;

    let topScorer = {
        name: "",
        pts: -1
    };

    let seasonMVP = {
        name: "",
        score: -Infinity
    };

    list.forEach(([name, p]) => {
        const pts = p.pts || 0;
        const reb = p.reb || 0;
        const ast = p.ast || 0;
        const stl = p.stl || 0;
        const blk = p.blk || 0;
        const to = p.to || 0;
        const fgm = p.fgm || 0;
        const fga = p.fga || 0;

        totalPts += pts;
        totalReb += reb;
        totalAst += ast;
        totalStl += stl;
        totalBlk += blk;
        totalTo += to;
        totalFgm += fgm;
        totalFga += fga;

        if (pts > topScorer.pts) {
            topScorer = {
                name,
                pts
            };
        }

        const fg = fga ? (fgm / fga) * 100 : 0;

        const mvpScore =
            pts +
            reb * 1.2 +
            ast * 1.5 +
            stl * 2 +
            blk * 2 -
            to * 1.5 +
            fg * 0.1;

        if (mvpScore > seasonMVP.score) {
            seasonMVP = {
                name,
                score: mvpScore
            };
        }
    });

    const fg = totalFga
        ? Math.round((totalFgm / totalFga) * 100)
        : 0;

    const ppg = (totalPts / games).toFixed(1);
    const rpg = (totalReb / games).toFixed(1);
    const apg = (totalAst / games).toFixed(1);
    const spg = (totalStl / games).toFixed(1);
    const bpg = (totalBlk / games).toFixed(1);
    const tpg = (totalTo / games).toFixed(1);

    box.innerHTML = `
        <h3>📊 시즌 누적 분석</h3>

        🗓️ 경기 수 : <b>${games}</b><br><br>

        🏀 평균 득점 : <b>${ppg}</b><br>
        💪 평균 리바운드 : <b>${rpg}</b><br>
        🤝 평균 어시스트 : <b>${apg}</b><br>
        🛡️ 평균 스틸 : <b>${spg}</b><br>
        🚫 평균 블록 : <b>${bpg}</b><br>
        ❌ 평균 턴오버 : <b>${tpg}</b><br>
        🎯 시즌 FG : <b>${fg}%</b>

        <hr>

        🔥 최고 득점 선수 :
        <b>${topScorer.name}</b>
        (${topScorer.pts}점)

        <br><br>

        🏆 시즌 MVP 후보 :
        <b>${seasonMVP.name}</b>
        (${seasonMVP.score.toFixed(1)})
    `;
}