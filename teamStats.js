function updateTeamStats() {
    let teamStats = document.getElementById("teamStats");
    if (!teamStats) return;

    let team = document.getElementById("team").value;

    let pts = 0;
    let reb = 0;
    let ast = 0;
    let stl = 0;
    let blk = 0;
    let to = 0;

    Object.values(players).forEach(function(p){
        pts += p.pts;
        reb += p.reb;
        ast += p.ast;
        stl += p.stl;
        blk += p.blk;
        to += p.to;
    });

    teamStats.innerHTML =
        "<h3>🏀 팀 기록</h3>" +
        "팀 : " + team + "<br>" +
        "득점 : " + pts + "<br>" +
        "리바운드 : " + reb + "<br>" +
        "어시스트 : " + ast + "<br>" +
        "스틸 : " + stl + "<br>" +
        "블록 : " + blk + "<br>" +
        "턴오버 : " + to;
}