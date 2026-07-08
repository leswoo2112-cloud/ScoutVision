function updateHeatMap(){

    let box = document.getElementById("heatmap");
    if(!box) return;

    let total2 = 0;
    let total3 = 0;
    let totalFT = 0;

    Object.values(players).forEach(function(p){
        total2 += p.fga - p.threeA;
        total3 += p.threeA;
        totalFT += p.fta;
    });

    box.innerHTML =
    "<h3>🔥 슛 분포</h3>" +
    "🏀 2점 시도 : " + total2 + "<br>" +
    "🎯 3점 시도 : " + total3 + "<br>" +
    "🟡 자유투 : " + totalFT;
}