function updateShotChart(){
  let made = 0;
  let miss = 0;

  Object.values(players).forEach(function(p){
    made += p.fgm;
    miss += p.fga - p.fgm;
  });

  let total = made + miss;
  let rate = total ? Math.round(made / total * 100) : 0;

  let chart = document.getElementById("shotChart");
  if(!chart) return;

  chart.innerHTML =
    "<h3>📊 슛 성공률</h3>" +
    "성공: " + made + " / 실패: " + miss + "<br>" +
    "성공률: " + rate + "%<br>" +
    "<div style='background:#333;border-radius:20px;margin-top:10px;overflow:hidden;'>" +
    "<div style='width:" + rate + "%;background:#ff8a00;padding:10px 0;text-align:center;font-weight:bold;'>" +
    rate + "%" +
    "</div></div>";
}