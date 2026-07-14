function updatePlayerType() {
    const box = document.getElementById("playerType");
    if (!box) return;

    const list = Object.entries(players);

    if (list.length === 0) {
        box.innerHTML = "아직 선수 데이터가 없습니다.";
        return;
    }

    let html = "<h3>🧠 선수 유형 분석</h3>";

    list.forEach(([name, p]) => {
        const fg = p.fga ? (p.fgm / p.fga) * 100 : 0;
        const three = p.threeA ? (p.threeM / p.threeA) * 100 : 0;

        let type = "균형형 선수";
        let comment = "여러 영역에서 고르게 기여했습니다.";

        if (p.pts >= 15 && fg >= 45) {
            type = "🎯 득점형 스코어러";
            comment = "높은 득점력과 좋은 슛 효율을 보였습니다.";
        }

        if (p.ast >= 5 && p.ast > p.to * 2) {
            type = "🎩 플레이메이커";
            comment = "패스와 경기 운영 능력이 뛰어났습니다.";
        }

        if (p.reb >= 8) {
            type = "💪 리바운더";
            comment = "골밑에서 높은 리바운드 기여도를 보였습니다.";
        }

        if (p.stl + p.blk >= 4) {
            type = "🛡️ 수비 전문가";
            comment = "스틸과 블록으로 수비에서 큰 영향을 줬습니다.";
        }

        if (p.pts >= 10 && p.reb >= 5 && p.ast >= 4) {
            type = "⭐ 올라운더";
            comment = "득점, 리바운드, 패스에서 고르게 활약했습니다.";
        }

        if (three >= 35 && p.threeA >= 3 && p.stl + p.blk >= 2) {
            type = "🚀 3&D 플레이어";
            comment = "외곽슛과 수비에서 강점을 보였습니다.";
        }

        html += `
            <div style="padding:10px;border-bottom:1px solid #333;">
                <b>${name}</b><br>
                <strong>${type}</strong><br>
                <span>${comment}</span>
            </div>
        `;
    });

    box.innerHTML = html;
}