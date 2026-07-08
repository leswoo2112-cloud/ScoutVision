let shotMode = "make";

function setShotMode(mode){
    shotMode = mode;
}

function addShotPoint(x, y){
    shots.push({
        x: x,
        y: y,
        made: shotMode === "make"
    });

    drawCourt();
}

function drawCourt(){
    const court = document.getElementById("court");
    if(!court) return;

    const ctx = court.getContext("2d");

    ctx.clearRect(0, 0, court.width, court.height);

    ctx.fillStyle = "#f5d6a0";
    ctx.fillRect(0, 0, court.width, court.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    ctx.strokeRect(5, 5, court.width - 10, court.height - 10);

    shots.forEach(function(s){
        ctx.beginPath();
        ctx.fillStyle = s.made ? "lime" : "red";
        ctx.arc(s.x, s.y, 7, 0, Math.PI * 2);
        ctx.fill();
    });
}