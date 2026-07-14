function updateHotPlayer() {
    const box = document.getElementById("hotPlayer");
    if (!box) return;

    const list = Object.entries(players);

    if (list.length === 0) {
        box.innerHTML = "아직 선수 데이터가 없습니다.";
        return;
    }

    let bestName = "";
    let bestPlayer = null;
    let bestScore = -Infinity;

    list.forEach(([name, p]) => {
        const missedShots = Math.max(0, p.fga - p.fgm);
        const missedFT = Math.max(0, p.fta - p.ftm);

        const hotScore =
            p.pts * 1.0 +
            p.reb * 1.2 +
            p.ast * 1.5 +
            p.stl * 2.0 +
            p.blk * 2.0 -
            p.to * 1.5 -
            missedShots * 0.5 -
            missedFT * 0.25;

        if (hotScore > bestScore) {
            bestScore = hotScore;
            bestName = name;
            bestPlayer = p;
        }
    });

    if (!bestPlayer) {
        box.innerHTML = "아직 선수 데이터가 없습니다.";
        return;
    }

    const fg = bestPlayer.fga
        ? Math.round((bestPlayer.fgm / bestPlayer.fga) * 100)
        : 0;

    let comment = "경기에서 가장 높은 영향력을 보여줬습니다.";

    if (bestPlayer.pts >= 15) {
        comment = "높은 득점력으로 공격을 이끌었습니다.";
    } else if (bestPlayer.ast >= 5) {
        comment = "패스와 경기 운영에서 강한 영향력을 보였습니다.";
    } else if (bestPlayer.reb >= 8) {
        comment = "리바운드 싸움에서 높은 기여도를 보였습니다.";
    } else if (bestPlayer.stl + bestPlayer.blk >= 4) {
        comment = "수비에서 큰 영향력을 보여줬습니다.";
    }

    box.innerHTML = `
        <h3>🔥 오늘의 HOT PLAYER</h3>

        <div style="padding:12px; border-bottom:1px solid #333;">
            <b style="font-size:22px;">${bestName}</b><br><br>

            🏀 득점 ${bestPlayer.pts}점<br>
            💪 리바운드 ${bestPlayer.reb}개<br>
            🤝 어시스트 ${bestPlayer.ast}개<br>
            🛡️ 스틸 ${bestPlayer.stl}개<br>
            🚫 블록 ${bestPlayer.blk}개<br>
            🎯 FG ${fg}%<br>
            🔥 HOT 점수 ${bestScore.toFixed(1)}
        </div>

        <p>${comment}</p>
    `;
}