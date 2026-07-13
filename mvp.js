function updateMVP(){

    const box = document.getElementById("mvp");
    if(!box) return;

    let bestName = "";
    let bestScore = -1;
    let bestPlayer = null;

    Object.entries(players).forEach(function(item){

        const name = item[0];
        const p = item[1];

        const fg = p.fga ? Math.round((p.fgm / p.fga) * 100) : 0;

        const missedShots = Math.max(0, p.fga - p.fgm);
const missedFT = Math.max(0, p.fta - p.ftm);

let score =
    p.pts +
    p.reb * 1.2 +
    p.ast * 1.5 +
    p.stl * 2.5 +
    p.blk * 2.5 -
    p.to * 1.5 -
    missedShots * 0.5 -
    missedFT * 0.25;

        if(score > bestScore){
            bestScore = score;
            bestName = name;
            bestPlayer = p;
        }

    });

    if(!bestPlayer){
        box.innerHTML = "<h2>🏆 MVP</h2><p>아직 기록 없음</p>";
        return;
    }

    const fg = bestPlayer.fga
        ? Math.round(bestPlayer.fgm / bestPlayer.fga * 100)
        : 0;

    box.innerHTML = `
        <h2>🏆 오늘의 MVP</h2>
        <h3>${bestName}</h3>
        <p>
        득점 ${bestPlayer.pts}점<br>
        리바운드 ${bestPlayer.reb}<br>
        어시스트 ${bestPlayer.ast}<br>
        스틸 ${bestPlayer.stl}<br>
        블록 ${bestPlayer.blk}<br>
        FG ${fg}%<br>
MVP 점수 ${bestScore.toFixed(1)}
        </p>
    `;
}