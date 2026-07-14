function updateTeamCompare() {

    const box = document.getElementById("teamCompare");
    if (!box) return;

    let A = {
        pts:0,
        reb:0,
        ast:0,
        stl:0,
        to:0
    };

    let B = {
        pts:0,
        reb:0,
        ast:0,
        stl:0,
        to:0
    };

    Object.entries(players).forEach(function(item){

        const name = item[0];
        const p = item[1];

        const team =
            teamPlayers.A.includes(name)
            ? A
            : B;

        team.pts += p.pts;
        team.reb += p.reb;
        team.ast += p.ast;
        team.stl += p.stl;
        team.to += p.to;

    });

    box.innerHTML = `
    <h3>📊 팀 기록 비교</h3>

    <p>🏀 득점 : 🔵 ${A.pts} : ${B.pts} 🔴</p>

    <p>💪 리바운드 : 🔵 ${A.reb} : ${B.reb} 🔴</p>

    <p>🤝 어시스트 : 🔵 ${A.ast} : ${B.ast} 🔴</p>

    <p>🛡️ 스틸 : 🔵 ${A.stl} : ${B.stl} 🔴</p>

    <p>❌ 턴오버 : 🔵 ${A.to} : ${B.to} 🔴</p>

    `;
}