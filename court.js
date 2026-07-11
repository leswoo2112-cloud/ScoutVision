let shots = [];

function initCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    drawCourt();

    court.addEventListener("click", function (e) {

        const rect = court.getBoundingClientRect();

        const scaleX = court.width / rect.width;
        const scaleY = court.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        if (typeof addShotPoint === "function") {
            addShotPoint(x, y);
        }
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

    // 외곽
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, court.width - 10, court.height - 10);

    // 골대
    ctx.beginPath();
    ctx.arc(court.width / 2, 40, 8, 0, Math.PI * 2);
    ctx.stroke();

    // 백보드
    ctx.beginPath();
    ctx.moveTo(court.width / 2 - 25, 25);
    ctx.lineTo(court.width / 2 + 25, 25);
    ctx.stroke();

    // 페인트존
    ctx.strokeRect(court.width / 2 - 60, 40, 120, 120);

    // 자유투 원
    ctx.beginPath();
    ctx.arc(court.width / 2, 160, 35, 0, Math.PI);
    ctx.stroke();

    // 림까지 선
    ctx.beginPath();
    ctx.moveTo(court.width / 2, 40);
    ctx.lineTo(court.width / 2, 160);
    ctx.stroke();

    // 3점 라인
    ctx.beginPath();
    ctx.arc(court.width / 2, 40, 210, Math.PI * 0.18, Math.PI * 0.82);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(45, 250);
    ctx.lineTo(45, 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(court.width - 45, 250);
    ctx.lineTo(court.width - 45, 40);
    ctx.stroke();

    // 슛 위치
    shots.forEach(function (s) {

        ctx.beginPath();

        ctx.fillStyle = s.made ? "lime" : "red";

        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);

        ctx.fill();
    });

}

window.addEventListener("load", function () {
    setTimeout(initCourt, 300);
});