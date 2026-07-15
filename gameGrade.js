function updateGameGrade(){

    const totalPts =
        teamA.score + teamB.score;

    const totalAst =
        Object.values(players).reduce((a,p)=>a+p.ast,0);

    const totalReb =
        Object.values(players).reduce((a,p)=>a+p.reb,0);

    const fg =
        teamFG();

    let score =
        fg*0.4 +
        totalAst*3 +
        totalReb*2 +
        totalPts;

    let grade="C";

    if(score>=140) grade="S+";
    else if(score>=120) grade="S";
    else if(score>=100) grade="A+";
    else if(score>=85) grade="A";
    else if(score>=70) grade="B";
    else if(score>=55) grade="C";
    else grade="D";

    document.getElementById("gameGrade").innerHTML=`
    <h3>🏀 경기 등급 : ${grade}</h3>

    ⭐ 경기 점수 ${Math.round(score)}

    <hr>

    🎯 팀 FG% : ${fg}%

    <br>

    🤝 어시스트 : ${totalAst}

    <br>

    💪 리바운드 : ${totalReb}

    <br>

    🏀 총득점 : ${totalPts}
    `;
}