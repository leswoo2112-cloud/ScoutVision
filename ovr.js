function updateOVR() {
    const box = document.getElementById("ovr");
    if (!box) return;

    const list = Object.entries(players);

    if (list.length === 0) {
        box.innerHTML = "아직 선수 데이터가 없습니다.";
        return;
    }

    let html = "<h3>⭐ 선수 평점</h3>";

    list.forEach(([name, p]) => {

        const fg = p.fga ? Math.round((p.fgm / p.fga) * 100) : 0;

        let ovr =
            60 +
            p.pts * 0.8 +
            p.reb * 1.2 +
            p.ast * 1.4 +
            p.stl * 2 +
            p.blk * 2 +
            fg * 0.08 -
            p.to * 1.5;

        ovr = Math.max(50, Math.min(99, Math.round(ovr)));

        html += `
    <div style="padding:10px; border-bottom:1px solid #333;">
        <b>${name}</b><br>
        ⭐ OVR <span style="color:#FFD700; font-size:24px;">${ovr}</span>
    </div>
`;
    });

    box.innerHTML = html;
}