let shots = [];

function initCourt() {
    const court = document.getElementById("court");
    if (!court) return;

    court.onclick = function (e) {

        const rect = court.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        shots.push({
            x: x,
            y: y,
            made: true
        });

        drawCourt();
    };
}

function drawCourt() {

    const court = document.getElementById("court");
    if (!court) return;

    const ctx = court.getContext("2d");

    ctx.clearRect(0,0,court.width,court.height);

    ctx.fillStyle="#f5d6a0";
    ctx.fillRect(0,0,court.width,court.height);

    ctx.strokeStyle="white";
    ctx.lineWidth=3;

    ctx.strokeRect(5,5,court.width-10,court.height-10);

    shots.forEach(function(s){

        ctx.beginPath();

        ctx.fillStyle=s.made?"lime":"red";

        ctx.arc(s.x,s.y,6,0,Math.PI*2);

        ctx.fill();

    });

}