let shots = [];

function scoutInitCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    scoutDrawCourt();

    // 중복 클릭 연결 방지
    if (court.dataset.scoutReady === "true") return;
    court.dataset.scoutReady = "true";

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

function scoutDrawCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    const ctx = court.getContext("2d");
    if (!ctx) return;

    const width = court.width;
    const height = court.height;
    const centerX = width / 2;

    ctx.clearRect(0, 0, width, height);

    // 코트 바닥
    ctx.fillStyle = "#d9a15b";
    ctx.fillRect(0, 0, width, height);

    // 기본 선 설정
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 외곽선
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // 베이스라인
    ctx.beginPath();
    ctx.moveTo(6, 10);
    ctx.lineTo(width - 6, 10);
    ctx.stroke();

    // 백보드
    ctx.beginPath();
    ctx.moveTo(centerX - 32, 28);
    ctx.lineTo(centerX + 32, 28);
    ctx.stroke();

    // 림
    ctx.beginPath();
    ctx.arc(centerX, 50, 10, 0, Math.PI * 2);
    ctx.stroke();

    // 백보드와 림 연결
    ctx.beginPath();
    ctx.moveTo(centerX, 28);
    ctx.lineTo(centerX, 40);
    ctx.stroke();

    // 페인트존 바깥
    ctx.strokeRect(centerX - 65, 10, 130, 180);

    // 페인트존 안쪽
    ctx.strokeRect(centerX - 40, 10, 80, 180);

    // 자유투 원
    ctx.beginPath();
    ctx.arc(centerX, 190, 42, 0, Math.PI * 2);
    ctx.stroke();

    // 제한구역 반원
    ctx.beginPath();
    ctx.arc(centerX, 50, 35, 0, Math.PI);
    ctx.stroke();

    // 왼쪽 3점 코너
    ctx.beginPath();
    ctx.moveTo(30, 10);
    ctx.lineTo(30, 175);
    ctx.stroke();

    // 오른쪽 3점 코너
    ctx.beginPath();
    ctx.moveTo(width - 30, 10);
    ctx.lineTo(width - 30, 175);
    ctx.stroke();

    // 3점 아크
    ctx.beginPath();
    ctx.arc(
        centerX,
        50,
        145,
        Math.PI * 0.15,
        Math.PI * 0.85
    );
    ctx.stroke();

    // 하프코트 라인
    ctx.beginPath();
    ctx.moveTo(6, height - 70);
    ctx.lineTo(width - 6, height - 70);
    ctx.stroke();

    // 중앙 원 일부
    ctx.beginPath();
    ctx.arc(
        centerX,
        height - 70,
        42,
        Math.PI,
        Math.PI * 2
    );
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

// 다른 파일에서도 안전하게 호출할 수 있도록 등록
window.scoutDrawCourt = scoutDrawCourt;
window.scoutInitCourt = scoutInitCourt;

window.addEventListener("load", function () {
    setTimeout(function () {
        scoutInitCourt();
    }, 300);
});