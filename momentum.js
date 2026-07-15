function updateMomentum() {
    const box = document.getElementById("momentum");
    if (!box) return;

    if (typeof records === "undefined" || records.length === 0) {
        box.innerHTML = "아직 경기 데이터가 없습니다.";
        return;
    }

    let a = 0;
    let b = 0;

    let lastRun = {
        team: "",
        points: 0
    };

    let bestRun = {
        team: "",
        points: 0
    };

    records.forEach(r => {

        let pts = 0;

        if (r.type === "2P 성공") pts = 2;
        if (r.type === "3P 성공") pts = 3;
        if (r.type === "자유투 성공") pts = 1;

        if (pts === 0) return;

        const team = (players[r.name]?.team || "A").toUpperCase();

        if (team === "A") {
            a += pts;
        } else {
            b += pts;
        }

        if (lastRun.team === team) {
            lastRun.points += pts;
        } else {
            lastRun.team = team;
            lastRun.points = pts;
        }

        if (lastRun.points > bestRun.points) {
            bestRun.team = lastRun.team;
            bestRun.points = lastRun.points;
        }
    });

    let text = "";

    if (a > b) {

        text += "🔵 A팀이 경기 흐름을 주도하고 있습니다.<br><br>";

    } else if (b > a) {

        text += "🔴 B팀이 경기 분위기를 가져가고 있습니다.<br><br>";

    } else {

        text += "⚪ 현재 팽팽한 접전입니다.<br><br>";
    }

    text += `🔥 가장 큰 런 : ${bestRun.team}팀 ${bestRun.points}-0 RUN`;

    box.innerHTML = `
        <h3>📈 경기 모멘텀 분석</h3>

        ${text}

        <hr>

        🔵 A팀 : <b>${a}</b>점<br>
        🔴 B팀 : <b>${b}</b>점
    `;
}