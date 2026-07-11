let shotMode = "make";

function setShotMode(mode) {
    shotMode = mode;
}

function addShotPoint(x, y) {
    if (typeof shots === "undefined") {
        shots = [];
    }

    const playerInput = document.getElementById("player");
    const videoBox = document.getElementById("video");

    shots.push({
        x: x,
        y: y,
        made: shotMode === "make",
        time: videoBox ? (videoBox.currentTime || 0) : 0,
        player: playerInput ? (playerInput.value.trim() || "선수") : "선수"
    });

    if (typeof drawCourt === "function") {
        drawCourt();
    }

    if (typeof updateShotChart === "function") {
        updateShotChart();
    }

    if (typeof updateHeatMap === "function") {
        updateHeatMap();
    }
}

function clearShots() {
    shots = [];

    if (typeof drawCourt === "function") {
        drawCourt();
    }

    if (typeof updateShotChart === "function") {
        updateShotChart();
    }

    if (typeof updateHeatMap === "function") {
        updateHeatMap();
    }
}

function countMade() {
    return shots.filter(function (s) {
        return s.made;
    }).length;
}

function countMiss() {
    return shots.filter(function (s) {
        return !s.made;
    }).length;
}