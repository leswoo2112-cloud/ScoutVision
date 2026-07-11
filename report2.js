function updateReport2(){
  const reportBox = document.getElementById("report2");
  if(!reportBox) return;

  const playerList = Object.entries(players);

  if(playerList.length === 0){
    reportBox.innerHTML = "아직 경기 기록이 없습니다.";
    return;
  }

  let bestPts = ["없음", 0];
  let bestReb = ["없음", 0];
  let bestAst = ["없음", 0];

  playerList.forEach(function(item){
    const name = item[0];
    const p = item[1];

    if(p.pts > bestPts[1]){
      bestPts = [name, p.pts];
    }

    if(p.reb > bestReb[1]){
      bestReb = [name, p.reb];
    }

    if(p.ast > bestAst[1]){
      bestAst = [name, p.ast];
    }
  });

  reportBox.innerHTML =
    "<h2>📋 경기 리포트</h2>" +
    "<b>최고 득점</b><br>" +
    bestPts[0] + " " + bestPts[1] + "점<br><br>" +

    "<b>최다 리바운드</b><br>" +
    bestReb[0] + " " + bestReb[1] + "개<br><br>" +

    "<b>최다 어시스트</b><br>" +
    bestAst[0] + " " + bestAst[1] + "개<br><br>" +

    "<b>AI 한줄평</b><br>" +
    makeReport2Text(bestPts, bestReb, bestAst);
}

function makeReport2Text(bestPts, bestReb, bestAst){
  if(bestPts[1] >= 15){
    return bestPts[0] + "의 득점력이 돋보인 경기였습니다.";
  }

  if(bestAst[1] >= 5){
    return bestAst[0] + "의 패스 전개가 좋았습니다.";
  }

  if(bestReb[1] >= 7){
    return bestReb[0] + "의 리바운드 기여가 컸습니다.";
  }

  return "전체적으로 기록이 더 쌓이면 더 정확한 분석이 가능합니다.";
}

window.addEventListener("load", function(){
  updateReport2();
});