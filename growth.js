const GROWTH_STORAGE_KEY = "scoutvision_growth_v1";

function calculateGrowthOVR(p) {
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

function loadGrowthData() {
    try {
        return JSON.parse(
            localStorage.getItem(GROWTH_STORAGE_KEY)
        ) || {};
    } catch (error) {
        return {};
    }
}

function saveGrowthData(data) {
    localStorage.setItem(
        GROWTH_STORAGE_KEY,
        JSON.stringify(data)
    );
}

function updateGrowth() {
    const canvas = document.getElementById("growthChart");
    const textBox = document.getElementById("growthText");

    if (!canvas || !textBox) return;
    if (typeof players === "undefined") return;

    const list = Object.entries(players);

    if (list.length === 0) {
        drawEmptyGrowthChart(canvas);
        textBox.innerHTML = "아직 경기 기록이 없습니다.";
        return;
    }

    let selectedName = "";
    let selectedPlayer = null;
    let highestScore = -Infinity;

    list.forEach(([name, p]) => {
        const score =
            (p.pts || 0) +
            (p.reb || 0) * 1.2 +
            (p.ast || 0) * 1.5 +
            (p.stl || 0) * 2 +
            (p.blk || 0) * 2 -
            (p.to || 0);

        if (score > highestScore) {
            highestScore = score;
            selectedName = name;
            selectedPlayer = p;
        }
    });

    if (!selectedPlayer) return;

    const currentOVR = calculateGrowthOVR(selectedPlayer);
    const growthData = loadGrowthData();

    if (!growthData[selectedName]) {
        growthData[selectedName] = [];
    }

    const history = growthData[selectedName];
    const lastValue = history.length
        ? history[history.length - 1].ovr
        : null;

    if (lastValue !== currentOVR) {
        history.push({
            ovr: currentOVR,
            time: Date.now()
        });

        if (history.length > 12) {
            history.shift();
        }

        saveGrowthData(growthData);
    }

    drawGrowthChart(
        canvas,
        selectedName,
        growthData[selectedName]
    );

    updateGrowthText(
        textBox,
        selectedName,
        growthData[selectedName]
    );
}

function drawEmptyGrowthChart(canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
        "아직 성장 기록이 없습니다.",
        width / 2,
        height / 2
    );
}

function drawGrowthChart(canvas, name, history) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const padding = 45;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${name} OVR 변화`, padding, 28);

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
        const y =
            padding +
            ((height - padding * 2) / 5) * i;

        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    if (history.length === 0) return;

    const values = history.map(item => item.ovr);
    const minValue = Math.max(
        45,
        Math.min(...values) - 5
    );
    const maxValue = Math.min(
        100,
        Math.max(...values) + 5
    );

    const range = Math.max(1, maxValue - minValue);
    const denominator = Math.max(1, history.length - 1);

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 4;
    ctx.beginPath();

    history.forEach((item, index) => {
        const x =
            padding +
            (index / denominator) *
            (width - padding * 2);

        const y =
            height -
            padding -
            ((item.ovr - minValue) / range) *
            (height - padding * 2);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    history.forEach((item, index) => {
        const x =
            padding +
            (index / denominator) *
            (width - padding * 2);

        const y =
            height -
            padding -
            ((item.ovr - minValue) / range) *
            (height - padding * 2);

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(item.ovr, x, y - 12);
    });
}

function updateGrowthText(box, name, history) {
    if (history.length === 0) {
        box.innerHTML = "아직 성장 기록이 없습니다.";
        return;
    }

    const firstOVR = history[0].ovr;
    const currentOVR = history[history.length - 1].ovr;
    const difference = currentOVR - firstOVR;

    let comment = "현재 OVR 기록을 분석하고 있습니다.";

    if (history.length === 1) {
        comment =
            "첫 OVR 기록이 저장되었습니다. 기록을 더 입력하면 변화가 표시됩니다.";
    } else if (difference >= 5) {
        comment =
            `최근 기록에서 OVR이 ${difference} 상승하며 뚜렷한 성장세를 보였습니다.`;
    } else if (difference > 0) {
        comment =
            `OVR이 ${difference} 상승하며 안정적으로 성장하고 있습니다.`;
    } else if (difference < 0) {
        comment =
            `OVR이 ${Math.abs(difference)} 하락했습니다. 턴오버와 슛 효율을 점검해 보세요.`;
    } else {
        comment =
            "OVR 변화가 없습니다. 다음 기록에서 성장 여부를 확인할 수 있습니다.";
    }

    box.innerHTML = `
        <h3>📈 성장 분석</h3>
        <b>${name}</b><br><br>
        시작 OVR: ${firstOVR}<br>
        현재 OVR: ${currentOVR}<br>
        변화: ${difference >= 0 ? "+" : ""}${difference}<br><br>
        🤖 ${comment}
    `;
}