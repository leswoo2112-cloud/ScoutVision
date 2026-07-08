function updateReport(){
  let box = document.getElementById("ai");
  if(!box) return;

  let totalPts = 0;
  let totalReb = 0;
  let totalAst = 0;
  let totalTo = 0;

  Object.values(players).forEach(function(p){
    totalPts += p.pts;
    totalReb += p.reb;
    totalAst += p.ast;
    totalTo += p.to;
  });

  box.innerHTML +=
    "<br><br><h3>📋 경기 리포트</h3>" +
    "총 득점: " + totalPts + "<br>" +
    "총 리바운드: " + totalReb + "<br>" +
    "총 어시스트: " + totalAst + "<br>" +
    "총 턴오버: " + totalTo + "<br>" +
    "분석: " + makeReportText(totalPts, totalAst, totalTo);
}

function makeReportText(pts, ast, to){
  if(pts >= 30 && ast >= 8) return "공격 흐름이 좋았고 패스 연결도 안정적입니다.";
  if(to >= 8) return "턴오버가 많아서 공격 안정성이 필요합니다.";
  if(pts < 15) return "득점 생산력이 부족하니 슛 기회 창출이 필요합니다.";
  return "전체적으로 균형 잡힌 경기였습니다.";
}