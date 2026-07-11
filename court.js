let shots = [];

function initCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    drawCourt();

    // 중복 클릭 연결 방지
    if (court.dataset.ready === "true") return;
    court.dataset.ready = "true";

    court.addEventListener("click", function (event) {
        const rect = court.getBoundingClientRect();

        // 화면 크기와 실제 캔버스 크기 차이 보정
        const scaleX = court.width / rect.width;
        const scaleY = court.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        if (typeof addShotPoint === "function") {
            addShotPoint(x, y);
        }
    });
}

function drawCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    const ctx = court.getContext("2d");
    const width = court.width;
    const height = court.height;
    const centerX = width / 2;

    ctx.clearRect(0, 0, width, height);

    // 코트 바닥
    ctx.fillStyle = "#d9a15b";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 외곽선
    ctx.strokeRect(5, 5, width - 10, height - 10);

    // 베이스라인
    ctx.beginPath();
    ctx.moveTo(5, 8);
    ctx.lineTo(width - 5, 8);
    ctx.stroke();

    // 백보드
    ctx.beginPath();
    ctx.moveTo(centerX - 30, 28);
    ctx.lineTo(centerX + 30, 28);
    ctx.stroke();

    // 림
    ctx.beginPath();
    ctx.arc(centerX, 48, 9, 0, Math.PI * 2);
    ctx.stroke();

    // 림과 백보드 연결
    ctx.beginPath();
    ctx.moveTo(centerX, 28);
    ctx.lineTo(centerX, 39);
    ctx.stroke();

    // 페인트존 바깥
    ctx.strokeRect(centerX - 65, 8, 130, 182);

    // 페인트존 안쪽
    ctx.strokeRect(centerX - 40, 8, 80, 182);

    // 자유투 원
    ctx.beginPath();
    ctx.arc(centerX, 190, 42, 0, Math.PI * 2);
    ctx.stroke();

    // 제한구역 반원
    ctx.beginPath();
    ctx.arc(centerX, 48, 34, 0, Math.PI);
    ctx.stroke();

    // 3점 코너 직선
    ctx.beginPath();
    ctx.moveTo(30, 8);
    ctx.lineTo(30, 175);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 30, 8);
    ctx.lineTo(width - 30, 175);
    ctx.stroke();

    // 3점 아크
    ctx.beginPath();
    ctx.arc(
        centerX,
        48,
        145,
        Math.PI * 0.15,
        Math.PI * 0.85
    );
    ctx.stroke();

    // 코트 중앙선
    ctx.beginPath();
    ctx.moveTo(5, height - 70);
    ctx.lineTo(width - 5, height - 70);
    ctx.stroke();

    // 중앙 원 일부
    ctx.beginPath();
    ctx.arc(centerX, height - 70, 42, Math.PI, Math.PI * 2);
    ctx.stroke();

    // 슛 위치 표시
    shots.forEach(function (shot) {
        ctx.beginPath();

        ctx.fillStyle = shot.made ? "#00e84a" : "#ff2020";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        ctx.arc(shot.x, shot.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });
}

window.addEventListener("load", function () {
    setTimeout(function () {
        initCourt();
    }, 300);
});