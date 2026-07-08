let shotMode = "make";

function setShotMode(mode){
    shotMode = mode;
}

function addShotPoint(x, y){

    if(typeof shots === "undefined"){
        shots = [];
    }

    shots.push({
        x: x,
        y: y,
        made: shotMode === "make",
        time: video ? video.currentTime : 0,
        player: document.getElementById("player").value || "선수"
    });

    drawCourt();
}

function clearShots(){

    shots = [];

    drawCourt();

}

function countMade(){

    return shots.filter(function(s){
        return s.made;
    }).length;

}

function countMiss(){

    return shots.filter(function(s){
        return !s.made;
    }).length;

}