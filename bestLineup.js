function updateBestLineup() {
    const box = document.getElementById("bestLineup");
    if (!box) return;

    if (typeof players === "undefined") {
        box.innerHTML = "아직 선수 데이터가 없습니다.";
        return;
    }

    const list = Object.entries(players);

    if (list.length === 0) {
        box.innerHTML = "아직 선수 데이터가 없습니다.";
        return;
    }

    function getOVR(p) {
        const fg = p.fga
            ? Math.round((p.fgm / p.fga) * 100)
            : 0;

        let ovr =
            60 +
            (p.pts || 0) * 0.8 +
            (p.reb || 0) * 1.2 +
            (p.ast || 0) * 1.4 +
            (p.stl || 0) * 2 +
            (p.blk || 0) * 2 +
            fg * 0.08 -
            (p.to || 0) * 1.5;

        return Math.max(50, Math.min(99, Math.round(ovr)));
    }

    function getPositionScore(p, position) {
        const pts = p.pts || 0;
        const reb = p.reb || 0;
        const ast = p.ast || 0;
        const stl = p.stl || 0;
        const blk = p.blk || 0;
        const to = p.to || 0;
        const fg = p.fga ? (p.fgm / p.fga) * 100 : 0;

        if (position === "PG") {
            return (
                ast * 3 +
                stl * 2 +
                pts * 1.1 +
                fg * 0.1 -
                to * 2
            );
        }

        if (position === "SG") {
            return (
                pts * 2 +
                fg * 0.2 +
                stl * 1.5 +
                ast * 1.2 -
                to * 1.5
            );
        }

        if (position === "SF") {
            return (
                pts * 1.5 +
                reb * 1.5 +
                ast * 1.3 +
                stl * 1.7 +
                blk * 1.2 -
                to
            );
        }

        if (position === "PF") {
            return (
                reb * 2.2 +
                pts * 1.3 +
                blk * 2 +
                stl +
                fg * 0.08 -
                to
            );
        }

        return (
            reb * 2.5 +
            blk * 3 +
            pts * 1.2 +
            fg * 0.1 -
            to
        );
    }

    const positions = ["PG", "SG", "SF", "PF", "C"];
    const usedPlayers = new Set();
    const lineup = [];

    positions.forEach(position => {
        let bestName = "";
        let bestPlayer = null;
        let bestScore = -Infinity;

        list.forEach(([name, p]) => {
            if (usedPlayers.has(name)) return;

            const positionScore = getPositionScore(p, position);

            if (positionScore > bestScore) {
                bestScore = positionScore;
                bestName = name;
                bestPlayer = p;
            }
        });

        if (bestPlayer) {
            usedPlayers.add(bestName);

            lineup.push({
                position,
                name: bestName,
                ovr: getOVR(bestPlayer),
                player: bestPlayer
            });
        }
    });

    if (lineup.length === 0) {
        box.innerHTML = "아직 선수 데이터가 없습니다.";
        return;
    }

    let reason = "공격과 수비의 균형을 고려한 라인업입니다.";

    const totalAst = lineup.reduce(
        (sum, item) => sum + (item.player.ast || 0),
        0
    );

    const totalReb = lineup.reduce(
        (sum, item) => sum + (item.player.reb || 0),
        0
    );

    const totalDefense = lineup.reduce(
        (sum, item) =>
            sum +
            (item.player.stl || 0) +
            (item.player.blk || 0),
        0
    );

    if (totalAst >= 15) {
        reason = "패스와 경기 운영 능력이 뛰어난 라인업입니다.";
    } else if (totalReb >= 25) {
        reason = "리바운드와 골밑 장악력이 강한 라인업입니다.";
    } else if (totalDefense >= 12) {
        reason = "스틸과 블록을 중심으로 수비력이 뛰어난 라인업입니다.";
    }

    let html = `
        <h3>🏅 AI 추천 라인업</h3>
    `;

    lineup.forEach(item => {
        html += `
            <div style="
                padding:10px 0;
                border-bottom:1px solid #334155;
            ">
                <b>${item.position}</b> :
                ${item.name}
                <span style="color:#facc15;">
                    OVR ${item.ovr}
                </span>
            </div>
        `;
    });

    html += `
        <br>
        🤖 ${reason}
    `;

    box.innerHTML = html;
}