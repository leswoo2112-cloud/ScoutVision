function updateZoneAnalysis() {
    const box = document.getElementById("zoneAnalysis");
    if (!box) return;

    if (typeof shots === "undefined" || shots.length === 0) {
        box.innerHTML = "아직 슛 데이터가 없습니다.";
        return;
    }

    const zones = {
        paint: makeZone("페인트존"),
        leftWing: makeZone("왼쪽 윙"),
        center: makeZone("탑"),
        rightWing: makeZone("오른쪽 윙"),
        leftCorner: makeZone("왼쪽 코너"),
        rightCorner: makeZone("오른쪽 코너")
    };

    shots.forEach(function (shot) {
        const zone = getShotZone(shot.x, shot.y);

        if (!zones[zone]) return;

        zones[zone].attempts++;

        if (shot.made) {
            zones[zone].made++;
        }
    });

    const zoneList = Object.values(zones);

    let hotZone = null;
    let coldZone = null;

    zoneList.forEach(function (zone) {
        zone.rate = zone.attempts
            ? Math.round((zone.made / zone.attempts) * 100)
            : 0;

        if (zone.attempts >= 2) {
            if (!hotZone || zone.rate > hotZone.rate) {
                hotZone = zone;
            }

            if (!coldZone || zone.rate < coldZone.rate) {
                coldZone = zone;
            }
        }
    });

    let html = "<h3>🎯 슛존 분석</h3>";

    zoneList.forEach(function (zone) {
        const status = getZoneStatus(zone);

        html += `
            <div style="
                padding:10px 0;
                border-bottom:1px solid #334155;
            ">
                <b>${status.icon} ${zone.name}</b><br>
                ${zone.made}/${zone.attempts}
                · 성공률 ${zone.rate}%
                · ${status.text}
            </div>
        `;
    });

    if (hotZone) {
        html += `
            <br>
            <div style="padding:12px;background:#14532d;border-radius:10px;">
                🔥 <b>HOT ZONE</b><br>
                ${hotZone.name} · 성공률 ${hotZone.rate}%
            </div>
        `;
    }

    if (coldZone) {
        html += `
            <br>
            <div style="padding:12px;background:#7f1d1d;border-radius:10px;">
                ❄️ <b>COLD ZONE</b><br>
                ${coldZone.name} · 성공률 ${coldZone.rate}%
            </div>
        `;
    }

    box.innerHTML = html;
}

function makeZone(name) {
    return {
        name,
        made: 0,
        attempts: 0,
        rate: 0
    };
}

function getShotZone(x, y) {
    if (y < 190 && x >= 110 && x <= 240) {
        return "paint";
    }

    if (y < 180 && x < 70) {
        return "leftCorner";
    }

    if (y < 180 && x > 280) {
        return "rightCorner";
    }

    if (x < 120) {
        return "leftWing";
    }

    if (x > 230) {
        return "rightWing";
    }

    return "center";
}

function getZoneStatus(zone) {
    if (zone.attempts === 0) {
        return {
            icon: "⚪",
            text: "기록 없음"
        };
    }

    if (zone.rate >= 60) {
        return {
            icon: "🔥",
            text: "매우 강함"
        };
    }

    if (zone.rate >= 45) {
        return {
            icon: "🟢",
            text: "안정적"
        };
    }

    if (zone.rate >= 30) {
        return {
            icon: "🟡",
            text: "보통"
        };
    }

    return {
        icon: "❄️",
        text: "개선 필요"
    };
}