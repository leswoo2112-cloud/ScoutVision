function updateTeamStats() {
    let team = document.getElementById("team").value;
    let total = {
        pts: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        to: 0
    };

    Object.entries(players).forEach(function(item) {
        let p = item[1];

        total.pts += p.pts;
        total.reb += p.reb;
        total.ast += p.ast;
        total.stl += p.stl;
        total.blk += p.blk;
        total.to += p.to;
    });

    document.getElementById("teamStats").innerHTML = `
        <div class="stat">
            <b>${team}팀 팀기록</b><br>
            득점 : ${total.pts}<br>
            리바운드 : ${total.reb}<br>
            어시스트 : ${total.ast}<br>
            스틸 : ${total.stl}<br>
            블록 : ${total.blk}<br>
            턴오버 : ${total.to}
        </div>
    `;
}