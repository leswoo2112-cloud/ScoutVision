let shots = [];

function initCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    drawCourt();

    court.addEventListener("click", function(e) {
        const rect = court.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        addShotPoint(x, y);
    });
}

function drawCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    const ctx = court.getContext("2d");

    ctx.clearRect(0, 0, court.width, court.height);

    // 바닥
    ctx.fillStyle = "#D9A15B";
    ctx.fillRect(0, 0, court.width, court.height);

    // 외곽선
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, court.width - 10, court.height - 10);

    // 골대
    ctx.beginPath();
    ctx.arc(court.width / 2, 40, 8, 0, Math.PI * 2);
    ctx.stroke();

    // 자유투 라인
    ctx.strokeRect(court.width / 2 - 60, 40, 120, 120);

    // 슛 위치
    shots.forEach(function(s) {
        ctx.beginPath();
        ctx.fillStyle = s.made ? "lime" : "red";
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}
window.addEventListener("load", function(){
  setTimeout(function(){
    drawCourt();
  }, 800);
});