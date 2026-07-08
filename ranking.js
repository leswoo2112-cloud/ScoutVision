function updateRanking() {
    const box = document.getElementById("teamStats");
    if (!box) return;

    let list = Object.entries(players).map(([name, p]) => ({
        name,
        score: p.pts + p.reb + p.ast + p.stl + p.blk - p.to
    }));

    list.sort((a, b) => b.score - a.score);

    let html = "<h3>🏆 선수 랭킹</h3>";

    list.forEach((p, i) => {
        html += `${i + 1}. ${p.name} (${p.score})<br>`;
    });

    box.innerHTML += "<br>" + html;
}