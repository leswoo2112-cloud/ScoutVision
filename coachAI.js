function updateCoachAI() {

    const box = document.getElementById("coachAI");
    if (!box) return;

    if (typeof players === "undefined") return;

    let total = {
        pts:0,
        reb:0,
        ast:0,
        stl:0,
        blk:0,
        to:0,
        fgm:0,
        fga:0
    };

    Object.values(players).forEach(p=>{

        total.pts += p.pts||0;
        total.reb += p.reb||0;
        total.ast += p.ast||0;
        total.stl += p.stl||0;
        total.blk += p.blk||0;
        total.to += p.to||0;
        total.fgm += p.fgm||0;
        total.fga += p.fga||0;

    });

    const fg =
        total.fga
        ? Math.round(total.fgm/total.fga*100)
        : 0;

    let tips=[];

    if(total.reb<10)
        tips.push("💪 리바운드 참여를 늘리면 세컨드 찬스가 증가합니다.");

    if(total.ast<8)
        tips.push("🤝 패스를 늘려 팀 공격을 다양하게 만들어 보세요.");

    if(total.to>=5)
        tips.push("❌ 턴오버를 줄이면 승률이 크게 향상됩니다.");

    if(fg<45)
        tips.push("🎯 슛 선택을 개선하면 공격 효율이 높아집니다.");

    if(total.stl+total.blk<5)
        tips.push("🛡️ 수비 압박을 강화하면 상대 득점을 줄일 수 있습니다.");

    if(tips.length===0){

        tips.push("🔥 매우 좋은 경기입니다. 현재 경기 운영을 유지하세요.");
    }

    box.innerHTML=`

<h3>🤖 AI 감독 분석</h3>

${tips.map(t=>`<p>${t}</p>`).join("")}

<hr>

<b>팀 FG%</b> : ${fg}%<br>
<b>총 득점</b> : ${total.pts}<br>
<b>총 리바운드</b> : ${total.reb}<br>
<b>총 어시스트</b> : ${total.ast}

`;

}