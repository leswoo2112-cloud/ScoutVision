function updateWinPrediction() {

    const box = document.getElementById("winPrediction");
    if (!box) return;

    let blue = {
        pts:0,
        reb:0,
        ast:0,
        stl:0,
        blk:0,
        to:0,
        fgm:0,
        fga:0
    };

    let red = {
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

        const team=(p.team||"A").toUpperCase();

        const target = team==="A" ? blue : red;

        target.pts+=p.pts||0;
        target.reb+=p.reb||0;
        target.ast+=p.ast||0;
        target.stl+=p.stl||0;
        target.blk+=p.blk||0;
        target.to+=p.to||0;
        target.fgm+=p.fgm||0;
        target.fga+=p.fga||0;

    });

    function score(t){

        const fg=t.fga? t.fgm/t.fga*100 :50;

        return (
            t.pts*1+
            t.reb*1.2+
            t.ast*1.5+
            t.stl*2+
            t.blk*2-
            t.to*1.3+
            fg*0.2
        );

    }

    const aScore=score(blue);
    const bScore=score(red);

    const total=Math.max(1,aScore+bScore);

    const a=Math.round(aScore/total*100);
    const b=100-a;

    let text="";

    if(a>b){

        text="A팀이 리바운드와 공격 효율에서 우세합니다.";

    }else if(b>a){

        text="B팀이 전체 경기 흐름을 주도하고 있습니다.";

    }else{

        text="양 팀의 전력이 비슷한 접전입니다.";

    }

    box.innerHTML=`
    <h3>🏆 AI 승률 분석</h3>

    🔵 A팀 승률 : <b>${a}%</b><br>
    🔴 B팀 승률 : <b>${b}%</b>

    <br><br>

    🤖 ${text}
    `;
}