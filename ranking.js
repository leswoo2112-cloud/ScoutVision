function updateRanking() {
    const box = document.getElementById("ranking");
    if (!box) return;

    const playerList = Object.entries(players || {});

    // 이전 랭킹을 반드시 지우고 다시 그림
    box.innerHTML = "";

    if (playerList.length === 0) {
        box.innerHTML = `
            <div class="ranking-empty">
                아직 선수 데이터가 없습니다.
            </div>
        `;
        return;
    }

    const rankingList = playerList
        .map(function ([name, player]) {
            const score =
                Number(player.pts || 0) +
                Number(player.reb || 0) * 1.2 +
                Number(player.ast || 0) * 1.5 +
                Number(player.stl || 0) * 2 +
                Number(player.blk || 0) * 2 -
                Number(player.to || 0);

            return {
                name: name,
                team: player.team || "A",
                pts: Number(player.pts || 0),
                reb: Number(player.reb || 0),
                ast: Number(player.ast || 0),
                score: Math.max(0, Math.round(score))
            };
        })
        .sort(function (a, b) {
            return b.score - a.score;
        });

    const rows = rankingList
        .map(function (player, index) {
            let medal = `${index + 1}위`;

            if (index === 0) medal = "🥇";
            if (index === 1) medal = "🥈";
            if (index === 2) medal = "🥉";

            const teamIcon =
                player.team === "B" ? "🔴" : "🔵";

            return `
                <div class="ranking-row">
                    <div class="ranking-place">${medal}</div>

                    <div class="ranking-player">
                        <strong>${teamIcon} ${player.name}</strong>

                        <span>
                            ${player.pts}점 ·
                            ${player.reb}리바운드 ·
                            ${player.ast}어시스트
                        </span>
                    </div>

                    <div class="ranking-score">
                        ${player.score}
                    </div>
                </div>
            `;
        })
        .join("");

    box.innerHTML = `
        <div class="ranking-panel">
            <div class="ranking-title">
                <span>🏆 선수 랭킹</span>
                <small>종합 기여도</small>
            </div>

            <div class="ranking-list">
                ${rows}
            </div>
        </div>
    `;
}